import { CGFobject } from '../../../lib/CGF.js';

export class BarnGable extends CGFobject {

    constructor(scene, width, wallH, roofH, overhang = 0) {
        super(scene);

        this.width = width;
        this.wallH = wallH;
        this.roofH = roofH;
        this.overhang = overhang;

        this.initBuffers();
    }

    initBuffers() {

        const W  = this.width;
        const wH = this.wallH;
        const rH = this.roofH;
        const ov = this.overhang;

        // MUST MATCH ROOF
        const inset = W * 0.34;

        const midY = wH + rH * 0.82;
        const topY = wH + rH;

        // EXTEND TO MATCH ROOF OVERHANG
        const leftX  = -(W/2 + ov);
        const rightX =  (W/2 + ov);

        const leftMidX  = -inset;
        const rightMidX = inset;

        // ─────────────────────────────

        this.vertices = [

            // BODY
            leftX,  0, 0,      // 0
            rightX, 0, 0,      // 1

            rightX, wH, 0,     // 2
            leftX,  wH, 0,     // 3

            // BREAK POINTS
            leftMidX,  midY, 0, // 4
            rightMidX, midY, 0, // 5

            // RIDGE
            0, topY, 0          // 6
        ];

        // NORMALS
        this.normals = [];

        for(let i = 0; i < 7; i++) {
            this.normals.push(0,0,1);
        }

        // TEXCOORDS
        this.texCoords = [

            0,1,
            1,1,

            1,0.45,
            0,0.45,

            0.25,0.18,
            0.75,0.18,

            0.5,0
        ];

        // INDICES
        this.indices = [

            // RECTANGLE
            0,1,2,
            0,2,3,

            // LOWER ROOF
            3,2,5,
            3,5,4,

            // TOP
            4,5,6,

            // BACKFACE
            2,1,0,
            3,2,0,

            5,2,3,
            4,5,3,

            6,5,4
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}