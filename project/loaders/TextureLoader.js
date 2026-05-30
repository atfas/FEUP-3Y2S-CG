import { CGFtexture } from "../../lib/CGF.js";

export class TextureLoader {
    constructor(scene) {
        scene.skyTexture     = new CGFtexture(scene, "textures/sky/skyTex.png");
        scene.skyMap         = new CGFtexture(scene, "textures/sky/skyMap.png");
        scene.terrainTexture = new CGFtexture(scene, "textures/terrain/terrain.jpg");
        scene.hillMap        = new CGFtexture(scene, "textures/terrain/hillMap.png");
        scene.pathMask       = new CGFtexture(scene, "textures/terrain/path1.png");
        scene.pathTex        = new CGFtexture(scene, "textures/terrain/pathTex.jpg");
        scene.woodTexture    = new CGFtexture(scene, "textures/environment/wood.jpg");
        scene.rockTexture    = new CGFtexture(scene, "textures/environment/rock.jpg");
        scene.haySideTex     = new CGFtexture(scene, "textures/hay/haySideTex.png");
        scene.hayFaceTex     = new CGFtexture(scene, "textures/hay/hayFaceTex.png");
    }
}
