#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float timeFactor;

void main() {
    // animate the two textures at different speeds for more natural water effect
    vec2 animCoord1 = vTextureCoord + vec2(timeFactor * 0.01, timeFactor * 0.007);
    vec2 animCoord2 = vTextureCoord + vec2(-timeFactor * 0.008, timeFactor * 0.005);

    vec4 color = texture2D(uSampler, animCoord1);
    vec4 filter = texture2D(uSampler2, animCoord2);

    if (filter.b > 0.5)
        //color = vec4(0.52, 0.18, 0.11, 1.0);
        color = color * 0.8;

    gl_FragColor = color;
}