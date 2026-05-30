import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyUnitCube } from './cube.js';
import { MyCylinder } from './cylinder.js';

export class Wagon extends CGFobject {
    constructor(scene) {
        super(scene);

        this.cube  = new MyUnitCube(scene);
        this.wheel = new MyCylinder(scene, 16, 2);
        this.cover  = new MyCylinder(scene, 20, 2, 0.5);

        this.canvasMat = new CGFappearance(scene);
        this.canvasMat.setAmbient(0.90, 0.85, 0.70, 1.0);
        this.canvasMat.setDiffuse(0.90, 0.85, 0.70, 1.0);
        this.canvasMat.setSpecular(0.05, 0.05, 0.04, 1.0);
        this.canvasMat.setShininess(3.0);

        this.posX  = 0;
        this.posZ  = 0;
        this.angle = 0;
        this.scale = 3;
        this.r     = Math.hypot(1.5, 1.1) * this.scale;

        // Motion state
        this.speed      = 0;   // units/s
        this.wheelAngle = 0;   // radians
        this.steerAngle = 0;   // front-wheel steer angle 

        // Physics parameters
        this.maxSpeed    = 8;
        this.accel       = 6;
        this.brakePower  = 20;
        this.drag        = 2;
        this.maxSteer    = Math.PI / 5;  // ~36°
        this.steerSpeed  = 2.0;          // rad/s applied while key held
        this.steerReturn = 3.0;          // rad/s auto-center rate
    }

    update(dt, forward, brake, left, right) {
        // Speed
        if (forward) {
            this.speed = Math.min(this.speed + this.accel * dt, this.maxSpeed);
        } else if (brake) {
            this.speed = Math.max(this.speed - this.brakePower * dt, 0);
        } else {
            this.speed = Math.max(this.speed - this.drag * dt, 0);
        }

        // keys push it toward maxSteer, auto-centers when released
        if (right) {
            this.steerAngle = Math.min(this.steerAngle + this.steerSpeed * dt, this.maxSteer);
        } else if (left) {
            this.steerAngle = Math.max(this.steerAngle - this.steerSpeed * dt, -this.maxSteer);
        } else {
            const ret = this.steerReturn * dt;
            if (Math.abs(this.steerAngle) <= ret) this.steerAngle = 0;
            else this.steerAngle -= Math.sign(this.steerAngle) * ret;
        }

        // distance between front axle (x=-1.5) and rear axle (x=1.5) = 3.0
        this.angle += this.speed * Math.tan(this.steerAngle) / 3.0 * dt;

        this.posX -= Math.sin(this.angle) * this.speed * dt;
        this.posZ += Math.cos(this.angle) * this.speed * dt;

        this.wheelAngle += this.speed * dt / 0.5;
    }

    // Draws one wheel (rim + spokes) centred at (cx, cy, cz)
    drawWheelGroup(cx, cy, cz, WR, WT) {
        const NUM_SPOKES = 8;
        const SPOKE_W = 0.05;

        this.scene.pushMatrix();
            this.scene.translate(cx, cy, cz);
            this.scene.rotate(this.wheelAngle, 0, 0, 1);

            this.scene.pushMatrix();
                this.scene.translate(0, 0, -WT / 2);
                this.scene.scale(WR, WR, WT);
                this.wheel.display();
            this.scene.popMatrix();

            for (let i = 0; i < NUM_SPOKES; i++) {
                const a = (i / NUM_SPOKES) * Math.PI * 2;
                this.scene.pushMatrix();
                    this.scene.rotate(a, 0, 0, 1);
                    this.scene.translate(WR / 2, 0, 0);
                    this.scene.scale(WR, SPOKE_W, SPOKE_W);
                    this.cube.display();
                this.scene.popMatrix();
            }
        this.scene.popMatrix();
    }

    // ── Fixed geometry ──────────────────────────────────────────────────────────

