attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float uTime;          // time in seconds, sent from MyScene.update()
uniform float uWindStrength;  // 0 = no wind, 1 = full, GUI-controlled

varying float vHeight;
varying vec3  vNormal;

void main() {
    vHeight = aTextureCoord.y;  // 0 at base, 1 at tip
    vNormal = normalize((uNMatrix * vec4(aVertexNormal, 0.0)).xyz);

    vec3 pos = aVertexPosition;

    // Only the tip moves — weight by vHeight^2 so the base is fully anchored
    // and the sway accelerates toward the tip
    float weight = vHeight * vHeight;

    // Primary wave: main wind direction (X axis in plane space)
    float wave1 = sin(uTime * 2.0 + pos.x * 12.0 + pos.y * 8.0) * 0.6;

    // Secondary wave: slower cross-wind gust (Y axis), out of phase
    float wave2 = sin(uTime * 1.3 + pos.x * 7.0  - pos.y * 5.0) * 0.3;

    // Combine into a 2D displacement in plane local space (Z is up after scene rotation)
    float dx = (wave1 + wave2) * uWindStrength * 0.004;
    float dy =  wave2          * uWindStrength * 0.002;

    pos.x += dx * weight;
    pos.y += dy * weight;

    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
}