#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;
varying vec4 normal;

void main() {
        if(coords.y > 0.5){
            gl_FragColor =  normal;
            gl_FragColor.rgb = vec3(1.0, 1.0, 0.0);
        }
        else{
            gl_FragColor =  normal;
            gl_FragColor.rgb = vec3(0.0, 0.0, 1.0);
        }
}