export class WorldModel {
    /**
     * @param {MyScene} scene - live scene reference; sun angles are read from
     *                         scene.sunElevation and scene.sunDegree each call
     */
    constructor(scene) {
        this.scene = scene;
    }

    // Pass-through getters so callers don't need a direct scene reference
    get sunElevation()  { return this.scene.sunElevation; }
    get sunDegree()     { return this.scene.sunDegree; }
    get renderRange()   { return this.scene.renderRange; }
    get windStrength()  { return this.scene.windStrength; }

    /**
     * Converts the GUI sun elevation (degrees above horizon) and azimuth
     * (degrees clockwise from north) into a normalised world-space direction
     * vector used by lighting and shader uniforms.
     * @returns {[number, number, number]} [x, y, z] unit direction toward the sun
     */
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
