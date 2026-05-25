import { CGFobject, CGFappearance } from '../../../lib/CGF.js';
import { BarnWall   } from './BarnWall.js';
import { BarnGable  } from './BarnGable.js';
import { RoofPanel  } from './RoofPanel.js';

// Barn proportions (all in local scene units)
const B_WIDTH  = 1.6;
const B_DEPTH  = 2.2;

const B_WALL_H = 1.0;
const B_ROOF_H = 0.55;

const B_OVHG = 0.12;

/**
 * Barn
 *
 * Assembly:
 *   Front gable  — at Z = 0, facing -Z
 *   Back  gable  — at Z = B_DEPTH, facing +Z
 *   Left  wall   — at X = -B_WIDTH/2, facing -X
 *   Right wall   — at X = +B_WIDTH/2, facing +X
 *   Left  roof   — slanted from left eave up to ridge
 *   Right roof   — slanted from right eave up to ridge
 *   Floor        — flat at Y = 0
 *
 * @param {CGFscene} scene
 */
export class Barn extends CGFobject {
    constructor(scene) {
        super(scene);
        this._buildParts();
        this._buildAppearances();
    }

    _buildParts() {

    const W  = B_WIDTH;
    const D  = B_DEPTH;
    const wH = B_WALL_H;
    const rH = B_ROOF_H;
    const ov = B_OVHG;

    // GABLES
    this.frontGable = new BarnGable(this.scene, W, wH, rH, ov);
    this.backGable  = new BarnGable(this.scene, W, wH, rH, ov);

    // SIDE WALLS
    this.leftWall  = new BarnWall(this.scene, D, wH);
    this.rightWall = new BarnWall(this.scene, D, wH);


    // GAMBREL ROOF

    const topY = wH + rH;
    const midY = wH + rH * 0.82;

    const inset = W * 0.34;

    const leftX  = -(W/2 + ov);
    const rightX =  (W/2 + ov);

    const leftMidX  = -inset;
    const rightMidX = inset;

    const frontZ = -ov;
    const backZ  = D + ov;

    // LOWER LEFT
    this.lowerLeftRoof = new RoofPanel(this.scene, [
        leftX, wH, frontZ,
        leftX, wH, backZ,

        leftMidX, midY, backZ,
        leftMidX, midY, frontZ,
    ]);

    // UPPER LEFT
    this.upperLeftRoof = new RoofPanel(this.scene, [
        leftMidX, midY, frontZ,
        leftMidX, midY, backZ,

        0, topY, backZ,
        0, topY, frontZ,
    ]);

    // UPPER RIGHT
    this.upperRightRoof = new RoofPanel(this.scene, [
        0, topY, frontZ,
        0, topY, backZ,

        rightMidX, midY, backZ,
        rightMidX, midY, frontZ,
    ]);

    // LOWER RIGHT
    this.lowerRightRoof = new RoofPanel(this.scene, [
        rightMidX, midY, frontZ,
        rightMidX, midY, backZ,

        rightX, wH, backZ,
        rightX, wH, frontZ,
    ]);
}

    _buildAppearances() {
        this.wallAppearance = new CGFappearance(this.scene);
        this.wallAppearance.setAmbient(0.6, 0.08, 0.08, 1);
        this.wallAppearance.setDiffuse(0.8, 0.10, 0.10, 1);
        this.wallAppearance.setSpecular(0.05, 0.02, 0.02, 1);
        this.wallAppearance.setShininess(5);

        this.roofAppearance = new CGFappearance(this.scene);
        this.roofAppearance.setAmbient(0.15, 0.10, 0.06, 1);
        this.roofAppearance.setDiffuse(0.25, 0.17, 0.09, 1);
        this.roofAppearance.setSpecular(0.02, 0.02, 0.02, 1);
        this.roofAppearance.setShininess(3);

        this.floorAppearance = new CGFappearance(this.scene);
        this.floorAppearance.setAmbient(0.35, 0.26, 0.14, 1);
        this.floorAppearance.setDiffuse(0.55, 0.40, 0.22, 1);
        this.floorAppearance.setSpecular(0.02, 0.02, 0.01, 1);
        this.floorAppearance.setShininess(3);
    }

    display() {

    const W = B_WIDTH;
    const D = B_DEPTH;

    const scene = this.scene;

    // FRONT GABLE
    scene.pushMatrix();
        this.wallAppearance.apply();
        this.frontGable.display();
    scene.popMatrix();

    // BACK GABLE
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

    // ROOF PANELS

    this.roofAppearance.apply();

    this.lowerLeftRoof.display();
    this.upperLeftRoof.display();

    this.upperRightRoof.display();
    this.lowerRightRoof.display();


    }
}