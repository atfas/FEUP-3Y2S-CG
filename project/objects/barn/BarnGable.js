import { CGFobject } from '../../../lib/CGF.js';

export class BarnGable extends CGFobject {

    constructor(scene, width, wallHeight, roofHeight, overhang = 0) {
        super(scene);
        this.width          = width;
        this.wallHeight     = wallHeight;
        this.roofHeight     = roofHeight;
        this.overhang       = overhang;
        this.insetRatio     = 0.34;
        this.midHeightRatio = 0.82;
        this.initBuffers();
    }

    initBuffers() {

        const inset = this.width * this.insetRatio;
        const midY  = this.wallHeight + this.roofHeight * this.midHeightRatio;
        const topY  = this.wallHeight + this.roofHeight;

        const leftX     = -(this.width / 2 + this.overhang);
        const rightX    =  (this.width / 2 + this.overhang);
        const leftMidX  = -inset;
        const rightMidX =  inset;

        // Proportional UV — maps geometry linearly onto [0,1]²
        const xMin = leftX,  xMax = rightX;
        const yMin = 0,      yMax = topY;
        const xSpan = xMax - xMin;
        const ySpan = yMax - yMin;
        const uvX = x => (x - xMin) / xSpan;
        const uvY = y => 1.0 - y / ySpan;   // V=1 at bottom, V=0 at ridge

        this.vertices = [
            leftX,     0,    0,   // 0 bottom-left
            rightX,    0,    0,   // 1 bottom-right
            rightX,    this.wallHeight,   0,   // 2 top-right (wall top)
            leftX,     this.wallHeight,   0,   // 3 top-left  (wall top)
            leftMidX,  midY, 0,   // 4 left gambrel break
            rightMidX, midY, 0,   // 5 right gambrel break
            0,         topY, 0,   // 6 ridge
        ];

        this.normals = [];
        for (let i = 0; i < 7; i++) this.normals.push(0, 0, 1);

        this.texCoords = [
            uvX(leftX),     uvY(0),     // 0
            uvX(rightX),    uvY(0),     // 1
            uvX(rightX),    uvY(this.wallHeight),    // 2
            uvX(leftX),     uvY(this.wallHeight),    // 3
            uvX(leftMidX),  uvY(midY),  // 4
            uvX(rightMidX), uvY(midY),  // 5
            uvX(0),         uvY(topY),  // 6
        ];

        this.indices = [
            // lower rectangle
            0, 1, 2,
            0, 2, 3,
            // lower gambrel slopes
            3, 2, 5,
            3, 5, 4,
            // upper triangle to ridge
            4, 5, 6,
            // back faces
            2, 1, 0,
            3, 2, 0,
            5, 2, 3,
            4, 5, 3,
            6, 5, 4,
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}