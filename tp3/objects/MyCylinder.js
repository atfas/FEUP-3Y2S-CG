import {CGFobject} from '../../lib/CGF.js';

export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {

        let alpha = 2 * Math.PI / this.slices;
        let dz = 1 / this.stacks;

        this.vertices= [];
        this.indices = [];
        this.normals = [];

        //create all vertices
        for (let j = 0; j < this.stacks; j++) {
            let z = j * dz;
            for (let i = 0; i < this.slices; i++) {
                let ang = i * alpha;
                let ca = Math.cos(ang);
                let sa = Math.sin(ang);
            
                this.vertices.push(ca, sa, z);
                this.normals.push(ca, sa, 0);
            }
        }   

        // make indices
        for (let j = 0; j < this.stacks-1; j++) {
            for (let i = 0; i < this.slices; i++) {
                
                let a = j * (this.slices)+ i; 
                let c = a + (this.slices);
                let b = a + 1;
                let d = c + 1;

                //close cylinder
                if(this.slices-1==i){
                   b=j*this.slices;
                   d=b+ this.slices;    
                }
                
                this.indices.push(a, b, c);
                this.indices.push(b, d, c);

                this.indices.push(
                    c,b,a,
                    c,d,b,
                );
            }
        }
        console.log(this.vertices.length);
        console.log(this.indices.length);
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
}
}