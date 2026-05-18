#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uSeed;
uniform vec3 uSunDir;
uniform int  uRockType; // 0=grey 1=orange 2=black 3=greenish

float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix( 
        mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y),
        f.z
    );
}

void main() {
    float n = noise(vPosition * 4.0 + uSeed);

    vec3 dark, light;
    if (uRockType == 0) {
        // neutral gray
        dark  = vec3(0.25, 0.23, 0.20);
        light = vec3(0.65, 0.62, 0.55);
    } else if (uRockType == 1) {
        // warm tan/orange
        dark  = vec3(0.45, 0.30, 0.18);
        light = vec3(0.80, 0.65, 0.45);
    } else if (uRockType == 2) {
        // very dark, near-black
        dark  = vec3(0.07, 0.07, 0.08);
        light = vec3(0.28, 0.26, 0.28);
    } else {
        // greenish gray
        dark  = vec3(0.18, 0.22, 0.13);
        light = vec3(0.42, 0.50, 0.33);
    }

    vec3 color = mix(dark, light, n);

    float diffuse = max(dot(normalize(vNormal), normalize(uSunDir)), 0.0);
    color *= 0.25 + 0.75 * diffuse;

    gl_FragColor = vec4(color, 1.0);
}
