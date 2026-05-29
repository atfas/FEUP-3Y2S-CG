import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { Sphere } from "./objects/sphere.js";
import { Plane } from "./objects/plane.js";
import { Wagon } from "./objects/wagon.js";
import { WagonController } from "./controllers/WagonController.js";
import { Grass } from "./objects/grass.js";
import { Barn } from "./objects/barn/barn.js";
import { HayBales } from "./objects/hayBales.js";
import { Flower } from "./objects/Flower.js";
import { Rock } from "./objects/Rock.js";

export class MyScene extends CGFscene {
  constructor() {
    super();
  }

  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    this.gl.clearColor(0.53, 0.81, 0.98, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.setUpdatePeriod(50);
    this.enableTextures(true);

    this.axis = new CGFaxis(this);

    this.sky     = new Sphere(this, 64, 32, 0.5, true);
    this.sun     = new Sphere(this, 16, 8,  1.0, false);
    this.terrain = new Plane(this, 50, 0, 30, 0, 30);
    this.rockCount   = 50;
    this.flowerCount = 100;

    // --- Barn Setup ---
    this.barn = new Barn(this);
    this.barn.x = 0;
    this.barn.z = 30;
    this.barn.r = 8; 
    
    // Barn proximity ring properties
    this.barnRingX = this.barn.x;
    this.barnRingZ = this.barn.z - 12; 
    this.barnRingRadius = 8.0;
    this.isInsideRing = false;

    // --- HayBales Setup ---
    this._baleCount = 8;
    this.hayBales   = new HayBales(this, this._baleCount, 77);

    // ==================== GAME MECHANICS STATE ====================
    this.hp = 100;
    this.instantDamage = 0;
    this.instantHeal = 0;
    this.balesDropped = 0;
    this.score = 0; 
    this.gameOver = false;
    
    this.collectedBalesCount = 0; 
    this.lastSecondTime = 0;
    this.cooldowns = {}; 
    // ==============================================================

    // Textures
    this.skyTexture     = new CGFtexture(this, "textures/skyTex.png");
    this.skyMap         = new CGFtexture(this, "textures/skyMap.png");
    this.terrainTexture = new CGFtexture(this, "textures/terrain.jpg");
    this.hillMap        = new CGFtexture(this, "textures/hillMap.png");
    this.pathMask       = new CGFtexture(this, "textures/path1.png");
    this.pathTex        = new CGFtexture(this, "textures/pathTex.jpg");
    this.woodTexture    = new CGFtexture(this, "textures/wood.jpg");
    this.rockTexture    = new CGFtexture(this, "textures/rock.jpg");

    this.woodAppearance = new CGFappearance(this);
    this.woodAppearance.setAmbient(0.35, 0.22, 0.10, 1.0);
    this.woodAppearance.setDiffuse(0.55, 0.35, 0.16, 1.0);
    this.woodAppearance.setSpecular(0.08, 0.05, 0.02, 1.0);
    this.woodAppearance.setTexture(this.woodTexture);
    this.woodAppearance.setTextureWrap('REPEAT', 'REPEAT');

    this.wagon = new Wagon(this);
    this.wagon.posX = 0;
    this.wagon.posZ = 0;
    this.wagon.r = 2.5; 

    this.wagonController = new WagonController(this.wagon, this.freeCamera, this.wagonCamera);

    this._regenerate();

    // Appearances Setup
    this.skyAppearance = new CGFappearance(this);
    this.skyAppearance.setEmission(1, 1, 1, 1);
    this.skyAppearance.setAmbient(0.0, 0.0, 0.0, 1.0);
    this.skyAppearance.setDiffuse(0.0, 0.0, 0.0, 1.0);
    this.skyAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.skyAppearance.setTexture(this.skyTexture);
    this.skyAppearance.setTextureWrap('REPEAT', 'REPEAT');

    this.sunAppearance = new CGFappearance(this);
    this.sunAppearance.setEmission(1.0, 0.95, 0.5, 1.0);
    this.sunAppearance.setAmbient(1.0, 0.95, 0.5, 1.0);
    this.sunAppearance.setDiffuse(0.0, 0.0, 0.0, 1.0);
    this.sunAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);

