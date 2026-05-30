attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float uNumStacks; 
uniform float uQuadraticDepth;  

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main() {
    // Local parameter within the current stack segment: 0 at a rib, 1 at the next rib
    float h = aTextureCoord.y;
    float t = fract(h * uNumStacks);

    // Quadratic quadratic: zero at both rib edges, peaks at the midpoint of each panel
    float quadratic    = uQuadraticDepth * 4.0 * t * (1.0 - t);

    // Derivative of quadratic w.r.t. h — used to tilt the surface normal along the axis
    float dsagdh = uNumStacks * uQuadraticDepth * 4.0 * (1.0 - 2.0 * t);

    // Displace radially inward (opposite the outward cylinder normal)
    vec3 position = aVertexPosition - aVertexNormal * quadratic;

    // Perturbed normal: the quadratic gradient tilts the normal along the stack axis.
    // For a cylinder, aVertexNormal = (cos, sin, 0), so the corrected normal is
    // normalize(cos, sin, dsag/dh) — the z component comes from the axial tilt.
    vec3 perturbedNormal = normalize(vec3(aVertexNormal.xy, dsagdh));

    gl_Position   = uPMatrix * uMVMatrix * vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal       = normalize(vec3(uNMatrix * vec4(perturbedNormal, 0.0)));
}
