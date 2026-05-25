attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying float vHeight;
varying vec3  vNormal;

void main() {
    vHeight = aTextureCoord.y;
    vNormal = normalize((uNMatrix * vec4(aVertexNormal, 0.0)).xyz);

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}