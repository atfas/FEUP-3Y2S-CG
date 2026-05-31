import {CGFobject} from '../../../lib/CGF.js';

export class Sphere extends CGFobject {
    constructor(scene, slices, stacks, percentage = 1, invert = false) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;
        this.percentage = percentage;
        this.invert = invert;

        this.initBuffers();
    }

    /**
     * Builds a UV sphere. The `percentage` parameter (0–1) controls how much
     * of the full sphere is generated (0.5 = hemisphere). When `invert` is
     * true normals point inward, used for the sky sphere rendered from inside.
     * The degenerate top/bottom ring is skipped for a complete sphere to avoid
     * a visible seam at the poles.
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const sectorStep = 2 * Math.PI / this.slices;
        const stackStep  = Math.PI * this.percentage / this.stacks;

        for (let i = 0; i <= this.stacks; i++) {
            const stackAngle = Math.PI / 2 - i * stackStep;
            const xy = Math.cos(stackAngle);
            const z  = Math.sin(stackAngle);

            for (let j = 0; j <= this.slices; j++) {
                const sectorAngle = j * sectorStep;
                const x = xy * Math.cos(sectorAngle);
                const y = xy * Math.sin(sectorAngle);

                this.vertices.push(x, y, z);
                if (this.invert)
                    this.normals.push(-x, -y, -z);
                else
                    this.normals.push(x, y, z);
                this.texCoords.push(j / this.slices, i / this.stacks);
            }
        }

        const isLastRingDegenerate = this.percentage >= 1;

        let k1, k2;
        for (let i = 0; i < this.stacks; i++) {
            k1 = i * (this.slices + 1);
            k2 = k1 + this.slices + 1;

            for (let j = 0; j < this.slices; j++, k1++, k2++) {
                if (i !== 0) {
                    if (this.invert)
                        this.indices.push(k1 + 1, k2, k1);
                    else
                        this.indices.push(k1, k2, k1 + 1);
                }
                if (i !== this.stacks - 1 || !isLastRingDegenerate) {
                    if (this.invert)
                        this.indices.push(k2 + 1, k2, k1 + 1);
                    else
                        this.indices.push(k1 + 1, k2, k2 + 1);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}