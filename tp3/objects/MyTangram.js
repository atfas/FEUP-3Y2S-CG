import {CGFobject, CGFappearance} from '../../lib/CGF.js';
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

        this.initMaterials();
    }

    initMaterials() {
        // Pink Triangle
        this.pinkMaterial = new CGFappearance(this.scene);
        this.pinkMaterial.setAmbient(0.3, 0.2, 0.25, 1.0);
        this.pinkMaterial.setDiffuse(1, 0.7, 0.8, 1.0);
        this.pinkMaterial.setSpecular(1, 0.8, 0.9, 1.0);
        this.pinkMaterial.setShininess(50.0);

        // Green Diamond
        this.greenMaterial = new CGFappearance(this.scene);
        this.greenMaterial.setAmbient(0.0, 0.3, 0.0, 1.0);
        this.greenMaterial.setDiffuse(0, 1, 0, 1.0);
        this.greenMaterial.setSpecular(0.5, 1, 0.5, 1.0);
        this.greenMaterial.setShininess(50.0);

        // Yellow Parallelogram
        this.yellowMaterial = new CGFappearance(this.scene);
        this.yellowMaterial.setAmbient(0.3, 0.3, 0.0, 1.0);
        this.yellowMaterial.setDiffuse(1, 1, 0, 1.0);
        this.yellowMaterial.setSpecular(1, 1, 0.5, 1.0);
        this.yellowMaterial.setShininess(50.0);

        // Blue Triangle (Big)
        this.blueMaterial = new CGFappearance(this.scene);
        this.blueMaterial.setAmbient(0.0, 0.0, 0.3, 1.0);
        this.blueMaterial.setDiffuse(0, 0, 1, 1.0);
        this.blueMaterial.setSpecular(0.5, 0.5, 1, 1.0);
        this.blueMaterial.setShininess(50.0);

        // Orange Triangle (Big)
        this.orangeMaterial = new CGFappearance(this.scene);
        this.orangeMaterial.setAmbient(0.3, 0.15, 0.0, 1.0);
        this.orangeMaterial.setDiffuse(1, 0.5, 0, 1.0);
        this.orangeMaterial.setSpecular(1, 0.7, 0.3, 1.0);
        this.orangeMaterial.setShininess(50.0);

        // Red Triangle (Small)
        this.redMaterial = new CGFappearance(this.scene);
        this.redMaterial.setAmbient(0.3, 0.0, 0.0, 1.0);
        this.redMaterial.setDiffuse(1, 0, 0, 1.0);
        this.redMaterial.setSpecular(1, 0.5, 0.5, 1.0);
        this.redMaterial.setShininess(50.0);

        // Purple Triangle (Small)
        this.purpleMaterial = new CGFappearance(this.scene);
        this.purpleMaterial.setAmbient(0.15, 0.0, 0.15, 1.0);
        this.purpleMaterial.setDiffuse(0.5, 0, 0.5, 1.0);
        this.purpleMaterial.setSpecular(0.8, 0.3, 0.8, 1.0);
        this.purpleMaterial.setShininess(50.0);
    }

    pinkTriangle() {
        this.scene.pushMatrix();
        this.pinkMaterial.apply();
        this.scene.rotate( 5*(Math.PI /4), 0, 0, 1);
        this.triangle.display();
        this.scene.popMatrix();
    }
    greenDiamond() {
        this.scene.pushMatrix();
        this.greenMaterial.apply();
        this.scene.translate(-1, Math.sqrt(2), 0);
        this.diamond.display();
        this.scene.popMatrix();
    }  
    yellowParallelogram() {
        this.scene.pushMatrix();
        this.yellowMaterial.apply();
        this.scene.translate(2+Math.sqrt(2), 0, 0);
        this.scene.scale(-1,1,1);
        this.parallelogram.display();
        this.scene.popMatrix();
    }
    blueTriangle() {
        this.scene.pushMatrix();
        this.blueMaterial.apply();
        this.scene.translate(-1, 1+Math.sqrt(2), 0);
        this.scene.rotate( -Math.PI /4, 0, 0, 1);
        this.triangleBig.display();
        this.scene.popMatrix();
    }
    orangeTriangle() {
        this.scene.pushMatrix();
        this.orangeMaterial.apply();
        this.scene.translate(-1, 1+ 3*Math.sqrt(2), 0);
        this.scene.rotate( 3*Math.PI /4, 0, 0, 1);
        this.triangleBig.display();
        this.scene.popMatrix();
    }
    redTriangle() {
        this.scene.pushMatrix();
        this.redMaterial.apply();
        this.scene.translate(-1-Math.sqrt(2), Math.PI/2 +2, 0);
        this.scene.rotate( Math.PI /2, 0, 0, 1);
        this.triangleSmall.display();
        this.scene.popMatrix();
    }
    purpleTriangle() {
        this.scene.pushMatrix();
        this.purpleMaterial.apply();
        this.scene.translate(0.01-Math.PI, 1+ 4* Math.sqrt(2), 0);
        this.scene.rotate( -3*Math.PI /4, 0, 0, 1);
        this.triangleSmall.display();
        this.scene.popMatrix();
    }
    display() {
        this.pinkTriangle();
        this.greenDiamond();
        this.yellowParallelogram();
        this.blueTriangle();
        this.orangeTriangle();
        this.redTriangle();
        this.purpleTriangle();
    }

    enableNormalViz(){
        this.diamond.enableNormalViz();
        this.triangle.enableNormalViz();
        this.parallelogram.enableNormalViz();
        this.triangleSmall.enableNormalViz();
        this.triangleBig.enableNormalViz();
    }

    disableNormalViz(){
        this.diamond.disableNormalViz();
        this.triangle.disableNormalViz();
        this.parallelogram.disableNormalViz();
        this.triangleSmall.disableNormalViz();
        this.triangleBig.disableNormalViz();
    }
}