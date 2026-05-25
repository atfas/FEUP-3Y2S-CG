import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { Sphere } from './sphere.js';
import { Plane } from './plane.js';

export class Flower extends CGFobject {
    constructor(scene, x, z) {
        super(scene);
        this.x = x;
        this.y = 0;
        this.z = z;
        this.scale = 0.5;
        this.rotY = Math.random() * 2 * Math.PI;
        this.petalCount = 4 + Math.floor(Math.random() * 4);
        this._petalColor = [Math.random(), Math.random(), Math.random()];

        this._stem   = new Sphere(scene, 8, 8, 1.0, false);
        this._petal  = new Plane(scene, 2, 0, 1, 0, 1);
        this._center = new Sphere(scene, 8, 8, 1.0, false);

        this._material = new CGFappearance(scene);
        this._material.setSpecular(0, 0, 0, 1);
        this._material.setShininess(5);
    }

    display() {
        const scene = this.scene;

        this._material.setColor(0.2, 0.6, 0.1, 1);
        this._material.apply();
        scene.pushMatrix();
            scene.translate(0, 0.5, 0);
            scene.rotate(-Math.PI / 2, 1, 0, 0);
            scene.scale(0.06, 0.06, 0.5);
            this._stem.display();
        scene.popMatrix();

        const [r, g, b] = this._petalColor;
        this._material.setColor(r, g, b, 1);
        this._material.apply();
        for (let i = 0; i < this.petalCount; i++) {
            const a = (i / this.petalCount) * 2 * Math.PI;
            scene.pushMatrix();
                scene.translate(0, 1, 0);
                scene.rotate(a, 0, 1, 0);
                scene.translate(0.25, 0, 0);
                scene.rotate(-Math.PI / 2, 1, 0, 0);
                scene.scale(0.3, 0.3, 1);
                this._petal.display();
            scene.popMatrix();
        }

        this._material.setColor(0.9, 0.8, 0.1, 1);
        this._material.apply();
        scene.pushMatrix();
            scene.translate(0, 1, 0);
            scene.scale(0.15, 0.15, 0.15);
            this._center.display();
        scene.popMatrix();
    }
}
