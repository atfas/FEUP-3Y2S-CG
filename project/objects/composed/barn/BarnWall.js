import { CGFobject } from '../../../../lib/CGF.js';

/**
 * BarnWall
 * @param {CGFscene} scene
 * @param {number}   width   local X extent
 * @param {number}   height  local Y extent
 */
export class BarnWall extends CGFobject {
    constructor(scene, width = 1, height = 1) {
        super(scene);
        this.width  = width;
        this.height = height;
        this.initBuffers();
    }

    initBuffers() {
        const w = this.width  / 2;
        const h = this.height;

        this.vertices = [
            -w, 0, 0,   // 0 – bottom-left
             w, 0, 0,   // 1 – bottom-right
             w, h, 0,   // 2 – top-right
            -w, h, 0,   // 3 – top-left
        ];

        // Front face (normal +Z) and back face (normal -Z)
        this.normals = [
            0, 0, 1, 
            0, 0, 1, 
            0, 0, 1, 
            0, 0, 1,
        ];

        this.texCoords = [
    0,1,
    3,1,
    3,0,
    0,0,
];

        this.indices = [
            0, 1, 2,  
            0, 2, 3,   // front
            2, 1, 0, 
            3, 2, 0,   // back
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
