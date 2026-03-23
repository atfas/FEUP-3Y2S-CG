import {CGFobject} from '../../lib/CGF.js';

export class MyPrismLines extends CGFobject {
	constructor(scene, slices, stacks) {
		super(scene);

		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	}

	initBuffers(){

		this.vertices = [];
		this.indices = [];

		let alpha = 2 * Math.PI / this.slices;
		let dz = 1 / this.stacks;

		let index = 0;

		for(let j = 1; j < this.stacks; j++){

			let z = j * dz;

			for(let i = 0; i < this.slices; i++){

				let ang = i * alpha;
				let angNext = (i+1) * alpha;

				let x1 = Math.cos(ang);
				let y1 = Math.sin(ang);

				let x2 = Math.cos(angNext);
				let y2 = Math.sin(angNext);

				this.vertices.push(x1,y1,z);
				this.vertices.push(x2,y2,z);

				this.indices.push(index, index+1);

				index += 2;
			}
		}

		this.primitiveType = this.scene.gl.LINES;
		this.initGLBuffers();
	}
}