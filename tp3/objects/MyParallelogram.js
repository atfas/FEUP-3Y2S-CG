import {CGFobject} from '../../lib/CGF.js';

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
			3, 1, 0,	//3

			0, 0, 0,	//4
			2, 0, 0,	//5
			1, 1, 0,	//6
			3, 1, 0,	//7
		];

		// Double-sided
		this.indices = [
			2, 1, 0,
			2, 3, 1,
			4, 5, 6,
			5, 7, 6
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,

			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
		]

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}