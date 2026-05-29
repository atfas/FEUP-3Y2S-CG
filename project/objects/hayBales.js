import { CGFobject } from '../../lib/CGF.js';
import { HayBale } from './HayBale.js';

const SPAWN_LIMIT = 110;          // bales kept within ±this on X and Z

const BARN_MIN_X  =  15;
const BARN_MAX_X  =  45;
const BARN_MIN_Z  =   0;
const BARN_MAX_Z  =  20;
const BARN_MARGIN =   6;          // extra clearance around the barn box

function lcg(state) {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return { val: state / 4294967296, state };
}

export class HayBales extends CGFobject {

    constructor(scene, count = 5, seed = 99) {
        super(scene);
        this.count = count;
        this.seed  = seed;
        this._bale = new HayBale(scene);   // single shared geometry
        this._generatePositions();
    }

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
        this._positions = [];   // [{x, z, yRot, active}]
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

            // Added active: true state directly to the deterministic position map
            this._positions.push({ x, z, yRot: r * Math.PI * 2, active: true });
        }
    }

    display() {
        const GROUND_Y = 0.8;   // matches the terrain translate in MyScene

        for (const pos of this._positions) {
            // Skip rendering if the bale has been picked up by the player!
            if (!pos.active) continue;

            this.scene.pushMatrix();
                this.scene.translate(pos.x, GROUND_Y, pos.z);
                this.scene.rotate(pos.yRot, 0, 1, 0);
                this._bale.display();
            this.scene.popMatrix();
        }
    }
}