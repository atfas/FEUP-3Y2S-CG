import { CGFobject } from '../../lib/CGF.js';
import { Sphere } from './sphere.js';

export class Rock extends CGFobject {
    constructor(scene, x, z) {
        super(scene);
        this.x = x;
        this.y = 0;
        this.z = z;
        this.scale = 1 + Math.random();
        this._type = Math.floor(Math.random() * 4);
        this._seed = [Math.random() * 100, Math.random() * 100, Math.random() * 100];
        this._sphere = new Sphere(scene, 16, 16, 0.5);
    }

    enableNormalViz()  { this._sphere.enableNormalViz(); }
    disableNormalViz() { this._sphere.disableNormalViz(); }

    display() {
        const scene = this.scene;
        scene.rockShader.setUniformsValues({ uSeed: this._seed, uRockType: this._type });
        scene.pushMatrix();
            scene.scale(this.scale, this.scale, this.scale);
            scene.rotate(-Math.PI / 2, 1, 0, 0);
            this._sphere.display();
        scene.popMatrix();
    }
}
