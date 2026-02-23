import { MyTriangleSmall } from './MyTriangleSmall.js';

export class MyTriangleBig extends MyTriangleSmall {
	constructor(scene) {
		super(scene);
	}
	
    display(){
        this.scene.pushMatrix();
        this.scene.scale(2, 2, 0);
        super.display();
        this.scene.popMatrix();
    }
}