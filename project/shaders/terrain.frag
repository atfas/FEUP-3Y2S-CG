#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uSampler;   // grass texture (unit 0)
uniform sampler2D uHeightMap; // heightmap (unit 1)
uniform sampler2D uPathMask;  // path mask (unit 2)
uniform sampler2D uPathTex;   // path texture (unit 3)
uniform vec3 uSunDir;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying float vEdgeFactor;

void main() {
    vec3 L = normalize(uSunDir);
    float sunHeight = max(L.y, 0.0);
    float light = clamp(0.4 + sunHeight * 0.6, 0.0, 1.0);

    // Grass texture (tiled 30x)
    vec3 grassColor = texture2D(uSampler, vTextureCoord).rgb;

    // Path texture (same tiling as grass)
    vec3 pathColor = texture2D(uPathTex, vTextureCoord).rgb;

    // Path mask sampled at 0..1 UV (not tiled)
    float pathAmount = texture2D(uPathMask, vTextureCoord / 30.0).r;

    // Suppress path where mountains rise
    pathAmount *= 1.3 - smoothstep(0.0, 1.0, vEdgeFactor);

    // Blend grass and path texture based on mask
    vec3 texColor = mix(grassColor, pathColor, pathAmount);

    gl_FragColor = vec4(texColor * light, 1.0);
}
