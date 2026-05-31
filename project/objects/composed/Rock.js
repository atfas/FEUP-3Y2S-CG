import { Sphere } from '../basics/sphere.js';

export class Rock extends Sphere {
    /**
     * @param {MyScene} scene
     * @param {number}  x - world X position
     * @param {number}  z - world Z position
     */
    constructor(scene, x, z) {
        super(scene, 16, 16, 0.5);
        this.x = x;
        this.y = 0;
        this.z = z;
        this.scale = 2.5 + Math.random();
        this.r = this.scale;
        this._type = Math.floor(Math.random() * 4);
    }

    /**
     * Renders the rock by pushing a per-instance seed and type uniform to the
     * rock shader (which procedurally warps the sphere geometry) then drawing
     * the scaled hemisphere.
     */
    display() {
        const scene = this.scene;
        scene.rockShader.setUniformsValues({ uSeed: [this.x, this.y, this.z], uRockType: this._type });
        scene.pushMatrix();
            scene.scale(this.scale, this.scale, this.scale);
            scene.rotate(-Math.PI / 2, 1, 0, 0);
            super.display();
        scene.popMatrix();
    }
}
