import { CGFshader } from "../../lib/CGF.js";

export class ShaderLoader {
    constructor(scene) {
        scene.terrainShader = new CGFshader(scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");
        scene.terrainShader.setUniformsValues({
            uHeightMap:   1,
            uPathMask:    2,
            uPathTex:     3,
            uHeightScale: 0.07
        });

        scene.skyShader = new CGFshader(scene.gl, "shaders/sky.vert", "shaders/sky.frag");
        scene.skyShader.setUniformsValues({ uSampler2: 1, uTimeFactor: 0, uNormScale: 1 });

        scene.rockShader = new CGFshader(scene.gl, "shaders/rock.vert", "shaders/rock.frag");

        scene.woodShader = new CGFshader(scene.gl, "shaders/wood.vert", "shaders/wood.frag");
        scene.woodShader.setUniformsValues({ uSunDirection: scene.getSunDirection() });

        scene.grassShader = new CGFshader(scene.gl, "shaders/grass.vert", "shaders/grass.frag");

        scene.arrowShader = new CGFshader(scene.gl, "shaders/arrow.vert", "shaders/arrow.frag");
        scene.arrowShader.setUniformsValues({ uTimeFactor: 0 });

        scene.canvasShader = new CGFshader(scene.gl, "shaders/canvas.vert", "shaders/canvas.frag");
        scene.canvasShader.setUniformsValues({
            uSunDirection: scene.getSunDirection(),
            uNumStacks:    5.0,
            uQuadraticDepth:     0.10
        });
    }
}