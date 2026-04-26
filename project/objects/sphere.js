import {CGFobject} from '../../lib/CGF.js';

export class Sphere extends CGFobject {
    constructor(scene, slices, stacks, percentage = 1, invert=false) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;
        this.percentage= percentage;
        this.invert=invert;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const dPhi   = (Math.PI * this.percentage)/ this.stacks;        // vertical angle step (top → bottom)
        const dTheta = 2 * Math.PI / this.slices;    // horizontal angle step (around)

        // Generate vertices
        for (let j = 0; j <= this.stacks; j++) {
            const phi = j * dPhi;                    // 0 → pi

            for (let i = 0; i <= this.slices; i++) {
                const theta = i * dTheta;            // 0 → 2pi

                const x = Math.sin(phi) * Math.cos(theta);
                const y = Math.sin(phi) * Math.sin(theta);
                const z = Math.cos(phi);

                this.vertices.push(x, y, z);
                if(this.invert){
                    this.normals.push(-x, -y, -z); //normals faced inside
                }else{
                    this.normals.push(x, y, z); //normals faced outside
                }       
                this.texCoords.push(i / this.slices, j / this.stacks);
            }
        }

        // Generate indices
        for (let j = 0; j < this.stacks; j++) {
            for (let i = 0; i < this.slices; i++) {
                const a = j * (this.slices + 1) + i;
                const b = a + 1;
                const c = a + (this.slices + 1);
                const d = c + 1;

                this.indices.push(a, b, c);
                this.indices.push(b, d, c);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}