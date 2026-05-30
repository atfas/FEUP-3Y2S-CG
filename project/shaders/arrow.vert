attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float uTimeFactor;

void main() {
    float verticalBob = sin(uTimeFactor * 3.0) * 0.35;
    vec4 mvPos = uMVMatrix * vec4(aVertexPosition, 1.0);
    mvPos.y += verticalBob;
    gl_Position = uPMatrix * mvPos;
}
