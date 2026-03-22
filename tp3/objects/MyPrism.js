import {CGFobject} from '../../lib/CGF.js';

export class MyPrism extends CGFobject {
	constructor(scene, slices, stacks) {
		super(scene);

		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	}

	initBuffers() {

		this.vertices = [];
		this.indices = [];
		this.normals = [];

		let alpha = 2 * Math.PI / this.slices;
		let dz = 1 / this.stacks;

		let vertIndex = 0;

		for (let i = 0; i < this.slices; i++) {

			let ang = i * alpha;
			let angNext = (i + 1) * alpha;

			let ca = Math.cos(ang);
			let sa = Math.sin(ang);

			let caNext = Math.cos(angNext);
			let saNext = Math.sin(angNext);

			// normal da face
			let nx = Math.cos(ang + alpha / 2);
			let ny = Math.sin(ang + alpha / 2);
			let nz = 0;

			for (let j = 0; j < this.stacks; j++) {

				let z1 = j * dz;
				let z2 = (j + 1) * dz;

				// 4 vértices do retângulo
				this.vertices.push(ca, sa, z1);
				this.vertices.push(caNext, saNext, z1);
				this.vertices.push(ca, sa, z2);
				this.vertices.push(caNext, saNext, z2);

				// índices (2 triângulos)
				this.indices.push(
					vertIndex, vertIndex+1, vertIndex+2,
					vertIndex+1, vertIndex+3, vertIndex+2
				);
                // lado de trás
                this.indices.push(
                    vertIndex+2, vertIndex+1, vertIndex,
                    vertIndex+2, vertIndex+3, vertIndex+1
                );
				// mesma normal para os 4 vértices
				for(let k=0;k<4;k++){
					this.normals.push(nx, ny, nz);
				}

				vertIndex += 4;
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}