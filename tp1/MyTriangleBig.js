import { MyTriangleSmall } from './MyTriangleSmall.js';

export class MyTriangleBig extends MyTriangleSmall {
	constructor(scene) {
		super(scene);
	}
	
    display(){
        this.scene.pushMatrix();
        this.scene.scale(2, 2, 1);
        super.display();
        this.scene.popMatrix();
    }
}