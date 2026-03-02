import {CGFobject} from '../../lib/CGF.js';
import {MyQuad} from './MyQuad.js'

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene) {
        super(scene);
        this.MyQuad = new MyQuad(scene);
    }
    
    displayBase(){
        this.scene.pushMatrix();
        this.scene.translate(0,-0.5,0);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.MyQuad.display();
        this.scene.popMatrix();        
    }

    displayTop(){
        this.scene.pushMatrix();
        this.scene.translate(0,1,0);
        this.displayBase();
        this.scene.popMatrix();
    }
    displayFront(){
        this.scene.pushMatrix();
        this.scene.translate(0,0,0.5)
        this.MyQuad.display();
        this.scene.popMatrix();      
    }
    displayBack(){
        this.scene.pushMatrix();
        this.scene.translate(0,0,-1);
        this.displayFront();
        this.scene.popMatrix();
    }

    displayLeft(){
        this.scene.pushMatrix();
        this.scene.translate(-0.5,0,0);
        this.scene.rotate(-Math.PI/2,0,1,0);
        this.MyQuad.display();
        this.scene.popMatrix();
    }

    displayRight(){
        this.scene.pushMatrix();
        this.scene.translate(1,0,0);
        this.displayLeft();
        this.scene.popMatrix();
    }

    displaySides(){
        this.displayFront();
        this.displayBack();
        this.displayLeft();
        this.displayRight();
    }

    display(){
        this.displayBase();
        this.displayTop();
        this.displaySides();
    }
}

