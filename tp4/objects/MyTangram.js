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
        this.pinkMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.pinkMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.pinkMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.pinkMaterial.setShininess(10.0);
        this.pinkMaterial.loadTexture('images/tangram.png');

        // Green Diamond
        this.greenMaterial = new CGFappearance(this.scene);
        this.greenMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.greenMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.greenMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.greenMaterial.setShininess(10.0);
        this.greenMaterial.loadTexture('images/tangram.png');

        // Yellow Parallelogram
        this.yellowMaterial = new CGFappearance(this.scene);
        this.yellowMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.yellowMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.yellowMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.yellowMaterial.setShininess(10.0);
        this.yellowMaterial.loadTexture('images/tangram.png');

        // Blue Triangle (Big)
        this.blueMaterial = new CGFappearance(this.scene);
        this.blueMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.blueMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.blueMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.blueMaterial.setShininess(10.0);
        this.blueMaterial.loadTexture('images/tangram.png');

        // Orange Triangle (Big)
        this.orangeMaterial = new CGFappearance(this.scene);
        this.orangeMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.orangeMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.orangeMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.orangeMaterial.setShininess(10.0);
        this.orangeMaterial.loadTexture('images/tangram.png');

        // Red Triangle (Small)
        this.redMaterial = new CGFappearance(this.scene);
        this.redMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.redMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.redMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.redMaterial.setShininess(10.0);
        this.redMaterial.loadTexture('images/tangram.png');
        
        // violet Triangle (Small)
        this.violetMaterial = new CGFappearance(this.scene);
        this.violetMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.violetMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.violetMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.violetMaterial.setShininess(10.0);
        this.violetMaterial.loadTexture('images/tangram.png');

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

        // Update tex coords specifically for the blue triangle (big triangle)
        this.triangleBig.updateTexCoords([
            1.0, 0.0,
            0.0, 0.0,
            0.5, 0.5,

            1.0, 0.0,
            0.0, 0.0,
            0.5, 0.5,
        ])

        this.scene.translate(-1, 1+Math.sqrt(2), 0);
        this.scene.rotate( -Math.PI /4, 0, 0, 1);
        this.triangleBig.display();
        this.scene.popMatrix();
    }
    orangeTriangle() {
        this.scene.pushMatrix();
        this.orangeMaterial.apply();

        // Update tex coords specifically for the orange triangle (big triangle)
        this.triangleBig.updateTexCoords([
            1.0, 1.0,
            1.0, 0.0,
            0.5, 0.5,

            1.0, 1.0,
            1.0, 0.0,
            0.5, 0.5,
        ])

        this.scene.translate(-1, 1+ 3*Math.sqrt(2), 0);
        this.scene.rotate( 3*Math.PI /4, 0, 0, 1);
        this.triangleBig.display();
        this.scene.popMatrix();
    }
    redTriangle() {
        this.scene.pushMatrix();
        this.redMaterial.apply();

        // Update tex coords specifically for the red triangle (small triangle)
        this.triangleSmall.updateTexCoords([
            0.25, 0.75,
            0.75, 0.75,
            0.5, 0.5,

            0.25, 0.75,
            0.75, 0.75,
            0.5, 0.5,
        ])

        this.scene.translate(-1-Math.sqrt(2), Math.PI/2 +2, 0);
        this.scene.rotate( Math.PI /2, 0, 0, 1);
        this.triangleSmall.display();
        this.scene.popMatrix();
    }
    violetTriangle() {
        this.scene.pushMatrix();
        this.violetMaterial.apply();

        // Update tex coords specifically for the violet triangle (small triangle)
        this.triangleSmall.updateTexCoords([
            0, 0,
			0, 0.5,
			0.25, 0.25,

			0, 0,
			0, 0.5,
			0.25, 0.25,
        ])
      
        this.scene.translate(-0.92-Math.sqrt(2)-Math.PI/4, Math.PI/2 +5, 0);
        this.scene.rotate( -3*Math.PI /4, 0, 0, 1);
        this.triangleSmall.display();
        this.scene.popMatrix();
    }
    display() {
        this.scene.pushMatrix();
        // Tangram transformations
        this.scene.scale(0.25,0.25,0.25);
        this.scene.translate(0,-2-Math.sqrt(2),0);

        // Draw objects
        this.pinkTriangle();
        this.greenDiamond();
        this.yellowParallelogram();
        this.blueTriangle();
        this.orangeTriangle();
        this.redTriangle();
        this.violetTriangle();
        this.scene.popMatrix();
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