import { CGFobject } from '../../../lib/CGF.js';

/**
 * MyDisk
 * A filled circle on the XY plane, centred at the origin, radius 1.
 * Normals point along +Z (front face) and -Z (back face) so both sides render.
 */
export class MyDisk extends CGFobject {
    constructor(scene, slices = 20) {
        super(scene);
        this.slices = slices;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices  = [];
        this.normals   = [];
        this.texCoords = [];
        this.indices   = [];

        const slices = this.slices;

        // Centre vertex (index 0)
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);

        // Ring vertices (indices 1 … slices)
        for (let i = 0; i <= slices; i++) {
            const angle = (i / slices) * 2 * Math.PI;
            const cx = Math.cos(angle);
            const cy = Math.sin(angle);

            this.vertices.push(cx, cy, 0);
            this.normals.push(0, 0, 1);
            // Map [-1,1] → [0,1] for UV
            this.texCoords.push(0.5 + cx * 0.5, 0.5 + cy * 0.5);
        }

        // Triangles: centre → ring[i] → ring[i+1]
        for (let i = 0; i < slices; i++) {
            const a = 1 + i;
            const b = 1 + i + 1;

            // Front face
            this.indices.push(0, a, b);
            // Back face (reversed winding)
            this.indices.push(0, b, a);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
