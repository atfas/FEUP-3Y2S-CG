import { CGFobject } from '../../lib/CGF.js';

/**
 * Grass
 * Scatters triangle-based grass patches across the terrain plane.
 * Each patch = a fan of N blade triangles at slightly different angles,
 * giving a natural clump look with no texture needed.
 *
 * @param scene       - MyScene reference
 * @param count       - number of grass clumps (default 300)
 * @param seed        - RNG seed for deterministic layout (default 42)
 * @param heightScale - multiplier on blade height (default 1.0)
 * @param clumpSpread - offset spread factor, replaces hardcoded 75.0 (default 75.0)
 */
export class Grass extends CGFobject {
    constructor(scene, count = 300, seed = 42, heightScale = 1.0, clumpSpread = 75.0) {
        super(scene);
        this.count       = count;
        this.seed        = seed;
        this.heightScale = heightScale;
        this.clumpSpread = clumpSpread;
        this.initBuffers();
    }

    /** Regenerate vertex buffers after changing any parameter. */
    rebuild() {
        this.initBuffers();
    }

    // Simple seeded LCG pseudo-random number generator → [0, 1)
    _rng(state) {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return { val: state / 4294967296, state };
    }

    initBuffers() {
        this.vertices  = [];
        this.indices   = [];
        this.normals   = [];
        this.texCoords = [];

        const BLADES_PER_CLUMP = 100;
        const W = 0.0008;
        const H = 0.006 * this.heightScale;

        let rng = { state: this.seed };
        let vertexOffset = 0;

        for (let p = 0; p < this.count; p++) {
            rng = this._rng(rng.state); const u = rng.val;
            rng = this._rng(rng.state); const v = rng.val;

            const cx = u - 0.5;
            const cy = v - 0.5;

            rng = this._rng(rng.state);
            const baseAngle = rng.val * Math.PI;

            rng = this._rng(rng.state);
            const clumpScale = 0.7 + rng.val * 0.8;

            for (let b = 0; b < BLADES_PER_CLUMP; b++) {
                rng = this._rng(rng.state);
                const jitter = (rng.val - 0.5) * (Math.PI / BLADES_PER_CLUMP);
                const angle  = baseAngle + (b / BLADES_PER_CLUMP) * Math.PI + jitter;

                rng = this._rng(rng.state);
                const bladeScale = clumpScale * (0.8 + rng.val * 0.4);

                rng = this._rng(rng.state);
                const lean = (rng.val - 0.5) * W * bladeScale * 4.0;

                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                const hw  = W * bladeScale;
                const hh  = H * bladeScale;

                rng = this._rng(rng.state);
                const ox = (rng.val - 0.5) * hw * this.clumpSpread;
                rng = this._rng(rng.state);
                const oy = (rng.val - 0.5) * hw * this.clumpSpread;

                const bx = cx + ox;
                const by = cy + oy;

                const Z_OFFSET = 0.025;
                const bl  = [bx + (-hw) * cos, by + (-hw) * sin, Z_OFFSET];
                const br  = [bx + ( hw) * cos, by + ( hw) * sin, Z_OFFSET];
                const tip = [bx + lean  * cos, by + lean  * sin, hh + Z_OFFSET];

                this.vertices.push(...bl, ...br, ...tip);

                const nx = -sin;
                const ny =  cos;
                for (let i = 0; i < 3; i++) this.normals.push(nx, ny, 0.0);

                this.texCoords.push(
                    0.0, 0.0,
                    1.0, 0.0,
                    0.5, 1.0,
                );

                const v0 = vertexOffset;
                this.indices.push(v0, v0 + 1, v0 + 2);
                vertexOffset += 3;
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}