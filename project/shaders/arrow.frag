#ifdef GL_ES
precision highp float;
#endif

uniform float uTimeFactor;

varying float vBob;

void main() {
    float pulse = 0.8 + 0.2 * sin(uTimeFactor * 3.0); //change color
    gl_FragColor = vec4(1.0, 0.75 * pulse, 0.0, 1.0);
}
