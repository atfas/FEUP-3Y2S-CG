attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform vec3 uSeed;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTextureCoord;

float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y),
        f.z
    );
}

void main() {
    // Push each vertex outward along its normal by a noise amount
    // uSeed makes each rock look different
    float displacement = noise(aVertexPosition * 3.5 + uSeed) * 0.3 - 0.05;
    vec3 displacedPosition = aVertexPosition + aVertexNormal * displacement;

    vNormal      = normalize((uNMatrix * vec4(aVertexNormal, 0.0)).xyz);
    vPosition    = aVertexPosition;
    vTextureCoord = aTextureCoord;
    gl_Position  = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);
}
