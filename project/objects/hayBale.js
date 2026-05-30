import { CGFobject, CGFappearance, CGFtexture } from '../../lib/CGF.js';
import { MyCylinder } from './cylinder.js';
import { MyDisk }     from './disk.js';

/**
 * HayBale
 * A single cylindrical hay bale lying on its side.
 * - Curved surface  → side hay texture  (hayBale_side or the scene's hay texture)
 * - Circular caps   → hayFaceTex.png    (the spiral face texture)
 */
export class HayBale extends CGFobject {
    constructor(scene, x = 0, z = 0, baleRadius= 1.8, baleLength=3) {
        super(scene);
        this.x      = x;
        this.z      = z;
        this.baleLength= baleLength;
        this.baleRadius=baleRadius
        this.r      = Math.hypot(baleLength / 2, baleRadius);  // ≈ 2.34
        this.yRot   = Math.random() * Math.PI * 2;

        this.cylinder = new MyCylinder(scene, 32, 1);
        this.disk     = new MyDisk(scene, 32);

        // ── Side material (golden straw, repeating) ───────────────────────────
        this.sideMat = new CGFappearance(scene);
        this.sideMat.setAmbient(0.55, 0.42, 0.12, 1.0);
        this.sideMat.setDiffuse(0.70, 0.55, 0.18, 1.0);
        this.sideMat.setSpecular(0.04, 0.03, 0.01, 1.0);
        this.sideMat.setShininess(4.0);
        // Use the side-straw image supplied as the first uploaded texture.
        // Adjust path to match where you store your textures.
        this.sideTex = new CGFtexture(scene, 'textures/haySideTex.png');
        this.sideMat.setTexture(this.sideTex);
        this.sideMat.setTextureWrap('REPEAT', 'REPEAT');

        // ── Face / cap material (spiral face texture) ─────────────────────────
        this.faceMat = new CGFappearance(scene);
        this.faceMat.setAmbient(0.55, 0.42, 0.12, 1.0);
        this.faceMat.setDiffuse(0.70, 0.55, 0.18, 1.0);
        this.faceMat.setSpecular(0.04, 0.03, 0.01, 1.0);
        this.faceMat.setShininess(4.0);
        this.faceTex = new CGFtexture(scene, 'textures/hayFaceTex.png');
        this.faceMat.setTexture(this.faceTex);
        this.faceMat.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
    }

    display() {
        // ── Shared transform: bale lying on X-axis, resting on ground ─────────
        // (same as the original)
        this.scene.pushMatrix();
            this.scene.translate(-this.baleLength / 2, this.baleRadius, 0);
            this.scene.rotate(Math.PI / 2, 0, 1, 0);   // cylinder axis → +X
            this.scene.scale(this.baleRadius, this.baleRadius, this.baleLength);

            // ── Curved side ───────────────────────────────────────────────────
            this.sideMat.apply();
            this.cylinder.display();

            // ── Front cap (z = 1 in local scaled space) ───────────────────────
            // The cylinder goes z = 0 → 1.  We place the front disk at z = 1.
            this.faceMat.apply();

            this.scene.pushMatrix();
                this.scene.translate(0, 0, 1);          // move to far end
                this.disk.display();
            this.scene.popMatrix();

            // ── Back cap (z = 0, flipped 180° around Y so normals face out) ───
            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 1, 0);   // flip to face -Z
                this.disk.display();
            this.scene.popMatrix();

        this.scene.popMatrix();
    }
}