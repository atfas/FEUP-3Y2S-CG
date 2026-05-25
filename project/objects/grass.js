import { CGFobject } from '../../lib/CGF.js';

/**
 * Grass
 * Scatters triangle-based grass patches across the terrain plane.
 * Each patch = a fan of N blade triangles at slightly different angles,
 * giving a natural clump look with no texture needed.
 *
 * @param scene        - MyScene reference
 * @param count        - number of grass clumps (default 300)
 * @param pathMaskImg  - HTMLImageElement of path1.png (white=path, black=grass)
 * @param seed         - RNG seed for deterministic layout (default 42)
 * @param heightScale  - multiplier on blade height H (default 1.0)
 * @param clumpSpread  - offset spread factor, replaces hardcoded 75.0 (default 75.0)
 */
export class Grass extends CGFobject {
    constructor(scene, count = 300, pathMaskImg = null, seed = 42, heightScale = 1.0, clumpSpread = 75.0) {
        super(scene);
        this.count       = count;
        this.pathMaskImg = pathMaskImg;
        this.seed        = seed;
        this.heightScale = heightScale;
        this.clumpSpread = clumpSpread;
        this.initBuffers();
    }

    /** Regenerate vertex buffers after changing count / heightScale / clumpSpread. */
    rebuild() {
        this.initBuffers();
    }

    // Simple seeded LCG pseudo-random number generator → [0, 1)
    _rng(state) {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return { val: state / 4294967296, state };
    }

    // Sample path mask canvas pixel at normalised UV (0..1). Returns 0..1 brightness.
    _buildMaskSampler() {
        if (!this.pathMaskImg) return () => 0;

        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width  = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.pathMaskImg, 0, 0, size, size);
        const pixels = ctx.getImageData(0, 0, size, size).data;

        return (u, v) => {
            const px = Math.min(Math.floor(u * size), size - 1);
            const py = Math.min(Math.floor(v * size), size - 1);
            const idx = (py * size + px) * 4;
            return pixels[idx] / 255;
        };
    }

    initBuffers() {
        const sampleMask = this._buildMaskSampler();

        this.vertices  = [];
        this.indices   = [];
        this.normals   = [];
        // We store a per-vertex height value in texCoords.y (repurposed, no texture used)
        this.texCoords = [];

        const BLADES_PER_CLUMP = 100;  // blades fanned around each clump centre
        const W = 0.0008;              // half-width at blade base (plane local space, ×400 in scene)
        const H = 0.006 * this.heightScale; // blade height, scaled by GUI param

        let rng = { state: this.seed };
        let vertexOffset = 0;

        for (let p = 0; p < this.count; p++) {
            // Pick a random position, retry if on the path
            let u, v, onPath;
            let attempts = 0;
            do {
                rng = this._rng(rng.state);  u = rng.val;
                rng = this._rng(rng.state);  v = rng.val;
                onPath = sampleMask(u, v) > 0.25;
                attempts++;
            } while (onPath && attempts < 100);

            if (onPath) continue;

            // Clump centre in plane local coords [-0.5, 0.5]
            const cx = u - 0.5;
            const cy = v - 0.5;

            // Random base orientation and scale for this clump
            rng = this._rng(rng.state);
            const baseAngle = rng.val * Math.PI;

            rng = this._rng(rng.state);
            const clumpScale = 0.7 + rng.val * 0.8;

            for (let b = 0; b < BLADES_PER_CLUMP; b++) {
                // Spread blades evenly across 180° + small random jitter
                rng = this._rng(rng.state);
                const jitter = (rng.val - 0.5) * (Math.PI / BLADES_PER_CLUMP);
                const angle  = baseAngle + (b / BLADES_PER_CLUMP) * Math.PI + jitter;

                // Per-blade scale variation
                rng = this._rng(rng.state);
                const bladeScale = clumpScale * (0.8 + rng.val * 0.4);

                // Slight random lean: tip shifts horizontally a little
                rng = this._rng(rng.state);
                const lean = (rng.val - 0.5) * W * bladeScale * 4.0;

                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                const hw  = W  * bladeScale;
                const hh  = H  * bladeScale;

                // Random offset within the clump — spread controlled by clumpSpread param
                rng = this._rng(rng.state);
                const ox = (rng.val - 0.5) * hw * this.clumpSpread;
                rng = this._rng(rng.state);
                const oy = (rng.val - 0.5) * hw * this.clumpSpread;

                const bx = cx + ox;
                const by = cy + oy;

                // Triangle: base-left, base-right, tip
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