import {CGFobject} from '../../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";

export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);

        this.diamond = new MyDiamond(scene);
        this.triangle = new MyTriangle(scene);
        this.parallelogram = new MyParallelogram(scene);
        this.triangleSmall = new MyTriangleSmall(scene);
        this.triangleBig = new MyTriangleBig(scene);
    }

    pinkTriangle() {
        this.scene.pushMatrix();
        this.scene.setDiffuse(1, 0.7, 0.8);
        this.scene.rotate( 5*(Math.PI /4), 0, 0, 1);
        this.triangle.display();
        this.scene.popMatrix();
    }
    greenDiamond() {
        this.scene.pushMatrix();
        this.scene.setDiffuse(0, 1, 0);
        this.scene.translate(-1, Math.sqrt(2), 0);
        this.diamond.display();
        this.scene.popMatrix();
    }  
    yellowParallelogram() {
        this.scene.pushMatrix();
        this.scene.setDiffuse(1, 1, 0);
        this.scene.translate(2+Math.sqrt(2), 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.parallelogram.display();
        this.scene.popMatrix();
    }
    blueTriangle() {
        this.scene.pushMatrix();
        this.scene.setDiffuse(0, 0, 1);
        this.scene.translate(-1, 1+Math.sqrt(2), 0);
        this.scene.rotate( -Math.PI /4, 0, 0, 1);
        this.triangleBig.display();
        this.scene.popMatrix();
    }
    orangeTriangle() {
        this.scene.pushMatrix();
        this.scene.setDiffuse(1, 0.5, 0);
        this.scene.translate(-1, 1+ 3*Math.sqrt(2), 0);
        this.scene.rotate( 3*Math.PI /4, 0, 0, 1);
        this.triangleBig.display();
        this.scene.popMatrix();
    }
    redTriangle() {
        this.scene.pushMatrix();
        this.scene.setDiffuse(1, 0, 0);
        this.scene.translate(-1-Math.sqrt(2), Math.PI/2 +2, 0);
        this.scene.rotate( Math.PI /2, 0, 0, 1);
        this.triangleSmall.display();
        this.scene.popMatrix();
    }
    purpleTriangle() {
        this.scene.pushMatrix();
        this.scene.setDiffuse(0.5, 0, 0.5);
        this.scene.translate(0.01-Math.PI, 1+ 4* Math.sqrt(2), 0);
        this.scene.rotate( -3*Math.PI /4, 0, 0, 1);
        this.triangleSmall.display();
        this.scene.popMatrix();
    }
    display() {
        this.scene.pushMatrix();
        this.scene.translate(0, -1-Math.sqrt(2), 0);

        this.pinkTriangle();
        this.greenDiamond();
        this.yellowParallelogram();
        this.blueTriangle();
        this.orangeTriangle();
        this.redTriangle();
        this.purpleTriangle();     
        
        this.scene.popMatrix();
    }
}