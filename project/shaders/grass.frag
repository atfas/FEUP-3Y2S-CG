#ifdef GL_ES
precision mediump float;
#endif

uniform vec3  uSunDirection;
uniform float uDeadGrass; // 0.0 = living green, 1.0 = dead brown

varying float vHeight;

void main() {
    // Living: dark earthy green → bright yellow-green
    vec3 liveBase = vec3(0.10, 0.28, 0.08);
    vec3 liveTip  = vec3(0.38, 0.65, 0.18);

    // Dead: dark brown at base → pale straw at tip
    vec3 deadBase = vec3(0.22, 0.15, 0.05);
    vec3 deadTip  = vec3(0.62, 0.50, 0.22);

    vec3 baseColor = mix(liveBase, deadBase, uDeadGrass);
    vec3 tipColor  = mix(liveTip,  deadTip,  uDeadGrass);
    vec3 color = mix(baseColor, tipColor, vHeight);

    // Simple sun-direction diffuse tint
    float sunHeight = max(normalize(uSunDirection).y, 0.0);
    float lightIntensity = clamp(0.35 + sunHeight * 0.65, 0.0, 1.0);

    // Soft AO: darken slightly at the base
    float ao = 0.5 + 0.5 * vHeight;

    gl_FragColor = vec4(color * lightIntensity * ao, 1.0);
}
