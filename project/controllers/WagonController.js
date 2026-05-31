export class WagonController {
    /**
     * @param {Wagon}           wagon           - the player wagon object
     * @param {CGFcamera}       freeCamera      - free-roam camera
     * @param {CGFcamera}       wagonCamera     - third-person chase camera
     * @param {InputController} inputController - per-frame keyboard state
     */
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

    /**
     * Advances wagon physics from WASD input, then repositions the chase
     * camera behind the wagon at a fixed follow distance and height.
     * @param {number} dt - delta time in seconds since the last frame
     */
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

    /**
     * Returns the camera currently selected by cameraMode: the chase camera
     * when in 'wagon' mode, or the free-roam camera otherwise.
     * @returns {CGFcamera}
     */
    get activeCamera() {
        return this.cameraMode === 'wagon' ? this.wagonCamera : this.freeCamera;
    }
}
