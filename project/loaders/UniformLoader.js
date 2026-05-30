export class UniformLoader {
    constructor(scene) {
        const initialSunDir = scene.getSunDirection();
        scene._uSkyTime         = { uTimeFactor: 0 };
        scene._uGrassWind       = { uTime: 0, uWindStrength: scene.windStrength };
        scene._uTerrainLighting = { uSunDirection: initialSunDir };
        scene._uGrassLive       = { uSunDirection: initialSunDir, uDeadGrass: 0.0 };
        scene._uGrassDead       = { uSunDirection: initialSunDir, uDeadGrass: 1.0 };
        scene._uRock            = { uSampler: 0, uSunDirection: initialSunDir };
        scene._uArrow           = { uTimeFactor: 0 };
    }
}
