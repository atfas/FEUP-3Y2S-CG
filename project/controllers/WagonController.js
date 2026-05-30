export class WagonController {
    constructor(wagon, freeCamera, wagonCamera) {
        this.wagon       = wagon;
        this.freeCamera  = freeCamera;
        this.wagonCamera = wagonCamera;
        this.cameraMode = 'wagon';

        this.followDist         = 30;
        this.followHeight       = 12;
        this.cameraTargetHeight = 4.5;

        this.keys = {};
        // Track whether the key was already down on the previous frame to prevent repeat-spamming
        this.previousKeys = {};

        document.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
        document.addEventListener('keyup',   (e) => { this.keys[e.code] = false; });
    }

    update(dt, scene) {
        // Handle standard driving physics
        this.wagon.update(
            dt,
            this.keys['KeyW'] || false,
            this.keys['KeyS'] || false,
            this.keys['KeyA'] || false,
            this.keys['KeyD'] || false,
        );

        // --- GAME ACTIONS INPUT EDGE DETECTION ---
        // If scene reference is passed, safely invoke game logic mechanics
        if (scene && !scene.gameOver) {
            // Trigger Pick-up exactly once when KeyP transitions from up to down
            if (this.keys['KeyP'] && !this.previousKeys['KeyP']) {
                scene.tryPickUpBale();
            }
            // Trigger Drop-off exactly once when KeyL transitions from up to down
            if (this.keys['KeyL'] && !this.previousKeys['KeyL']) {
                scene.tryDropOffBales();
            }
        }

        // Save current key states for the next frame's edge check
        this.previousKeys['KeyP'] = this.keys['KeyP'];
        this.previousKeys['KeyL'] = this.keys['KeyL'];

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