attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform sampler2D uSampler2;
uniform float uTimeFactor;
uniform float uNormScale;

varying vec2 vTextureCoord;

void main() {

    // animate texture coordinates over time
    vTextureCoord = aTextureCoord + vec2(uTimeFactor * 0.01, uTimeFactor * 0.007);

    // sample the waterMap at the animated coordinates for height displacement
    vec4 heightMap = texture2D(uSampler2, vTextureCoord);
    float displacementHeight = heightMap.r;

    // displace vertex along its normal
    vec3 displacedPosition = aVertexPosition + aVertexNormal * displacementHeight * uNormScale * 0.01;

    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);
}
