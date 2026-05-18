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
    vTextureCoord = aTextureCoord;

    float texelSize = 1.0 / 512.0;
    float hL = texture2D(uHeightMap, aTextureCoord + vec2(-texelSize, 0.0)).r;
    float hR = texture2D(uHeightMap, aTextureCoord + vec2( texelSize, 0.0)).r;
    float hD = texture2D(uHeightMap, aTextureCoord + vec2(0.0, -texelSize)).r;
    float hU = texture2D(uHeightMap, aTextureCoord + vec2(0.0,  texelSize)).r;
    float h  = texture2D(uHeightMap, aTextureCoord).r;

    vec3 displaced = aVertexPosition + vec3(0.0, 0.0, h * uHeightScale);

    vec3 computedNormal = normalize(vec3((hL - hR), (hD - hU), 2.0 * texelSize));
    vTransformedNormal = normalize((uNMatrix * vec4(computedNormal, 0.0)).xyz);

    vPosition = uMVMatrix * vec4(displaced, 1.0);
    gl_Position = uPMatrix * vPosition;
}