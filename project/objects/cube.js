import {CGFobject} from '../../lib/CGF.js';

/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            // Front face (z = +0.5)
            -0.5, -0.5,  0.5,
             0.5, -0.5,  0.5,
             0.5,  0.5,  0.5,
            -0.5,  0.5,  0.5,

            // Back face (z = -0.5)
             0.5, -0.5, -0.5,
            -0.5, -0.5, -0.5,
            -0.5,  0.5, -0.5,
             0.5,  0.5, -0.5,

            // Left face (x = -0.5)
            -0.5, -0.5, -0.5,
            -0.5, -0.5,  0.5,
            -0.5,  0.5,  0.5,
            -0.5,  0.5, -0.5,

            // Right face (x = +0.5)
             0.5, -0.5,  0.5,
             0.5, -0.5, -0.5,
             0.5,  0.5, -0.5,
             0.5,  0.5,  0.5,

            // Top face (y = +0.5)
            -0.5,  0.5,  0.5,
             0.5,  0.5,  0.5,
             0.5,  0.5, -0.5,
            -0.5,  0.5, -0.5,

            // Bottom face (y = -0.5)
            -0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
             0.5, -0.5,  0.5,
            -0.5, -0.5,  0.5,
        ];

        this.normals = [
            // Front
             0,  0,  1,   0,  0,  1,   0,  0,  1,   0,  0,  1,
            // Back
             0,  0, -1,   0,  0, -1,   0,  0, -1,   0,  0, -1,
            // Left
            -1,  0,  0,  -1,  0,  0,  -1,  0,  0,  -1,  0,  0,
            // Right
             1,  0,  0,   1,  0,  0,   1,  0,  0,   1,  0,  0,
            // Top
             0,  1,  0,   0,  1,  0,   0,  1,  0,   0,  1,  0,
            // Bottom
             0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0,
        ];

        this.indices = [
             0,  1,  2,   0,  2,  3,  // Front
             4,  5,  6,   4,  6,  7,  // Back
             8,  9, 10,   8, 10, 11,  // Left
            12, 13, 14,  12, 14, 15,  // Right
            16, 17, 18,  16, 18, 19,  // Top
            20, 21, 22,  20, 22, 23,  // Bottom
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}