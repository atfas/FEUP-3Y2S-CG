import { Sphere } from './sphere.js';

export class Rock extends Sphere {
    constructor(scene, x, z) {
        super(scene, 16, 16, 0.5);
        this.x = x;
        this.y = 0;
        this.z = z;
        this.scale = 2.5 + Math.random();
        this.r = this.scale * 1.2;
        this._type = Math.floor(Math.random() * 4);
    }

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