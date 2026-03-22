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

            //left face
            -0.5, -0.5, -0.5,  // 8
            -0.5, -0.5,  0.5,  // 9
            -0.5,  0.5,  0.5,  // 10
            -0.5,  0.5, -0.5,  // 11

            //right face
            0.5, -0.5,  0.5,  // 12
            0.5, -0.5, -0.5,  // 13 
            0.5,  0.5, -0.5,  // 14 
            0.5,  0.5,  0.5,  // 15 

            //bottom face
            -0.5, -0.5, -0.5,  // 16 
            0.5, -0.5, -0.5,  // 17 
            0.5, -0.5,  0.5,  // 18 
            -0.5, -0.5,  0.5,  // 19 

            //top face
            -0.5,  0.5,  0.5,  // 20 
            0.5,  0.5,  0.5,  // 21 
            0.5,  0.5, -0.5,  // 22 
            -0.5,  0.5, -0.5,  // 23 


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
            8, 9, 10,
            8, 10, 11,

            // Right face (x = 0.5)
            12, 13, 14,
            12, 14, 15,

            // Bottom face (y = -0.5)
            16, 17, 18,
            16, 18, 19,

            // Top face (y = 0.5)
            20, 21, 22,
            20, 22, 23,
        ];

        this.normals = [
            0,0,1,
            0,0,1,
            0,0,1,
            0,0,1,
            0,0,-1,
            0,0,-1,
            0,0,-1,
            0,0,-1,
            -1,0,0,
            -1,0,0,
            -1,0,0,
            -1,0,0,
            1,0,0,
            1,0,0,
            1,0,0,
            1,0,0,
            0,-1,0,
            0,-1,0,
            0,-1,0,
            0,-1,0,
            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0,
        ]

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}