    displayBed() {
        this.scene.pushMatrix();
            this.scene.translate(0.5, 0.5, 0);
            this.scene.scale(2.9, 0.1, 2.0);
            this.cube.display();
        this.scene.popMatrix();

        for (const side of [-1, 1]) {
            this.scene.pushMatrix();
                this.scene.translate(0.75, 0.75, side * 1.0);
                this.scene.scale(2.5, 0.5, 0.1);
                this.cube.display();
            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
            this.scene.translate(2, 0.75, 0);
            this.scene.scale(0.1, 0.5, 2.0);
            this.cube.display();
        this.scene.popMatrix();
    }

    displayRearWheels() {
        const WR = 0.5, WT = 0.2;
        this.drawWheelGroup(1.5, WR, -(1.0 + WT / 2), WR, WT);
        this.drawWheelGroup(1.5, WR,  (1.0 + WT / 2), WR, WT);
    }

    displayRearAxle() {
        const axleLen = 2.2;
        this.scene.pushMatrix();
            this.scene.translate(1.5, 0.5, 0);
            this.scene.scale(0.05, 0.05, axleLen);
            this.cube.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(1.5, 0.5, 0);
            this.scene.scale(0.1, 0.1, 2.0);
            this.cube.display();
        this.scene.popMatrix();
    }

    // connector from front axle back under the wagon body
    displayTongueBase() {
        this.scene.pushMatrix();
            this.scene.translate(0.275, 0.5, 0);
            this.scene.scale(3.55, 0.1, 0.1);
            this.cube.display();
        this.scene.popMatrix();
    }

    displayBench() {
        this.scene.pushMatrix();
            this.scene.translate(-0.30, 0.75, 0);
            this.scene.scale(0.1, 0.5, 2.0);
            this.cube.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(-0.5, 0.6, 0);
            this.scene.scale(0.5, 0.1, 1.9);
            this.cube.display();
        this.scene.popMatrix();
    }

    displayCover() {
        this.scene.pushMatrix();
            this.scene.translate(-0.5, 1.0, 0);
            this.scene.scale(2.5, 1.0, 1.0);
            this.scene.rotate(Math.PI / 2, 0, 1, 0);
            this.cover.display();
        this.scene.popMatrix();
    }

    // ── Steerable front assembly (all coords relative to front axle pivot) ──────

    displayFrontWheels() {
        const WR = 0.5, WT = 0.2;
        this.drawWheelGroup(0, WR, -(1.0 + WT / 2), WR, WT);
        this.drawWheelGroup(0, WR,  (1.0 + WT / 2), WR, WT);
    }

    displayFrontAxle() {
        const axleLen = 2.2;
        this.scene.pushMatrix();
            this.scene.translate(0, 0.5, 0);
            this.scene.scale(0.05, 0.05, axleLen);
            this.cube.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(0, 0.5, 0);
            this.scene.scale(0.1, 0.1, 2.0);
            this.cube.display();
        this.scene.popMatrix();
    }

    displayHorses() {
        if (!this.scene.horse || !this.scene.displayHorse) return;

        this.scene.setActiveShaderSimple(this.scene.defaultShader);
        this.scene.gl.enable(this.scene.gl.NORMALIZE);
        this.scene.gl.disable(this.scene.gl.CULL_FACE);
        this.scene.horseAppearance.apply();

        for (const zOff of [-0.4, 0.4]) {
            this.scene.pushMatrix();
                this.scene.translate(-1.1, 0, zOff);
                this.scene.rotate(-Math.PI / 2, 0, 1, 0);
                this.scene.scale(0.082, 0.082, 0.082);
                this.scene.translate(0, 0, -3.241);
                this.scene.horse.display();
            this.scene.popMatrix();
        }

        this.scene.gl.enable(this.scene.gl.CULL_FACE);
        this.scene.gl.disable(this.scene.gl.NORMALIZE);
        this.scene.setActiveShaderSimple(this.scene.woodShader);
        this.scene.woodAppearance.apply();
    }

    // Forward tongue bar and crossbar, extending from the pivot toward the horse
    displaySteerableTongue() {
        // Bar from pivot (x=0) to horse (x=-1.95 in pivot coords = model x=-3.45)
        this.scene.pushMatrix();
            this.scene.translate(-0.975, 0.5, 0);
            this.scene.scale(1.95, 0.1, 0.1);
            this.cube.display();
        this.scene.popMatrix();

        // Crossbar at the tip
        this.scene.pushMatrix();
            this.scene.translate(-1.5, 0.5, 0);
            this.scene.scale(0.1, 0.1, 1.0);
            this.cube.display();
        this.scene.popMatrix();
    }

    // ────────────────────────────────────────────────────────────────────────────

    updateSunDirection() {
        const [sx, sy, sz] = this.scene.getSunDirection();
        const V = this.scene.camera.getViewMatrix();
        const lx = V[0]*sx + V[4]*sy + V[8]*sz;
        const ly = V[1]*sx + V[5]*sy + V[9]*sz;
        const lz = V[2]*sx + V[6]*sy + V[10]*sz;
        const len = Math.sqrt(lx*lx + ly*ly + lz*lz) || 1;
        const sunDir = [lx/len, ly/len, lz/len];
        this.scene.woodShader.setUniformsValues({ uSunDirection: sunDir });
    }

    display() {
        this.scene.pushMatrix();
            this.scene.translate(this.posX, 0, this.posZ);
            this.scene.rotate(-this.angle, 0, 1, 0);
            this.scene.rotate(Math.PI / 2, 0, 1, 0);

            this.updateSunDirection();
            this.scene.woodAppearance.apply();
            this.scene.setActiveShaderSimple(this.scene.woodShader);

            // Fixed body
            this.displayBed();
            this.displayRearWheels();
            this.displayRearAxle();
            this.displayTongueBase();
            this.displayBench();

            // Front steering assembly — pivots around the front axle kingpin
            this.scene.pushMatrix();
                this.scene.translate(-1.5, 0, 0);
                this.scene.rotate(-this.steerAngle, 0, 1, 0);
                this.displayFrontWheels();
                this.displayFrontAxle();
                this.displaySteerableTongue();
                this.displayHorses();
            this.scene.popMatrix();

            this.scene.setActiveShaderSimple(this.scene.defaultShader);
            this.canvasMat.apply();
            this.displayCover();
        this.scene.popMatrix();
    }

    enableNormalViz(){
        this.cube.enableNormalViz();
        this.cube.enableNormalViz();
        this.cover.enableNormalViz();
    }

    disableNormalViz(){
        this.cube.disableNormalViz();
        this.cube.disableNormalViz();
        this.cover.disableNormalViz();
    }
}
