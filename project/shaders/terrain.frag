#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uSampler;
uniform vec3 uSunDir;
uniform float uSunElevation;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;

void main() {
    vec3 N = normalize(vTransformedNormal);
    vec3 L = normalize(uSunDir);

    float elev = uSunElevation / 180.0 * 3.14159;
    float sunStrength = max(sin(elev), 0.0);

    float ambient = 0.5;                                    // raised from 0.35
    float diffuse = max(dot(N, L), 0.0) * sunStrength * 1.5; // boosted multiplier

    float light = clamp(ambient + diffuse, 0.0, 1.0);

    vec3 texColor = texture2D(uSampler, vTextureCoord).rgb;
    gl_FragColor = vec4(texColor * light, 1.0);
}