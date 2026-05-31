import { CGFobject } from '../../../lib/CGF.js';
import { MyCylinder } from '../basics/cylinder.js';
import { MyDisk }     from '../basics/disk.js';

/**
 * HayBale
 * A single cylindrical hay bale lying on its side.
 * - Curved surface  → side hay texture  (hayBale_side or the scene's hay texture)
 * - Circular caps   → hayFaceTex.png    (the spiral face texture)
 */
export class HayBale extends CGFobject {
    /**
     * @param {MyScene} scene
     * @param {number}  [x=0]          - world X position
     * @param {number}  [z=0]          - world Z position
     * @param {number}  [baleRadius=1.8] - cylinder cross-section radius
     * @param {number}  [baleLength=3]   - cylinder length along the roll axis
     */
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
    }

    /**
     * Draws the bale lying on its side along the X-axis: first the curved
     * lateral surface with the side hay texture, then two circular end caps
     * with the face spiral texture. The whole assembly rests on the ground
     * (y = baleRadius).
     */
    display() {
        // ── Shared transform: bale lying on X-axis, resting on ground ─────────
        // (same as the original)
        this.scene.pushMatrix();
            this.scene.translate(-this.baleLength / 2, this.baleRadius, 0);
            this.scene.rotate(Math.PI / 2, 0, 1, 0);   // cylinder axis → +X
            this.scene.scale(this.baleRadius, this.baleRadius, this.baleLength);

            // ── Curved side ───────────────────────────────────────────────────
            this.scene.hayBaleSideAppearance.apply();
            this.cylinder.display();

            // ── Front cap (z = 1 in local scaled space) ───────────────────────
            // The cylinder goes z = 0 → 1.  We place the front disk at z = 1.
            this.scene.hayBaleFaceAppearance.apply();

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
