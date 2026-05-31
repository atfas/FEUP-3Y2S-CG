export class InputController {
    constructor() {
        this.keys         = {};
        this.previousKeys = {};

        document.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
        document.addEventListener('keyup',   (e) => { this.keys[e.code] = false; });
    }

    /**
     * Returns true while the key identified by `code` is held down.
     * @param {string} code - KeyboardEvent.code value (e.g. 'KeyW')
     * @returns {boolean}
     */
    isDown(code) {
        return this.keys[code] || false;
    }

    /**
     * Returns true only on the first frame a key transitions from up to down.
     * Relies on previousKeys being snapshotted by endFrame() at the end of each tick.
     * @param {string} code - KeyboardEvent.code value (e.g. 'KeyP')
     * @returns {boolean}
     */
    wasJustPressed(code) {
        return !!(this.keys[code] && !this.previousKeys[code]);
    }

    /**
     * Snapshots the current key states into previousKeys so that
     * wasJustPressed() can detect rising edges on the next frame.
     * Only the action keys (P, L) are tracked to avoid unbounded map growth.
     */
    endFrame() {
        this.previousKeys['KeyP'] = this.keys['KeyP'];
        this.previousKeys['KeyL'] = this.keys['KeyL'];
    }
}
