#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec3 vNormal;
uniform sampler2D uSampler;
uniform vec3 uSunDirection;

void main() {
	float light  = 0.35 + 0.80 * max(dot(normalize(vNormal), uSunDirection), 0.0);
	gl_FragColor = vec4(texture2D(uSampler, vTextureCoord).rgb * light, 1.0);
}

