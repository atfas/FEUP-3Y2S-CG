import { CGFobject } from '../../../../lib/CGF.js';

/**
 * RoofPanel — one sloped quadrilateral section of the gambrel barn roof.
 * The face normal is computed automatically from the first triangle so the
 * panel shades correctly regardless of orientation.
 * @param {CGFscene}  scene
 * @param {number[]}  corners - flat array of 12 values: [x0,y0,z0, x1,y1,z1, x2,y2,z2, x3,y3,z3]
 */
export class RoofPanel extends CGFobject {
    constructor(scene, corners) {
        super(scene);
        this.corners = corners;
        this.initBuffers();
    }

    /**
     * Derives the face normal from the cross-product of the first two edges,
     * applies it to all four vertices, and emits both winding orders so the
     * panel is visible from outside and inside the barn.
     */
    initBuffers() {
        const c = this.corners;

        this.vertices = [...c];   // 4 verts

        // Compute face normal from first triangle (0 - 1 - 2)
        const ax = c[3]-c[0], ay = c[4]-c[1], az = c[5]-c[2];
        const bx = c[6]-c[0], by = c[7]-c[1], bz = c[8]-c[2];
        const nx = ay*bz - az*by;
        const ny = az*bx - ax*bz;
        const nz = ax*by - ay*bx;
        const len = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;

        const n = [nx/len, ny/len, nz/len];

        this.normals = [
            ...n, ...n, ...n, ...n,
        ];

        this.texCoords = [
            0,1,
            1,1,
            1,0,
            0,0,
        ];

        this.indices = [
            0,1,2,
            0,2,3,   // outside
            2,1,0,
            3,2,0,   // inside (double-sided)
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
