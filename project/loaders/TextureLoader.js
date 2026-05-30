import { CGFtexture } from "../../lib/CGF.js";

export class TextureLoader {
    constructor(scene) {
        scene.skyTexture     = new CGFtexture(scene, "textures/skyTex.png");
        scene.skyMap         = new CGFtexture(scene, "textures/skyMap.png");
        scene.terrainTexture = new CGFtexture(scene, "textures/terrain.jpg");
        scene.hillMap        = new CGFtexture(scene, "textures/hillMap.png");
        scene.pathMask       = new CGFtexture(scene, "textures/path1.png");
        scene.pathTex        = new CGFtexture(scene, "textures/pathTex.jpg");
        scene.woodTexture    = new CGFtexture(scene, "textures/wood.jpg");
        scene.rockTexture    = new CGFtexture(scene, "textures/rock.jpg");
        scene.haySideTex     = new CGFtexture(scene, "textures/haySideTex.png");
        scene.hayFaceTex     = new CGFtexture(scene, "textures/hayFaceTex.png");
    }
}
