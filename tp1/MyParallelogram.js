import {CGFobject} from '../lib/CGF.js';

export class MyParallelogram extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			0, 0, 0,	//0
			2, 0, 0,	//1
			1, 1, 0,	//2
			3, 1, 0		//3
		];

		// Double-sided
		this.indices = [
            0, 1, 2,
            0, 2, 3,

        //back faces 
            2, 1, 0,
            3, 2, 0
        ];



		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}