#ifdef GL_ES
precision highp float;
#endif

uniform float uTimeFactor;

void main() {
    float colorPulse = 0.8 + 0.2 * sin(uTimeFactor * 3.0);
    gl_FragColor = vec4(1.0, 0.75 * colorPulse, 0.0, 1.0);
}
