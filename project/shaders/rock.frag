#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNormal;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec3 uSunDirection;
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

    vec3 rockColor = texture2D(uSampler, vTextureCoord).rgb * tint;

    float diffuseLight = max(dot(normalize(vNormal), normalize(uSunDirection)), 0.0);
    rockColor *= 0.25 + 0.75 * diffuseLight;

    gl_FragColor = vec4(rockColor, 1.0);
}
