attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform sampler2D uHeightMap;
uniform float uHeightScale;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;
varying float vEdgeFactor;

void main() {
    vTextureCoord = aTextureCoord;

    // Heightmap UV (0..1) separate from tiling UV (0..30)
    vec2 heightUV = aTextureCoord / 30.0;

    float texelSize = 1.0 / 512.0;
    float hL = texture2D(uHeightMap, heightUV + vec2(-texelSize, 0.0)).r;
    float hR = texture2D(uHeightMap, heightUV + vec2( texelSize, 0.0)).r;
    float hD = texture2D(uHeightMap, heightUV + vec2(0.0, -texelSize)).r;
    float hU = texture2D(uHeightMap, heightUV + vec2(0.0,  texelSize)).r;
    float h  = texture2D(uHeightMap, heightUV).r;

    // Distance from center (0..1), 0=center, 1=corner
    vec2 centered = heightUV * 2.0 - 1.0;
    float dist = length(centered);

    // Edge mountain ring
    float edgeStart = 0.85;
    float edgeFactor = smoothstep(edgeStart, 1.0, dist);
    vEdgeFactor = edgeFactor;  // pass to frag shader

    // Sample heightmap at higher frequency for jagged peaks
    vec2 mountainUV = heightUV * 4.0;
    float mountainNoise = texture2D(uHeightMap, mountainUV).r;

    float noiseVariation = mountainNoise * 0.7 + 0.3;
    float edgeHeight = edgeFactor * edgeFactor * 0.3 * noiseVariation;

    float totalHeight = h * uHeightScale + edgeHeight;
    vec3 displaced = aVertexPosition + vec3(0.0, 0.0, totalHeight);

    vec3 computedNormal = normalize(vec3(hL - hR, hD - hU, 2.0 * texelSize));
    vTransformedNormal = computedNormal;

    vPosition = uMVMatrix * vec4(displaced, 1.0);
    gl_Position = uPMatrix * vPosition;
}
