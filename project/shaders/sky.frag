#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float uTimeFactor;

void main() {
    // animate the two textures at different speeds for more natural water effect
    vec2 animatedTexCoord1 = vTextureCoord + vec2(uTimeFactor * 0.01, uTimeFactor * 0.007);
    vec2 animatedTexCoord2 = vTextureCoord + vec2(-uTimeFactor * 0.008, uTimeFactor * 0.005);

    vec4 skyColor  = texture2D(uSampler,  animatedTexCoord1);
    vec4 cloudMask = texture2D(uSampler2, animatedTexCoord2);

    if (cloudMask.b > 0.5)
        skyColor = skyColor * 0.8;

    gl_FragColor = skyColor;
}
