import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyUnitCube } from './cube.js';
import { MyCylinder } from './cylinder.js';

export class Wagon extends CGFobject {
    constructor(scene) {
        super(scene);

        this.cube  = new MyUnitCube(scene);
        this.wheel = new MyCylinder(scene, 16, 2);
        this.arch  = new MyCylinder(scene, 20, 2, 0.5);

        this.canvasMat = new CGFappearance(scene);
        this.canvasMat.setAmbient(0.90, 0.85, 0.70, 1.0);
        this.canvasMat.setDiffuse(0.90, 0.85, 0.70, 1.0);
        this.canvasMat.setSpecular(0.05, 0.05, 0.04, 1.0);
        this.canvasMat.setShininess(3.0);
    }

    displayBed() {

        // Floor 
        this.scene.pushMatrix();
            this.scene.translate(0.5, 0.5, 0);
            this.scene.scale(2.9, 0.1, 2.0);
            this.cube.display();
        this.scene.popMatrix();

        // side walls
        for (const side of [-1, 1]) {
            this.scene.pushMatrix();
                this.scene.translate(0.75, 0.75, side * 1.0);
                this.scene.scale(2.5, 0.5, 0.1);
                this.cube.display();
            this.scene.popMatrix();
        }

        // back wall
        this.scene.pushMatrix();
            this.scene.translate(2, 0.75, 0);
            this.scene.scale(0.1, 0.5, 2.0);
            this.cube.display();
        this.scene.popMatrix();

    }

    displayWheels() {
        const WR = 0.5;
        const WT = 0.2;
        const zScale = WT;
        const NUM_SPOKES = 8;
        const SPOKE_W = 0.05;

        // [axle-x, wheel-start-z] — cylinder spans [wz, wz + WT]
        const positions = [
            [-1.5, -1.0 - WT],  // front-left
            [-1.5,  1.0      ],  // front-right
            [ 1.5, -1.0 - WT],  // rear-left
            [ 1.5,  1.0      ],  // rear-right
        ];

        for (const [wx, wz] of positions) {
            this.scene.pushMatrix();
                this.scene.translate(wx, WR, wz);
                this.scene.scale(WR, WR, zScale);
                this.wheel.display();
            this.scene.popMatrix();

            const spokeCz = wz + WT / 2;
            for (let i = 0; i < NUM_SPOKES; i++) {
                const angle = (i / NUM_SPOKES) * Math.PI * 2;
                this.scene.pushMatrix();
                    this.scene.translate(wx, WR, spokeCz);
                    this.scene.rotate(angle, 0, 0, 1);
                    this.scene.translate(WR / 2, 0, 0);
                    this.scene.scale(WR, SPOKE_W, SPOKE_W);
                    this.cube.display();
                this.scene.popMatrix();
            }
        }
    }

    displayAxles() {
        const WT = 0.1;
        const axleLen = 2.0 * (1.0 + WT);  // 2.2 — spans both wheel faces

        for (const ax of [-1.5, 1.5]) {
            this.scene.pushMatrix();
                this.scene.translate(ax, 0.5, 0);
                this.scene.scale(0.05, 0.05, axleLen);
                this.cube.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(ax, 0.5, 0);
                this.scene.scale(0.1, 0.1, 2.0);
                this.cube.display();
            this.scene.popMatrix();
        }
    }

    displayTongue() {
        // Main bar 
        this.scene.pushMatrix();
            this.scene.translate(-0.7, 0.5, 0);
            this.scene.scale(5.5, 0.1, 0.1);
            this.cube.display();
        this.scene.popMatrix();

        // crossbar at the tip
        this.scene.pushMatrix();
            this.scene.translate(-3, 0.5, 0);
            this.scene.scale(0.1, 0.1, 1.0);
            this.cube.display();
        this.scene.popMatrix();
    }

    displayCanvasCover() {
        this.scene.pushMatrix();
            this.scene.translate(-0.5, 1.0, 0);
            this.scene.scale(2.5, 1.0, 1.0);
            this.scene.rotate(Math.PI / 2, 0, 1, 0);
            this.arch.display();
        this.scene.popMatrix();
    }

    displayBench(){
        // back
        this.scene.pushMatrix();
            this.scene.translate(-0.30, 0.75, 0);
            this.scene.scale(0.1, 0.5, 2.0);
            this.cube.display();
        this.scene.popMatrix();

        // bottom
        this.scene.pushMatrix();
            this.scene.translate(-0.5, 0.6, 0);
            this.scene.scale(0.5, 0.1, 1.9);
            this.cube.display();
        this.scene.popMatrix();
    }

    updateSunDirection() {
        const [sx, sy, sz] = this.scene.getSunDirection();
        const V = this.scene.camera.getViewMatrix();
        const lx = V[0]*sx + V[4]*sy + V[8]*sz;
        const ly = V[1]*sx + V[5]*sy + V[9]*sz;
        const lz = V[2]*sx + V[6]*sy + V[10]*sz;
        const len = Math.sqrt(lx*lx + ly*ly + lz*lz) || 1;
        this.scene.woodShader.setUniformsValues({ uSunDirection: [lx/len, ly/len, lz/len] });
    }

    display() {
        this.updateSunDirection();
        this.scene.woodAppearance.apply();
        this.scene.setActiveShader(this.scene.woodShader);
        this.displayBed();
        this.displayWheels();
        this.displayAxles();
        this.displayTongue();
        this.displayBench();
        
        this.scene.setActiveShader(this.scene.defaultShader);
        this.canvasMat.apply();
        this.displayCanvasCover();
    }
}
