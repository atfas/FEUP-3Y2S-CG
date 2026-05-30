export class WagonController {
    constructor(wagon, freeCamera, wagonCamera, inputController) {
        this.wagon       = wagon;
        this.freeCamera  = freeCamera;
        this.wagonCamera = wagonCamera;
        this.cameraMode  = 'wagon';
        this.input      = inputController;

        this.followDist         = 30;
        this.followHeight       = 12;
        this.cameraTargetHeight = 4.5;
    }

    update(dt) {
        this.wagon.update(
            dt,
            this.input.isDown('KeyW'),
            this.input.isDown('KeyS'),
            this.input.isDown('KeyA'),
            this.input.isDown('KeyD'),
        );

        this.wagonCamera.setPosition(vec3.fromValues(
            this.wagon.x + Math.sin(this.wagon.angle) * this.followDist,
            this.followHeight,
            this.wagon.z - Math.cos(this.wagon.angle) * this.followDist,
        ));
        this.wagonCamera.setTarget(vec3.fromValues(this.wagon.x, this.cameraTargetHeight, this.wagon.z));
    }

    get activeCamera() {
        return this.cameraMode === 'wagon' ? this.wagonCamera : this.freeCamera;
    }
}