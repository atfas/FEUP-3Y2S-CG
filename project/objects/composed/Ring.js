import { MyDisk } from '../basics/disk.js';

export class Ring {
    /**
     * @param {MyScene} scene
     * @param {number}  x      - world X centre
     * @param {number}  z      - world Z centre
     * @param {number}  radius - interaction radius in world units
     * @param {number}  [y=0.26] - height at which the disc is rendered
     */
    constructor(scene, x, z, radius, y = 0.26) {
        this.x      = x;
        this.z      = z;
        this.y      = y;
        this.radius = radius;
        this._disk  = new MyDisk(scene, 32);
    }

    /**
     * Returns true if the world-space point (wx, wz) lies within this ring's
     * radius. Used by GameController for pick-up and drop-off detection.
     * @param {number} wx
     * @param {number} wz
     * @returns {boolean}
     */
    contains(wx, wz) {
        return Math.hypot(wx - this.x, wz - this.z) <= this.radius;
    }

    /**
     * Renders the ring as a flat horizontal disc at (x, y, z), scaled to the
     * interaction radius. Appearance must be applied by the caller before display().
     * @param {MyScene} scene
     */
    display(scene) {
        scene.pushMatrix();
            scene.translate(this.x, this.y, this.z);
            scene.rotate(-Math.PI / 2, 1, 0, 0);
            scene.scale(this.radius, this.radius, 1);
            this._disk.display();
        scene.popMatrix();
    }
}
