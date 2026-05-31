import { CGFappearance } from "../../lib/CGF.js";

export class AppearanceLoader {
    /**
     * Creates and attaches every CGFappearance used in the scene directly onto
     * the scene object. Grouping all material definitions here keeps them out
     * of individual object classes and makes colour/shininess tweaks easier to
     * find in one place.
     * @param {MyScene} scene
     */
    constructor(scene) {
        scene.woodAppearance = new CGFappearance(scene);
        scene.woodAppearance.setAmbient(0.35, 0.22, 0.10, 1.0);
        scene.woodAppearance.setDiffuse(0.55, 0.35, 0.16, 1.0);
        scene.woodAppearance.setSpecular(0.08, 0.05, 0.02, 1.0);
        scene.woodAppearance.setTexture(scene.woodTexture);
        scene.woodAppearance.setTextureWrap('REPEAT', 'REPEAT');

        scene.skyAppearance = new CGFappearance(scene);
        scene.skyAppearance.setEmission(1, 1, 1, 1);
        scene.skyAppearance.setAmbient(0.0, 0.0, 0.0, 1.0);
        scene.skyAppearance.setDiffuse(0.0, 0.0, 0.0, 1.0);
        scene.skyAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
        scene.skyAppearance.setTexture(scene.skyTexture);
        scene.skyAppearance.setTextureWrap('REPEAT', 'REPEAT');

        scene.sunAppearance = new CGFappearance(scene);
        scene.sunAppearance.setEmission(1.0, 0.95, 0.5, 1.0);
        scene.sunAppearance.setAmbient(1.0, 0.95, 0.5, 1.0);
        scene.sunAppearance.setDiffuse(0.0, 0.0, 0.0, 1.0);
        scene.sunAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);

        scene.terrainAppearance = new CGFappearance(scene);
        scene.terrainAppearance.setAmbient(0.3, 0.3, 0.3, 1.0);
        scene.terrainAppearance.setDiffuse(0.8, 0.8, 0.8, 1.0);
        scene.terrainAppearance.setSpecular(0.05, 0.05, 0.05, 1.0);
        scene.terrainAppearance.setShininess(5.0);
        scene.terrainAppearance.setTexture(scene.terrainTexture);
        scene.terrainAppearance.setTextureWrap('REPEAT', 'REPEAT');

        scene.arrowAppearance = new CGFappearance(scene);
        scene.arrowAppearance.setEmission(1.0, 0.75, 0.0, 1.0);
        scene.arrowAppearance.setAmbient(1.0, 0.75, 0.0, 1.0);
        scene.arrowAppearance.setDiffuse(0.0, 0.0, 0.0, 1.0);
        scene.arrowAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);

        scene.ringBarnActiveAppearance = new CGFappearance(scene);
        scene.ringBarnActiveAppearance.setAmbient(0.0, 1.0, 0.0, 1.0);
        scene.ringBarnActiveAppearance.setDiffuse(0.0, 1.0, 0.0, 1.0);

        scene.ringBarnInactiveAppearance = new CGFappearance(scene);
        scene.ringBarnInactiveAppearance.setAmbient(0.6, 0.6, 0.6, 1.0);
        scene.ringBarnInactiveAppearance.setDiffuse(0.6, 0.6, 0.6, 1.0);

        scene.ringBaleActiveAppearance = new CGFappearance(scene);
        scene.ringBaleActiveAppearance.setAmbient(1.0, 1.0, 0.0, 1.0);
        scene.ringBaleActiveAppearance.setDiffuse(1.0, 1.0, 0.0, 1.0);

        scene.ringBaleInactiveAppearance = new CGFappearance(scene);
        scene.ringBaleInactiveAppearance.setAmbient(1.0, 0.5, 0.0, 1.0);
        scene.ringBaleInactiveAppearance.setDiffuse(1.0, 0.5, 0.0, 1.0);

        scene.horseAppearance = new CGFappearance(scene);
        scene.horseAppearance.setAmbient(0.30, 0.20, 0.10, 1.0);
        scene.horseAppearance.setDiffuse(0.50, 0.32, 0.15, 1.0);
        scene.horseAppearance.setSpecular(0.10, 0.07, 0.04, 1.0);
        scene.horseAppearance.setShininess(12);

        scene.canvasAppearance = new CGFappearance(scene);
        scene.canvasAppearance.setAmbient(0.90, 0.85, 0.70, 1.0);
        scene.canvasAppearance.setDiffuse(0.90, 0.85, 0.70, 1.0);
        scene.canvasAppearance.setSpecular(0.05, 0.05, 0.04, 1.0);
        scene.canvasAppearance.setShininess(3.0);

        scene.hitBoxAppearance = new CGFappearance(scene);
        scene.hitBoxAppearance.setEmission(1.0, 0.0, 0.2, 1.0);
        scene.hitBoxAppearance.setAmbient(1.0, 0.0, 0.2, 1.0);
        scene.hitBoxAppearance.setDiffuse(0.0, 0.0, 0.0, 1.0);
        scene.hitBoxAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);

        scene.hayBaleSideAppearance = new CGFappearance(scene);
        scene.hayBaleSideAppearance.setAmbient(0.55, 0.42, 0.12, 1.0);
        scene.hayBaleSideAppearance.setDiffuse(0.70, 0.55, 0.18, 1.0);
        scene.hayBaleSideAppearance.setSpecular(0.04, 0.03, 0.01, 1.0);
        scene.hayBaleSideAppearance.setShininess(4.0);
        scene.hayBaleSideAppearance.setTexture(scene.haySideTex);
        scene.hayBaleSideAppearance.setTextureWrap('REPEAT', 'REPEAT');

        scene.hayBaleFaceAppearance = new CGFappearance(scene);
        scene.hayBaleFaceAppearance.setAmbient(0.55, 0.42, 0.12, 1.0);
        scene.hayBaleFaceAppearance.setDiffuse(0.70, 0.55, 0.18, 1.0);
        scene.hayBaleFaceAppearance.setSpecular(0.04, 0.03, 0.01, 1.0);
        scene.hayBaleFaceAppearance.setShininess(4.0);
        scene.hayBaleFaceAppearance.setTexture(scene.hayFaceTex);
        scene.hayBaleFaceAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');

        scene.flowerMaterial = new CGFappearance(scene);
        scene.flowerMaterial.setSpecular(0, 0, 0, 1);
        scene.flowerMaterial.setShininess(5);

        scene.barnWallAppearance = new CGFappearance(scene);
        scene.barnWallAppearance.setAmbient(1, 1, 1, 1);
        scene.barnWallAppearance.setDiffuse(1, 1, 1, 1);
        scene.barnWallAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        scene.barnWallAppearance.setShininess(10);
        scene.barnWallAppearance.loadTexture('textures/barn/barnWallTex.jpg');

        scene.barnFrontAppearance = new CGFappearance(scene);
        scene.barnFrontAppearance.setAmbient(1, 1, 1, 1);
        scene.barnFrontAppearance.setDiffuse(1, 1, 1, 1);
        scene.barnFrontAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        scene.barnFrontAppearance.setShininess(10);
        scene.barnFrontAppearance.loadTexture('textures/barn/barnFrontTex.png');

        scene.barnRoofAppearance = new CGFappearance(scene);
        scene.barnRoofAppearance.setAmbient(1, 1, 1, 1);
        scene.barnRoofAppearance.setDiffuse(1, 1, 1, 1);
        scene.barnRoofAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        scene.barnRoofAppearance.setShininess(10);
        scene.barnRoofAppearance.loadTexture('textures/barn/barnRoofTex.jpg');
    }
}
