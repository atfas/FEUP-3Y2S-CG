#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNormal;
varying vec2 vTexCoord;

uniform sampler2D uSampler;
uniform vec3 uSunDir;
uniform int uRockType;

void main() {
    vec3 tint;
    if (uRockType == 0)
        tint = vec3(1.0, 1.0, 1.0);        // natural / no tint
    else if (uRockType == 1)
        tint = vec3(1.0, 0.75, 0.45);      // warm orange
    else if (uRockType == 2)
        tint = vec3(0.35, 0.35, 0.40);     // dark grey / near-black
    else
        tint = vec3(0.65, 0.85, 0.55);     // greenish

    vec3 color = texture2D(uSampler, vTexCoord).rgb * tint;

    float diffuse = max(dot(normalize(vNormal), normalize(uSunDir)), 0.0);
    color *= 0.25 + 0.75 * diffuse;

    gl_FragColor = vec4(color, 1.0);
}
