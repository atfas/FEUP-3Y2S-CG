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

void main() {
    vTextureCoord = aTextureCoord;  // 0..30, used for colour tiling in frag

    // Heightmap needs 0..1 UV, so divide by the tile count
    vec2 heightUV = aTextureCoord / 30.0;

    float texelSize = 1.0 / 512.0;
    float hL = texture2D(uHeightMap, heightUV + vec2(-texelSize, 0.0)).r;
    float hR = texture2D(uHeightMap, heightUV + vec2( texelSize, 0.0)).r;
    float hD = texture2D(uHeightMap, heightUV + vec2(0.0, -texelSize)).r;
    float hU = texture2D(uHeightMap, heightUV + vec2(0.0,  texelSize)).r;
    float h  = texture2D(uHeightMap, heightUV).r;

    vec3 displaced = aVertexPosition + vec3(0.0, 0.0, h * uHeightScale);

    vec3 computedNormal = normalize(vec3(hL - hR, hD - hU, 2.0 * texelSize));
    vTransformedNormal = computedNormal;

    vPosition = uMVMatrix * vec4(displaced, 1.0);
    gl_Position = uPMatrix * vPosition;
}