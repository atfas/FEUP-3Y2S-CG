export class WorldModel {
    constructor(scene) {
        this.scene = scene;
    }

    get sunElevation()  { return this.scene.sunElevation; }
    get sunDegree()     { return this.scene.sunDegree; }
    get renderRange()   { return this.scene.renderRange; }
    get windStrength()  { return this.scene.windStrength; }

    getSunDirection() {
        const elevation = this.scene.sunElevation * Math.PI / 180;
        const degree  = this.scene.sunDegree    * Math.PI / 180;
        return [
            Math.cos(elevation) * Math.sin(degree),
            Math.sin(elevation),
            Math.cos(elevation) * Math.cos(degree),
        ];
    }
}
