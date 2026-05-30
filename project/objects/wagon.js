import { CGFobject } from '../../lib/CGF.js';
import { MyUnitCube } from './cube.js';
import { MyCylinder } from './cylinder.js';
import { HayBale } from './hayBale.js';

export class Wagon extends CGFobject {
    constructor(scene,x,z,angle,scale) {
        super(scene);

        this.cube  = new MyUnitCube(scene);
        this.wheel = new MyCylinder(scene, 16, 2);
        this.cover  = new MyCylinder(scene, 20, 2, 0.5);
        this.hayBale = new HayBale(scene, 0, 0, 0.45, 1.8);

        this.x  = x;
        this.z  = z;
        this.angle =angle;
        this.scale = scale;
        this.boundingRadiusFactor = 6;
        this.wheelbase            = 3.0;
        this.wheelRadius          = 0.5;
        this.wheelThickness       = 0.2;
        this.numSpokes            = 8;
        this.spokeWidth           = 0.05;
        this.axleLength           = 2.2;
        this.r = this.boundingRadiusFactor * this.scale;

        this.carriedHayBales = 0;

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

        this.angle += this.speed * Math.tan(this.steerAngle) / this.wheelbase * dt;

        this.x -= Math.sin(this.angle) * this.speed * this.scale * dt;
        this.z += Math.cos(this.angle) * this.speed * this.scale * dt;

        this.wheelAngle += this.speed * dt / this.wheelRadius;
    }

    // Draws one wheel (rim + spokes) centred at (cx, cy, cz)
    drawWheelGroup(cx, cy, cz, WR, WT) {
        this.scene.pushMatrix();
            this.scene.translate(cx, cy, cz);
            this.scene.rotate(this.wheelAngle, 0, 0, 1);

            this.scene.pushMatrix();
                this.scene.translate(0, 0, -WT / 2);
                this.scene.scale(WR, WR, WT);
                this.wheel.display();
            this.scene.popMatrix();

            for (let i = 0; i < this.numSpokes; i++) {
                const a = (i / this.numSpokes) * Math.PI * 2;
                this.scene.pushMatrix();
                    this.scene.rotate(a, 0, 0, 1);
                    this.scene.translate(WR / 2, 0, 0);
                    this.scene.scale(WR, this.spokeWidth, this.spokeWidth);
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
        const WR = this.wheelRadius, WT = this.wheelThickness;
        this.drawWheelGroup(1.5, WR, -(1.0 + WT / 2), WR, WT);
        this.drawWheelGroup(1.5, WR,  (1.0 + WT / 2), WR, WT);
    }

    displayRearAxle() {
        this.scene.pushMatrix();
            this.scene.translate(1.5, 0.5, 0);
            this.scene.scale(0.05, 0.05, this.axleLength);
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
        const WR = this.wheelRadius, WT = this.wheelThickness;
        this.drawWheelGroup(0, WR, -(1.0 + WT / 2), WR, WT);
        this.drawWheelGroup(0, WR,  (1.0 + WT / 2), WR, WT);
    }

    displayFrontAxle() {
        this.scene.pushMatrix();
            this.scene.translate(0, 0.5, 0);
            this.scene.scale(0.05, 0.05, this.axleLength);
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

    displayHayBales() {
        if (this.carriedHayBales <= 0) return;
        const toShow = this.carriedHayBales >= 2 ? 2 : 1;
        this.scene.setActiveShaderSimple(this.scene.defaultShader);
        const zPositions = toShow === 2 ? [-0.45, 0.45] : [0];
        for (const z of zPositions) {
            this.scene.pushMatrix();
                this.scene.translate(0.9, 0.55, z);
                this.hayBale.display();
            this.scene.popMatrix();
        }
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
            this.scene.translate(this.x, 0, this.z);
            this.scene.scale(this.scale, this.scale, this.scale);
            this.scene.rotate(-this.angle, 0, 1, 0);
            this.scene.rotate(Math.PI / 2, 0, 1, 0);
            this.scene.translate(0.75, 0, 0); // shift geometry so origin sits at wagon centre

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
            this.displayHayBales();
            this.scene.canvasAppearance.apply();
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