    this.terrainAppearance = new CGFappearance(this);
    this.terrainAppearance.setAmbient(0.3, 0.3, 0.3, 1.0);
    this.terrainAppearance.setDiffuse(0.8, 0.8, 0.8, 1.0);
    this.terrainAppearance.setSpecular(0.05, 0.05, 0.05, 1.0);
    this.terrainAppearance.setShininess(5.0);
    this.terrainAppearance.setTexture(this.terrainTexture);
    this.terrainAppearance.setTextureWrap('REPEAT', 'REPEAT');

    this.terrainShader = new CGFshader(this.gl, "shaders/terrain.vert", "shaders/terrain.frag");
    this.terrainShader.setUniformsValues({
      uHeightMap:   1,
      uPathMask:    2,
      uPathTex:     3,
      uHeightScale: 0.07
    });

    this.skyShader = new CGFshader(this.gl, "shaders/sky.vert", "shaders/sky.frag");
    this.skyShader.setUniformsValues({ uSampler2: 1, timeFactor: 0, normScale: 1 });
    
    this.rockShader = new CGFshader(this.gl, "shaders/rock.vert","shaders/rock.frag");

    this.woodShader = new CGFshader(this.gl, "shaders/wood.vert", "shaders/wood.frag");
    this.woodShader.setUniformsValues({ uSunDirection: this.getSunDirection() });

    this.grassShader = new CGFshader(this.gl, "shaders/grass.vert", "shaders/grass.frag");

    this._liveCount       = 300;
    this._liveHeightScale = 0.8;
    this._liveSpread      = 50.0;
    this._bladesPerClump  = 40;

    this._deadCount       = 150;
    this._deadHeightScale = 0.75;
    this._deadSpread      = 40.0;

    this.grass     = new Grass(this, this._liveCount, 42,  this._liveHeightScale, this._liveSpread, this._bladesPerClump);
    this.deadGrass = new Grass(this, this._deadCount, 137, this._deadHeightScale, this._deadSpread, this._bladesPerClump);

