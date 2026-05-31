import { CGFobject } from '../../../../lib/CGF.js';
import { BarnWall  } from './BarnWall.js';
import { BarnGable } from './BarnGable.js';
import { RoofPanel } from './RoofPanel.js';

export class Barn extends CGFobject {
    /**
     * @param {CGFscene} scene
     * @param {number}   x     - world X anchor (front-centre of the barn)
     * @param {number}   y     - world Y base height
     * @param {number}   z     - world Z anchor
     * @param {number}   scale - uniform scale applied at draw time
     */
    constructor(scene, x = 30, y = 2, z = 10, scale = 10) {
        super(scene);

        this.x              = x;
        this.y              = y;
        this.z              = z;
        this.scale          = scale;
        this.barnWidth      = 1.6;
        this.barnDepth      = 2.2;
        this.barnWallHeight = 1.0;
        this.barnRoofHeight = 0.55;
        this.barnOverhang   = 0.12;

        // Bounding radius from the anchor (front-center) to the farthest back corner
        this.r = Math.hypot(this.barnWidth / 2 + this.barnOverhang, this.barnDepth) * scale;

        this._buildParts();
    }

    /**
     * Instantiates all sub-components (two gable ends, two side walls, four
     * gambrel roof panels) and computes the shared vertex positions needed to
     * align the roof panels with the gable break points.
     */
    _buildParts() {

        this.frontGable = new BarnGable(this.scene, this.barnWidth, this.barnWallHeight, this.barnRoofHeight, this.barnOverhang);
        this.backGable  = new BarnGable(this.scene, this.barnWidth, this.barnWallHeight, this.barnRoofHeight, this.barnOverhang);
        this.leftWall   = new BarnWall(this.scene, this.barnDepth, this.barnWallHeight);
        this.rightWall  = new BarnWall(this.scene, this.barnDepth, this.barnWallHeight);

        const topY      = this.barnWallHeight + this.barnRoofHeight;
        const midY      = this.barnWallHeight + this.barnRoofHeight * this.frontGable.midHeightRatio;
        const inset     = this.barnWidth * this.frontGable.insetRatio;
        const leftX     = -(this.barnWidth / 2 + this.barnOverhang);
        const rightX    =  (this.barnWidth / 2 + this.barnOverhang);
        const leftMidX  = -inset;
        const rightMidX =  inset;
        const frontZ    = -this.barnOverhang;
        const backZ     =  this.barnDepth + this.barnOverhang;

        this.lowerLeftRoof = new RoofPanel(this.scene, [
            leftX, this.barnWallHeight, frontZ,  leftX, this.barnWallHeight, backZ,
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
            rightX, this.barnWallHeight, backZ,  rightX, this.barnWallHeight, frontZ,
        ]);
    }

    /**
     * Draws the full barn: front gable (with door/window composite texture),
     * back gable, two side walls, and the four gambrel roof panels. Each
     * section applies its own appearance before drawing.
     */
    display() {
        const scene = this.scene;

        // FRONT — uses the composite texture (door + window)
        scene.pushMatrix();
            this.scene.barnFrontAppearance.apply();
            this.frontGable.display();
        scene.popMatrix();

        // BACK
        scene.pushMatrix();
            scene.translate(0, 0, this.barnDepth);
            scene.rotate(Math.PI, 0, 1, 0);
            this.scene.barnWallAppearance.apply();
            this.backGable.display();
        scene.popMatrix();

        // LEFT WALL
        scene.pushMatrix();
            scene.translate(-(this.barnWidth / 2 + this.barnOverhang), 0, this.barnDepth / 2);
            scene.rotate(-Math.PI / 2, 0, 1, 0);
            this.scene.barnWallAppearance.apply();
            this.leftWall.display();
        scene.popMatrix();

        // RIGHT WALL
        scene.pushMatrix();
            scene.translate((this.barnWidth / 2 + this.barnOverhang), 0, this.barnDepth / 2);
            scene.rotate(Math.PI / 2, 0, 1, 0);
            this.scene.barnWallAppearance.apply();
            this.rightWall.display();
        scene.popMatrix();

        // ROOF
        this.scene.barnRoofAppearance.apply();
        this.lowerLeftRoof.display();
        this.upperLeftRoof.display();
        this.upperRightRoof.display();
        this.lowerRightRoof.display();
    }
}
