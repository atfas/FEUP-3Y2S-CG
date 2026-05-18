#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uSampler;
uniform vec3 uSunDir;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;

void main() {
    vec3 L = normalize(uSunDir);
    float sunHeight = max(L.y, 0.0);

    float light = clamp(0.4 + sunHeight * 0.6, 0.0, 1.0);

    vec3 texColor = texture2D(uSampler, vTextureCoord).rgb;
    gl_FragColor = vec4(texColor * light, 1.0);
}