import { CGFobject } from '../../../lib/CGF.js';
import { MyCone }     from '../basics/MyCone.js';
import { MyCylinder } from '../basics/cylinder.js';

/**
 * Arrow pointing downward (tip at y=0, shaft top at y=2.0).
 * Position it above a hay bale; arrow.vert animates the vertical bob.
 */
export class Arrow extends CGFobject {
    constructor(scene) {
        super(scene);
        this.cone       = new MyCone(scene, 12, 1);
        this.cylinder   = new MyCylinder(scene, 12, 1);
        this.headBaseY  = 0.7;
    }

    /**
     * Draws the arrowhead (a cone flipped so its tip points down) and the
     * vertical shaft (a cylinder rotated onto the Y axis). The arrow.vert
     * shader animates the Y position to create a bobbing effect.
     */
    display() {
        // Arrowhead: MyCone has base at y=0, tip at y=1 (pointing up).
        // Flip 180° around X so tip points down (y=0), base at this.headBaseY.
        this.scene.pushMatrix();
            this.scene.translate(0, this.headBaseY, 0);
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.scene.scale(0.4, 0.7, 0.4);
            this.cone.display();
        this.scene.popMatrix();

        // Shaft: cylinder goes along Z (z=0..1).
        // Rotate -90° around X so it goes along Y, from y=headBaseY to y=2.0.
        this.scene.pushMatrix();
            this.scene.translate(0, this.headBaseY, 0);
            this.scene.rotate(-Math.PI / 2, 1, 0, 0);
            this.scene.scale(0.1, 0.1, 1.3);
            this.cylinder.display();
        this.scene.popMatrix();
    }
}
