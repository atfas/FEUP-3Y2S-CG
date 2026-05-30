import { MyDisk } from '../basics/disk.js';

export class Ring {
    constructor(scene, x, z, radius, y = 0.26) {
        this.x      = x;
        this.z      = z;
        this.y      = y;
        this.radius = radius;
        this._disk  = new MyDisk(scene, 32);
    }

    contains(wx, wz) {
        return Math.hypot(wx - this.x, wz - this.z) <= this.radius;
    }

    display(scene) {
        scene.pushMatrix();
            scene.translate(this.x, this.y, this.z);
            scene.rotate(-Math.PI / 2, 1, 0, 0);
            scene.scale(this.radius, this.radius, 1);
            this._disk.display();
        scene.popMatrix();
    }
}
