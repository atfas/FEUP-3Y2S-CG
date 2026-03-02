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
            // Front face (z = 0.5)
            -0.5, -0.5,  0.5,  // 0 - bottom-left
             0.5, -0.5,  0.5,  // 1 - bottom-right
             0.5,  0.5,  0.5,  // 2 - top-right
            -0.5,  0.5,  0.5,  // 3 - top-left

            // Back face (z = -0.5)
            -0.5, -0.5, -0.5,  // 4 - bottom-left
             0.5, -0.5, -0.5,  // 5 - bottom-right
             0.5,  0.5, -0.5,  // 6 - top-right
            -0.5,  0.5, -0.5,  // 7 - top-left
        ];

        // Each face is made of 2 triangles
        this.indices = [
            // Front face (z = 0.5)
            0, 1, 2,
            0, 2, 3,

            // Back face (z = -0.5)
            5, 4, 7,
            5, 7, 6,

            // Left face (x = -0.5)
            4, 0, 3,
            4, 3, 7,

            // Right face (x = 0.5)
            1, 5, 6,
            1, 6, 2,

            // Bottom face (y = -0.5)
            4, 5, 1,
            4, 1, 0,

            // Top face (y = 0.5)
            3, 2, 6,
            3, 6, 7,
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}