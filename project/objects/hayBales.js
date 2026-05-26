import { CGFobject } from '../../lib/CGF.js';
import { HayBale } from './HayBale.js';

// ── Placement constants (all in world units) ──────────────────────────────────

// The terrain plane is scaled ×400 and centred at origin.
// The mountain ring starts to rise visibly around ±130 on either axis,
// so we keep bales well inside that.
const SPAWN_LIMIT = 110;          // bales kept within ±this on X and Z

// Barn occupies roughly X:[20,40], Z:[5,15] at world scale (BARN at 30,2,10 × scale 10, size ~10).
// We pad generously.
const BARN_MIN_X  =  15;
const BARN_MAX_X  =  45;
const BARN_MIN_Z  =   0;
const BARN_MAX_Z  =  20;
const BARN_MARGIN =   6;          // extra clearance around the barn box

// ── Seeded LCG RNG (same pattern as Grass) ───────────────────────────────────
function lcg(state) {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return { val: state / 4294967296, state };
}

/**
 * HayBales
 * Manages a collection of hay bales at random world positions.
 *
 * @param {CGFscene} scene  - MyScene reference
 * @param {number}   count  - number of bales to place (1–20)
 * @param {number}   seed   - RNG seed for deterministic layout
 */
export class HayBales extends CGFobject {

    constructor(scene, count = 5, seed = 99) {
        super(scene);
        this.count = count;
        this.seed  = seed;
        this._bale = new HayBale(scene);   // single shared geometry
        this._generatePositions();
    }

    /** Re-generate positions (call after changing count). */
    rebuild() {
        this._generatePositions();
    }

    _isInsideBarn(x, z) {
        return x > BARN_MIN_X - BARN_MARGIN &&
               x < BARN_MAX_X + BARN_MARGIN &&
               z > BARN_MIN_Z - BARN_MARGIN &&
               z < BARN_MAX_Z + BARN_MARGIN;
    }

    _generatePositions() {
        this._positions = [];   // [{x, z, yRot}]
        let rng = { state: this.seed };
        let attempts = 0;
        const MAX_ATTEMPTS = this.count * 30;

        while (this._positions.length < this.count && attempts < MAX_ATTEMPTS) {
            attempts++;
            rng = lcg(rng.state); const u = rng.val;
            rng = lcg(rng.state); const v = rng.val;
            rng = lcg(rng.state); const r = rng.val;

            const x = (u - 0.5) * 2 * SPAWN_LIMIT;
            const z = (v - 0.5) * 2 * SPAWN_LIMIT;

            if (this._isInsideBarn(x, z)) continue;

            this._positions.push({ x, z, yRot: r * Math.PI * 2 });
        }
    }

    display() {
        const GROUND_Y = 0.8;   // matches the terrain translate in MyScene

        for (const { x, z, yRot } of this._positions) {
            this.scene.pushMatrix();
                this.scene.translate(x, GROUND_Y, z);
                this.scene.rotate(yRot, 0, 1, 0);
                this._bale.display();
            this.scene.popMatrix();
        }
    }
}
