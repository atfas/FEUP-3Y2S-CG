import { CGFobject, CGFappearance } from '../../../lib/CGF.js';
import { BarnWall  } from './BarnWall.js';
import { BarnGable } from './BarnGable.js';
import { RoofPanel } from './RoofPanel.js';

// Barn proportions 
const B_WIDTH  = 1.6;
const B_DEPTH  = 2.2;
const B_WALL_H = 1.0;
const B_ROOF_H = 0.55;
const B_OVHG   = 0.12;

export class Barn extends CGFobject {
    constructor(scene, x = 30, y = 2, z = 10, scale = 10) {
        super(scene);

        this.x     = x;
        this.y     = y;
        this.z     = z;
        this.scale = scale;
        // Bounding radius from the anchor (front-center) to the farthest back corner
        this.r     = Math.hypot(B_WIDTH / 2 + B_OVHG, B_DEPTH) * scale;

        this._buildParts();
        this._buildAppearances();
    }

    _buildParts() {
        const W  = B_WIDTH;
        const D  = B_DEPTH;
        const wH = B_WALL_H;
        const rH = B_ROOF_H;
        const ov = B_OVHG;

        this.frontGable = new BarnGable(this.scene, W, wH, rH, ov);
        this.backGable  = new BarnGable(this.scene, W, wH, rH, ov);
        this.leftWall   = new BarnWall(this.scene, D, wH);
        this.rightWall  = new BarnWall(this.scene, D, wH);

        const topY      = wH + rH;
        const midY      = wH + rH * 0.82;
        const inset     = W * 0.34;
        const leftX     = -(W / 2 + ov);
        const rightX    =  (W / 2 + ov);
        const leftMidX  = -inset;
        const rightMidX =  inset;
        const frontZ    = -ov;
        const backZ     =  D + ov;

        this.lowerLeftRoof = new RoofPanel(this.scene, [
            leftX, wH, frontZ,  leftX, wH, backZ,
            leftMidX, midY, backZ,  leftMidX, midY, frontZ,
        ]);
        this.upperLeftRoof = new RoofPanel(this.scene, [
            leftMidX, midY, frontZ,  leftMidX, midY, backZ,
            0, topY, backZ,  0, topY, frontZ,
        ]);
        this.upperRightRoof = new RoofPanel(this.scene, [
            0, topY, frontZ,  0, topY, backZ,
            rightMidX, midY, backZ,  rightMidX, midY, frontZ,
        ]);
        this.lowerRightRoof = new RoofPanel(this.scene, [
            rightMidX, midY, frontZ,  rightMidX, midY, backZ,
            rightX, wH, backZ,  rightX, wH, frontZ,
        ]);
    }

    _buildAppearances() {
        // Generic wall texture (sides + back gable)
        this.wallAppearance = new CGFappearance(this.scene);
        this.wallAppearance.setAmbient(1, 1, 1, 1);
        this.wallAppearance.setDiffuse(1, 1, 1, 1);
        this.wallAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.wallAppearance.setShininess(10);
        this.wallAppearance.loadTexture('textures/barnWallTex.jpg');

        // Front face: composite texture with door + window
        this.frontAppearance = new CGFappearance(this.scene);
        this.frontAppearance.setAmbient(1, 1, 1, 1);
        this.frontAppearance.setDiffuse(1, 1, 1, 1);
        this.frontAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.frontAppearance.setShininess(10);
        this.frontAppearance.loadTexture('textures/barnFrontTex.png');

        // Roof
        this.roofAppearance = new CGFappearance(this.scene);
        this.roofAppearance.setAmbient(1, 1, 1, 1);
        this.roofAppearance.setDiffuse(1, 1, 1, 1);
        this.roofAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.roofAppearance.setShininess(10);
        this.roofAppearance.loadTexture('textures/barnRoofTex.jpg');
    }

    display() {
        const W = B_WIDTH;
        const D = B_DEPTH;
        const scene = this.scene;

        // FRONT — uses the composite texture (door + window)
        scene.pushMatrix();
            this.frontAppearance.apply();
            this.frontGable.display();
        scene.popMatrix();

        // BACK
        scene.pushMatrix();
            scene.translate(0, 0, D);
            scene.rotate(Math.PI, 0, 1, 0);
            this.wallAppearance.apply();
            this.backGable.display();
        scene.popMatrix();

        // LEFT WALL
        scene.pushMatrix();
            scene.translate(-(W / 2 + B_OVHG), 0, D / 2);
            scene.rotate(-Math.PI / 2, 0, 1, 0);
            this.wallAppearance.apply();
            this.leftWall.display();
        scene.popMatrix();

        // RIGHT WALL
        scene.pushMatrix();
            scene.translate((W / 2 + B_OVHG), 0, D / 2);
            scene.rotate(Math.PI / 2, 0, 1, 0);
            this.wallAppearance.apply();
            this.rightWall.display();
        scene.popMatrix();

        // ROOF
        this.roofAppearance.apply();
        this.lowerLeftRoof.display();
        this.upperLeftRoof.display();
        this.upperRightRoof.display();
        this.lowerRightRoof.display();
    }
}