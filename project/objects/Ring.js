export class Ring {
    constructor(x, z, radius) {
        this.x      = x;
        this.z      = z;
        this.radius = radius;
    }

    contains(wx, wz) {
        return Math.hypot(wx - this.x, wz - this.z) <= this.radius;
    }

    display(scene, discGeom, y = 0.26) {
        scene.pushMatrix();
            scene.translate(this.x, y, this.z);
            scene.scale(this.radius, 0.01, this.radius);
            discGeom.display();
        scene.popMatrix();
    }
}