    this.sunElevation          = 40;
    this.sunDegree             = 180;
    this.displayAxis           = false;
    this.displaySkyNormals     = false;
    this.displayTerrainNormals = false;
    this.displaySunNormals     = false;
    this.displayWagonNormals   = false;
    this.displayRockNormals    = false;
    this.windStrength          = 0.5;
  }
  
  _regenerate() {
    this._placedObjects = [
      { x: this.barn.x,    z: this.barn.z,    r: this.barn.r },
      { x: this.wagon.posX * 3, z: this.wagon.posZ * 3, r: this.wagon.r },
    ];
    this.rocks   = this._spawnRandom(this.rockCount,   (x, z) => {
      let r = new Rock(this, x, z);
      r.r = 1.8; 
      return r;
    });
    this.flowers = this._spawnRandom(this.flowerCount, (x, z) => new Flower(this, x, z));

    this.syncHayBalesState();
  }

  syncHayBalesState() {
    if (!this.hayBales || !this.hayBales._positions) {
      this.balesList = [];
      return;
    }
    // Fixed: Maps from the real '_positions' array generated deterministically inside HayBales
    this.balesList = this.hayBales._positions.map(pos => ({
      x: pos.x,
      z: pos.z,
      r: 2.0,
      active: pos.active !== undefined ? pos.active : true
    }));
  }

  tryPickUpBale() {
    const currentWagonX = this.wagon.posX * 3;
    const currentWagonZ = this.wagon.posZ * 3;

    for (let i = 0; i < this.balesList.length; i++) {
      let bale = this.balesList[i];
      if (bale.active) {
        let dist = Math.hypot(currentWagonX - bale.x, currentWagonZ - bale.z);
        if (dist < 5.0) { 
          bale.active = false;
          // Set active to false directly in the rendering class so it disappears instantly!
          if (this.hayBales._positions[i]) {
            this.hayBales._positions[i].active = false;
          }
          this.collectedBalesCount++;
          break;
        }
      }
    }
  }

  tryDropOffBales() {
    if (this.isInsideRing && this.collectedBalesCount > 0) {
      let restoredAmount = this.collectedBalesCount * 18;
      this.hp = Math.min(100, this.hp + restoredAmount);
      this.instantHeal = restoredAmount;
      this.balesDropped += this.collectedBalesCount;
      this.collectedBalesCount = 0;

      setTimeout(() => { this.instantHeal = 0; }, 1500);
    }
  }

  _spawnRandom(count, createFn) {
    const result = [];
    let attempts = 0;
    
    // 120 keeps objects perfectly distributed across the flat valley 
    // right up until the mountains start climbing around 130!
    const MAX_RADIUS = 140; 

    while (result.length < count && attempts < count * 10) {
      attempts++;
      const a = Math.random() * 2 * Math.PI;
      
      // Scale up the uniform distance distribution to our new maximum boundary
      const r = Math.sqrt(Math.random()) * MAX_RADIUS; 
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;

      const obj = createFn(x, z);
      if (this._placedObjects.some(o => Math.hypot(x - o.x, z - o.z) < o.r + obj.r)) continue;
      this._placedObjects.push({ x, z, r: obj.r });
      result.push(obj);
    }
    return result;
  }


  drawRocks() {
    this.setActiveShader(this.rockShader);
    this.rockTexture.bind(0);
    this.rockShader.setUniformsValues({ uSampler: 0, uSunDir: this.getSunDirection() });
    for (const rock of this.rocks) {
      this.pushMatrix();
        this.translate(rock.x, 0.25, rock.z); // Fixed: Sitting cleanly at requested height y = 0.25
        rock.display();
      this.popMatrix();
    }
  }

  drawFlora() {
    this.setActiveShader(this.defaultShader);
    for (const f of this.flowers) {
      this.pushMatrix();
        this.translate(f.x, 0.25, f.z); // Fixed: Sitting cleanly at requested height y = 0.25
        this.scale(f.scale, f.scale, f.scale);
        this.rotate(f.rotY, 0, 1, 0);
        f.display();
      this.popMatrix();
    }
  }

  get liveCount()            { return this._liveCount; }
  set liveCount(v)           { this._liveCount = v;        if (this.grass)     { this.grass.count = v;            this.grass.rebuild(); } }
  get liveHeightScale()      { return this._liveHeightScale; }
  set liveHeightScale(v)     { this._liveHeightScale = v;   if (this.grass)     { this.grass.heightScale = v;      this.grass.rebuild(); } }
  get liveSpread()           { return this._liveSpread; }
  set liveSpread(v)          { this._liveSpread = v;        if (this.grass)     { this.grass.clumpSpread = v;      this.grass.rebuild(); } }
  get deadCount()            { return this._deadCount; }
  set deadCount(v)           { this._deadCount = v;         if (this.deadGrass) { this.deadGrass.count = v;        this.deadGrass.rebuild(); } }
  get deadHeightScale()      { return this._deadHeightScale; }
  set deadHeightScale(v)     { this._deadHeightScale = v;   if (this.deadGrass) { this.deadGrass.heightScale = v;  this.deadGrass.rebuild(); } }
  get deadSpread()           { return this._deadSpread; }
  set deadSpread(v)          { this._deadSpread = v;        if (this.deadGrass) { this.deadGrass.clumpSpread = v;  this.deadGrass.rebuild(); } }
  get bladesPerClump()       { return this._bladesPerClump; }
  set bladesPerClump(v)      { this._bladesPerClump = v;
    if (this.grass)     { this.grass.bladesPerClump = v;     this.grass.rebuild(); }
    if (this.deadGrass) { this.deadGrass.bladesPerClump = v; this.deadGrass.rebuild(); }
  }
  
  get baleCount() { return this._baleCount; }
  set baleCount(v) { 
    this._baleCount = v; 
    if (this.hayBales) { 
      this.hayBales.count = v; 
      this.hayBales.rebuild(); 
    } 
    this.syncHayBalesState(); 
  }

  initLights() {
    this.lights[0].setPosition(0, 10, 0, 1);
    this.lights[0].setAmbient(0.3, 0.3, 0.35, 1.0);
    this.lights[0].setDiffuse(0.4, 0.4, 0.5,  1.0);
    this.lights[0].setSpecular(0.0, 0.0, 0.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();

    this.lights[1].setPosition(0.6, 0.8, 0.0, 0);
    this.lights[1].setAmbient(0.0, 0.0, 0.0,  1.0);
    this.lights[1].setDiffuse(1.0, 0.95, 0.8, 1.0);
    this.lights[1].setSpecular(1.0, 0.95, 0.8, 1.0);
    this.lights[1].enable();
    this.lights[1].update();
  }

  initCameras() {
    this.freeCamera = new CGFcamera(1.2, 0.1, 500, vec3.fromValues(0, 8, -20), vec3.fromValues(0, 1.5, 0));
    this.wagonCamera = new CGFcamera(1.2, 0.1, 500, vec3.fromValues(0, 4, -10), vec3.fromValues(0, 1.5, 0));
    this.camera = this.wagonCamera;
  }

  getSunDirection() {
    const elev = this.sunElevation * Math.PI / 180;
    const deg  = this.sunDegree   * Math.PI / 180;
    return [Math.cos(elev) * Math.sin(deg), Math.sin(elev), Math.cos(elev) * Math.cos(deg)];
  }

  update(t) {
    if (this.lastTime === undefined) this.lastTime = t;
    const dt = Math.min((t - this.lastTime) / 1000, 0.1);
    this.lastTime = t;

    if (this.gameOver) return;

    if (t - this.lastSecondTime >= 1000) {
      this.hp = Math.max(0, this.hp - 1);
      this.score++;
      this.lastSecondTime = t;
      
      if (this.hp <= 0) {
        this.gameOver = true;
        alert("Game Over! Out of health. Final Score: " + this.score);
      }
    }

    const currentWagonX = this.wagon.posX * 3;
    const currentWagonZ = this.wagon.posZ * 3;

    let distToRing = Math.hypot(currentWagonX - this.barnRingX, currentWagonZ - this.barnRingZ);
    this.isInsideRing = (distToRing <= this.barnRingRadius);

    for (let rock of this.rocks) {
      let distToRock = Math.hypot(currentWagonX - rock.x, currentWagonZ - rock.z);
      if (distToRock < 3.2) { 
        let now = Date.now();
        if (!this.cooldowns[rock.x + "_" + rock.z] || now - this.cooldowns[rock.x + "_" + rock.z] > 1500) {
          this.hp = Math.max(0, this.hp - 15);
          this.instantDamage = 15;
          this.cooldowns[rock.x + "_" + rock.z] = now;
          
          setTimeout(() => { this.instantDamage = 0; }, 1500);

          if (this.hp <= 0) {
            this.gameOver = true;
            alert("Game Over! Crashed into Rock. Final Score: " + this.score);
          }
        }
      }
    }

    const [sx, sy, sz] = this.getSunDirection();
    this.lights[1].setPosition(sx, sy, sz, 0);
    this.lights[1].update();
    this.skyShader.setUniformsValues({ timeFactor: t / 8000 % 100 });
    this.grassShader.setUniformsValues({ uTime: (t / 1000) % 1000, uWindStrength: this.windStrength });

    this.wagonController.update(dt, this);
    this.camera = this.wagonController.activeCamera;
  }

  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  }

  drawSky() {
    this.setActiveShader(this.skyShader);
    this.pushMatrix();
      this.skyAppearance.apply();
      this.translate(0, -10, 0);
      this.scale(200, 200, 200);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.sky.display();
    this.popMatrix();
  }
  
  drawSun() {
    const [sx, sy, sz] = this.getSunDirection();
    const cx = this.camera.position[0];
    const cz = this.camera.position[2];
    this.setActiveShader(this.defaultShader);
    this.sunAppearance.apply();
    this.pushMatrix();
      this.translate(cx + sx * 190, sy * 190, cz + sz * 190);
      this.scale(8, 8, 8);
      this.sun.display();
    this.popMatrix();
  }

  drawTerrain() {
    this.lights[0].disable();
    this.lights[1].disable();
    this.setActiveShader(this.terrainShader);
    this.terrainAppearance.apply();
    this.hillMap.bind(1);
    this.pathMask.bind(2);
    this.pathTex.bind(3);
    this.terrainShader.setUniformsValues({ uHeightMap: 1, uPathMask: 2, uPathTex: 3, uSunDir: this.getSunDirection() });
    this.pushMatrix();
      this.translate(0, -10, 0);
      this.scale(400, 400, 400);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.terrain.display();
    this.popMatrix();
    this.lights[0].enable();
    this.lights[1].enable();
    this.lights[0].update();
    this.lights[1].update();
    this.setActiveShader(this.defaultShader);
  }

  drawGrass() {
    if (!this.grass) return;
    const sunDir = this.getSunDirection();
    this.gl.disable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.setActiveShader(this.grassShader);

    this.grassShader.setUniformsValues({ uSunDir: sunDir, uDeadGrass: 0.0 });
    this.pushMatrix();
      this.translate(0, -10, 0);
      this.scale(400, 400, 400);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.grass.display();
    this.popMatrix();

    if (this.deadGrass) {
      this.grassShader.setUniformsValues({ uSunDir: sunDir, uDeadGrass: 1.0 });
      this.pushMatrix();
        this.translate(0, -10, 0);
        this.scale(400, 400, 400);
        this.rotate(-Math.PI / 2, 1, 0, 0);
        this.deadGrass.display();
      this.popMatrix();
    }
    this.gl.disable(this.gl.BLEND);
    this.gl.enable(this.gl.CULL_FACE);
    this.setActiveShader(this.defaultShader);
  }

  drawBarn() {
    if (!this.barn) return;
    this.setActiveShader(this.defaultShader);
    this.gl.enable(this.gl.NORMALIZE);
    const { x, y, z, scale } = this.barn;
    this.pushMatrix();
      this.translate(x, y, z);
      this.scale(scale, scale, scale);
      this.barn.display();
    this.popMatrix();
    this.gl.disable(this.gl.NORMALIZE);
  }

  drawWagon(){
    const scale = this.wagon.scale || 1;
    this.pushMatrix();
      this.scale(scale, scale, scale);
      this.wagon.display();
    this.popMatrix();
  }

  // Visualizes interaction rings perfectly on the ground plane at y = 0.26
  drawInteractionRings() {
    this.setActiveShader(this.defaultShader);
    const ringAppearance = new CGFappearance(this);
    const currentWagonX = this.wagon.posX * 3;
    const currentWagonZ = this.wagon.posZ * 3;

    // 1. Barn Drop-Off Indicator Zone
    this.pushMatrix();
      this.translate(this.barnRingX, 2, this.barnRingZ); // Placed slightly above ground floor to avoid flickering
      this.scale(this.barnRingRadius, 0.01, this.barnRingRadius); 
      
      if (this.isInsideRing) {
          ringAppearance.setAmbient(0.0, 1.0, 0.0, 1.0); 
          ringAppearance.setDiffuse(0.0, 1.0, 0.0, 1.0);
      } else {
          ringAppearance.setAmbient(0.6, 0.6, 0.6, 1.0); 
          ringAppearance.setDiffuse(0.6, 0.6, 0.6, 1.0);
      }
      ringAppearance.apply();
      this.sun.display(); 
    this.popMatrix();

    // 2. Pickup indicators beneath active field haybales
    if (this.balesList) {
      for (let bale of this.balesList) {
        if (bale.active) {
          this.pushMatrix();
            this.translate(bale.x, 0.26, bale.z);
            this.scale(5.0, 0.01, 5.0); 
            
            let dist = Math.hypot(currentWagonX - bale.x, currentWagonZ - bale.z);
            if (dist < 5.0) {
                ringAppearance.setAmbient(1.0, 1.0, 0.0, 1.0); 
                ringAppearance.setDiffuse(1.0, 1.0, 0.0, 1.0);
            } else {
                ringAppearance.setAmbient(1.0, 0.5, 0.0, 1.0); 
                ringAppearance.setDiffuse(1.0, 0.5, 0.0, 1.0);
            }
            ringAppearance.apply();
            this.sun.display();
          this.popMatrix();
        }
      }
    }
  }

  drawHayBales() {
     if (!this.hayBales) return;
     this.setActiveShader(this.defaultShader);
     this.hayBales.display();
  }

  display() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.updateProjectionMatrix();
    this.loadIdentity();
    this.applyViewMatrix();

    if (this.displayAxis) this.axis.display();

    this.drawSky();
    this.drawTerrain();
    this.drawGrass();
    this.drawSun();
    
    this.drawInteractionRings(); 
    this.drawBarn();
    this.drawWagon();
    this.drawHayBales();        
    this.drawFlora();           
    this.drawRocks();           
    
    for (const [obj, show] of [
      [this.sky,     this.displaySkyNormals],
      [this.terrain, this.displayTerrainNormals],
      [this.sun,     this.displaySunNormals],
      [this.wagon,   this.displayWagonNormals],
    ]) {
      if(obj) show ? obj.enableNormalViz() : obj.disableNormalViz();
    }
    for (const rock of this.rocks)
      if(rock) this.displayRockNormals ? rock.enableNormalViz() : rock.disableNormalViz();
  }
}