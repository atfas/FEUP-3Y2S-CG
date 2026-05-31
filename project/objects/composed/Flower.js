import { CGFobject } from '../../../lib/CGF.js';
import { MyCylinder } from '../basics/cylinder.js';
import { MyQuad } from '../basics/MyQuad.js';
import { MyUnitCube } from '../basics/cube.js';

export class Flower extends CGFobject {
    constructor(scene, x, z) {
        super(scene);
        this.x = x;
        this.y = 0;
        this.z = z;
        this.scale = 2.5;
        this.r = this.scale * 0.4;
        this.rotY = Math.random() * 2 * Math.PI;
        this.petalCount = 6 + Math.floor(Math.random() * 4);
        this._petalColor = [Math.random(), Math.random(), Math.random()];
        this._tiltDir = Math.random() < 0.5 ? 1 : -1;

        this._stem   = new MyCylinder(scene, 6, 1);
        this._petal  = new MyQuad(scene);
        this._center = new MyUnitCube(scene);
    }

    /**
     * Draws a procedural flower: a three-segment S-curved stem, evenly-spaced
     * petals (random colour chosen at construction), and a flat disc centre.
     * Each element is positioned relative to the stem tip accumulated in (x,y).
     */
    display() {
        const scene = this.scene;

        const segmentLen = 0.35;
        const stemR  = 0.035;
        const tilt   = this._tiltDir * 0.20;
        const tilts  = [tilt, 0, -tilt];     //s curve on stem

        this.scene.flowerMaterial.setColor(0.2, 0.6, 0.1, 1);
        this.scene.flowerMaterial.apply();

        let x = 0, y = 0;
        for (let i = 0; i < 3; i++) {
            const t = tilts[i];
            scene.pushMatrix();
                scene.translate(x, y, 0);
                scene.rotate(t, 0, 0, 1);
                scene.rotate(-Math.PI / 2, 1, 0, 0);
                scene.scale(stemR, stemR, segmentLen);
                this._stem.display();
            scene.popMatrix();
            x -= segmentLen * Math.sin(t);
            y += segmentLen * Math.cos(t);
        }

        const [r, g, b] = this._petalColor;
        this.scene.flowerMaterial.setColor(r, g, b, 1);
        this.scene.flowerMaterial.apply();
        for (let i = 0; i < this.petalCount; i++) {
            const a = (i / this.petalCount) * 2 * Math.PI;
            scene.pushMatrix();
                scene.translate(x, y, 0);
                scene.rotate(a, 0, 1, 0);
                scene.translate(0.25, 0, 0);
                scene.rotate(-Math.PI / 2, 1, 0, 0);
                scene.scale(0.3, 0.3, 1);
                this._petal.display();
            scene.popMatrix();
        }

        this.scene.flowerMaterial.setColor(0.9, 0.8, 0.1, 1);
        this.scene.flowerMaterial.apply();
        scene.pushMatrix();
            scene.translate(x, y, 0);
            scene.scale(0.20, 0.07, 0.20);
            this._center.display();
        scene.popMatrix();
    }

    /** Enables normal vector visualisation on all sub-objects for debugging. */
    enableNormalViz(){
        this._stem.enableNormalViz();
        this._petal.enableNormalViz();
        this._center.enableNormalViz();
    }
    /** Disables normal vector visualisation on all sub-objects. */
    disableNormalViz(){
        this._stem.disableNormalViz();
        this._petal.disableNormalViz();
        this._center.disableNormalViz();
    }
}
