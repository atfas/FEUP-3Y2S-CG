export class InputController {
    constructor() {
        this.keys         = {};
        this.previousKeys = {};

        document.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
        document.addEventListener('keyup',   (e) => { this.keys[e.code] = false; });
    }

    isDown(code) {
        return this.keys[code] || false;
    }

    wasJustPressed(code) {
        return !!(this.keys[code] && !this.previousKeys[code]);
    }

    endFrame() {
        this.previousKeys['KeyP'] = this.keys['KeyP'];
        this.previousKeys['KeyL'] = this.keys['KeyL'];
    }
}
