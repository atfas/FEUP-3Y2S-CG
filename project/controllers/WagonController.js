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

        const scale = 3;
        const wx = this.wagon.posX * scale;
        const wz = this.wagon.posZ * scale;
        const wa = this.wagon.angle;
        const followDist   = 10*scale;
        const followHeight = 4*scale;
        this.wagonCamera.setPosition(vec3.fromValues(
            wx + Math.sin(wa) * followDist,
            followHeight,
            wz - Math.cos(wa) * followDist,
        ));
        this.wagonCamera.setTarget(vec3.fromValues(wx, 1.5*scale, wz));
    }

    get activeCamera() {
        return this.cameraMode === 'wagon' ? this.wagonCamera : this.freeCamera;
    }
}
