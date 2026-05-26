import { CGFobject } from '../../lib/CGF.js';

//  Tuning constants 
const BLADES_PER_CLUMP = 100;     // triangles per clump (smaller = tighter, more distinct patches)
const BLADE_WIDTH      = 0.0008; // base half-width of a blade (plane-local units)
const BLADE_HEIGHT     = 0.006;  // base height of a blade (scaled by heightScale)
const BASE_PINCH       = 0.3;    // fraction of hw used for base corners (0=point, 1=flat)
const CLUMP_MARGIN     = 0.75;   // clump centres kept within ±this from origin
const BLADE_LIMIT      = 0.70;   // individual blades hard-clamped to ±this
const Z_OFFSET         = 0.025;  // tiny lift off the plane to avoid z-fighting

/**
 * Grass
 * Each clump is a fan of BLADES_PER_CLUMP slim triangles at varied angles,
 
 * @param {CGFscene} scene       - MyScene reference
 * @param {number}   count       - number of grass clumps
 * @param {number}   seed        - RNG seed for deterministic layout
 * @param {number}   heightScale - multiplier on blade height
 * @param {number}   clumpSpread - how far blades scatter within a clump
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

    /** Regenerate GPU buffers after changing any parameter. */
    rebuild() {
        this.initBuffers();
    }

    /** LCG pseudo-random number generator. Returns { val in [0,1), state }. */
    _rng(state) {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return { val: state / 4294967296, state };
    }

    initBuffers() {
        this.vertices  = [];
        this.indices   = [];
        this.normals   = [];
        this.texCoords = [];

        const H = BLADE_HEIGHT * this.heightScale;

        let rng          = { state: this.seed };
        let vertexOffset = 0;

        for (let p = 0; p < this.count; p++) {
            rng = this._rng(rng.state); const u = rng.val;
            rng = this._rng(rng.state); const v = rng.val;

            // Clump centre — kept inside CLUMP_MARGIN so edge blades don't pile up
            const cx = (u - 0.5) * (CLUMP_MARGIN);
            const cy = (v - 0.5) * (CLUMP_MARGIN);

            rng = this._rng(rng.state);
            const baseAngle  = rng.val * Math.PI;

            rng = this._rng(rng.state);
            const clumpScale = 0.7 + rng.val * 0.8;  // [0.7 – 1.5]

            for (let b = 0; b < BLADES_PER_CLUMP; b++) {
                // Per-blade randomness

                rng = this._rng(rng.state);
                const jitter     = (rng.val - 0.5) * (Math.PI / BLADES_PER_CLUMP);
                const angle      = baseAngle + (b / BLADES_PER_CLUMP) * Math.PI + jitter;

                rng = this._rng(rng.state);
                const bladeScale = clumpScale * (0.8 + rng.val * 0.4);  // [0.56 – 1.5]

                rng = this._rng(rng.state);
                const lean       = (rng.val - 0.5) * BLADE_WIDTH * bladeScale * 4.0;

                // Blade geometry

                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                const hw  = BLADE_WIDTH * bladeScale;  // full half-width (used for spread)
                const bw  = hw * BASE_PINCH;            // narrowed base corners
                const hh  = H  * bladeScale;            // blade height

                // Scatter offset within the clump
                rng = this._rng(rng.state);
                const ox = (rng.val - 0.5) * hw * this.clumpSpread;
                rng = this._rng(rng.state);
                const oy = (rng.val - 0.5) * hw * this.clumpSpread;

                // Final blade position — clamped so no blade exceeds the plane edge
                const bx = Math.max(-BLADE_LIMIT, Math.min(BLADE_LIMIT, cx + ox));
                const by = Math.max(-BLADE_LIMIT, Math.min(BLADE_LIMIT, cy + oy));

                // Three vertices: left base, right base, tip
                const bl  = [bx - bw * cos, by - bw * sin, Z_OFFSET];
                const br  = [bx + bw * cos, by + bw * sin, Z_OFFSET];
                const tip = [bx + lean * cos, by + lean * sin, hh + Z_OFFSET];

                this.vertices.push(...bl, ...br, ...tip);

                // Face normal points perpendicular to the blade orientation
                const nx = -sin;
                const ny =  cos;
                for (let i = 0; i < 3; i++) this.normals.push(nx, ny, 0.0);

                // UV: base-left(0,0), base-right(1,0), tip(0.5,1)
                this.texCoords.push(0.0, 0.0,  1.0, 0.0,  0.5, 1.0);

                this.indices.push(vertexOffset, vertexOffset + 1, vertexOffset + 2);
                vertexOffset += 3;
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
}