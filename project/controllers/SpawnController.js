import { HayBale } from "../objects/composed/hayBale.js";
import { Flower }  from "../objects/composed/Flower.js";
import { Rock }    from "../objects/composed/Rock.js";
import { Ring }    from "../objects/composed/Ring.js";

export class SpawnController {
    constructor(scene, gameModel) {
        this.scene = scene;
        this.model = gameModel;
    }

    /**
     * Clears and rebuilds the entire world population: rocks, flowers, and hay
     * bales. Seeds the collision exclusion list with the barn and wagon so
     * nothing spawns on top of them. Called on init and whenever the GUI flora
     * counts change.
     */
    regenerate() {
        this.model._placedObjects = [
            { x: this.scene.barn.x,  z: this.scene.barn.z,  r: this.scene.barn.r  },
            { x: this.scene.wagon.x, z: this.scene.wagon.z, r: this.scene.wagon.r },
        ];
        this.model.rocks    = this.spawnRandom(this.scene.rockCount,   (x, z) => new Rock(this.scene, x, z));
        this.model.flowers  = this.spawnRandom(this.scene.flowerCount, (x, z) => new Flower(this.scene, x, z));
        this.model.hayBales = this.spawnRandom(this.scene._baleCount,  (x, z) => {
            const bale = new HayBale(this.scene, x, z);
            bale.ring = new Ring(this.scene, x, z, this.scene._hayBaleRingRadius, bale.y);
            return bale;
        });
    }

    /**
     * Spawns a fresh batch of hay bales (without touching rocks or flowers)
     * and appends them to the existing bale list. Called by GameController
     * when the last bale in the field has been collected.
     */
    respawnBales() {
        const newBales = this.spawnRandom(this.scene._baleCount, (x, z) => {
            const bale = new HayBale(this.scene, x, z);
            bale.ring = new Ring(this.scene, x, z, this.scene._hayBaleRingRadius, bale.y);
            return bale;
        });
        this.model.hayBales.push(...newBales);
    }

    /**
     * Places `count` objects at random positions within the spawn radius,
     * rejecting candidates that overlap any previously placed object. Uses
     * up to count × 10 attempts before giving up to avoid an infinite loop
     * when the field is nearly full.
     * @param {number}   count    - desired number of objects
     * @param {Function} createFn - factory `(x, z) => object` — the returned
     *                              object must expose a numeric `r` (bounding radius)
     * @returns {Array} successfully placed objects
     */
    spawnRandom(count, createFn) {
        const result = [];
        let attempts = 0;

        while (result.length < count && attempts < count * 10) {
            attempts++;
            const a = Math.random() * 2 * Math.PI;
            const r = Math.sqrt(Math.random()) * this.scene._spawnRadius;
            const x = Math.cos(a) * r;
            const z = Math.sin(a) * r;

            const obj = createFn(x, z);
            if (this.model._placedObjects.some(o => Math.hypot(x - o.x, z - o.z) < o.r + obj.r)) continue;
            this.model._placedObjects.push({ x, z, r: obj.r });
            result.push(obj);
        }
        return result;
    }
}
