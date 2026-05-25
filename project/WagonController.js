export class WagonController {
    constructor(wagon, freeCamera, wagonCamera) {
        this.wagon       = wagon;
        this.freeCamera  = freeCamera;
        this.wagonCamera = wagonCamera;
        this.cameraMode = 'wagon';

        this.keys = {};
        document.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
        document.addEventListener('keyup',   (e) => { this.keys[e.code] = false; });
    }

    update(dt) {
        this.wagon.update(
            dt,
            this.keys['KeyW'] || false,
            this.keys['KeyS'] || false,
            this.keys['KeyA'] || false,
            this.keys['KeyD'] || false,
        );

        const wx = this.wagon.posX;
        const wz = this.wagon.posZ;
        const wa = this.wagon.angle;
        const followDist   = 10;
        const followHeight = 4;
        this.wagonCamera.setPosition(vec3.fromValues(
            wx + Math.sin(wa) * followDist,
            followHeight,
            wz - Math.cos(wa) * followDist,
        ));
        this.wagonCamera.setTarget(vec3.fromValues(wx, 1.5, wz));
    }

    get activeCamera() {
        return this.cameraMode === 'wagon' ? this.wagonCamera : this.freeCamera;
    }
}
