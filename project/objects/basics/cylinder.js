import {CGFobject} from '../../../lib/CGF.js';

export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks, percentage = 1) {
        super(scene);

        this.slices     = slices;
        this.stacks     = stacks;
        this.percentage = percentage;

        this.initBuffers();
    }

    /**
     * Builds the cylinder lateral surface. When `percentage` < 1 the cylinder
     * is open (an arc rather than a full ring), with an extra vertex column at
     * the open edge to avoid wrap-around index aliasing. Double-sided triangles
     * are emitted so the inside is also visible.
     */
    initBuffers() {
        // percentage controls how much of the circumference is generated (0–1).
        // 1.0 = full cylinder, 0.5 = half cylinder
        const isFullCircle    = this.percentage >= 1;
        const vertsPerRing    = isFullCircle ? this.slices : this.slices + 1;

        const angleStep       = 2 * Math.PI * this.percentage / this.slices;
        const heightStep      = 1 / this.stacks;

        this.vertices  = [];
        this.indices   = [];
        this.normals   = [];
        this.texCoords = [];

        for (let stack = 0; stack <= this.stacks; stack++) {
            const height = stack * heightStep;
            const texV   = stack / this.stacks;
            for (let slice = 0; slice < vertsPerRing; slice++) {
                const angle    = slice * angleStep;
                const cosAngle = Math.cos(angle);
                const sinAngle = Math.sin(angle);

                this.vertices.push(cosAngle, sinAngle, height);
                this.normals.push(cosAngle, sinAngle, 0);
                this.texCoords.push(slice / this.slices, texV);
            }
        }

        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {

                var bottomLeft  = stack * vertsPerRing + slice;
                var topLeft     = bottomLeft + vertsPerRing;
                var bottomRight = bottomLeft + 1;
                var topRight    = topLeft + 1;

                if (slice === this.slices - 1 && isFullCircle) {
                    // wrap last slice back to first to close the full ring
                    bottomRight = stack * vertsPerRing;
                    topRight = bottomRight + vertsPerRing;
                }

                this.indices.push(bottomLeft, bottomRight, topLeft);
                this.indices.push(bottomRight, topRight, topLeft);
                this.indices.push(topLeft, bottomRight, bottomLeft);
                this.indices.push(topLeft, topRight, bottomRight);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
