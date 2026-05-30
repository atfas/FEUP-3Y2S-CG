#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec3 vNormal;

uniform vec3  uSunDirection;
uniform float uNumStacks;

void main() {
    float panel = floor(vTextureCoord.y * uNumStacks);
    vec3 canvasColor;
    if (panel == 1.0 || panel == 3.0) {
        canvasColor = vec3(0, 0, 0.5);
    } else {
        canvasColor = vec3(0.90, 0.85, 0.70);
    }

    float diffuse = max(dot(normalize(vNormal), uSunDirection), 0.0);
    float light   = 0.35 + 0.80 * diffuse;

    gl_FragColor = vec4(canvasColor * light, 1.0);
}
