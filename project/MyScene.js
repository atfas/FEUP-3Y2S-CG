import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { Sphere } from "./objects/sphere.js";
import { MyDisk } from "./objects/disk.js";
import { Plane } from "./objects/plane.js";
import { Wagon } from "./objects/wagon.js";
import { WagonController } from "./controllers/WagonController.js";
import { GameController } from "./controllers/GameController.js";
import { Grass } from "./objects/grass.js";
import { Barn } from "./objects/barn/barn.js";

import { HayBale } from "./objects/hayBale.js";
import { Arrow }   from "./objects/Arrow.js";
import { Flower } from "./objects/Flower.js";
import { Rock } from "./objects/Rock.js";
import { Ring } from "./objects/Ring.js";

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

    this.setUpdatePeriod(1);
    this.enableTextures(true);

    // --- Variables ---
    this.sunElevation          = 40;
    this.sunDegree             = 180;
    this.displayAxis           = false;

    // --- Display flags ---
    this.displaySky            = true;
    this.displaySun            = true;
    this.displayTerrain        = true;
    this.displayGrass          = true;
    this.displayBarn           = true;
    this.displayWagon          = true;
    this.displayHayBales       = true;
    this.displayFlowers        = true;
    this.displayRocks          = true;
    this.displayRings          = true;

    this.displaySkyNormals     = false;
    this.displayTerrainNormals = false;
    this.displaySunNormals     = false;
    this.displayWagonNormals   = false;
    this.displayRockNormals    = false;
    this.windStrength          = 0.5;
    this.rockCount             = 50;
    this.flowerCount           = 100;
    this._baleCount            = 8;
    this._liveCount            = 300;
    this._liveHeightScale      = 0.8;
    this._liveSpread           = 50.0;
    this._bladesPerClump       = 40;
    this._deadCount            = 150;
    this._deadHeightScale      = 0.75;
    this._deadSpread           = 40.0;
    this._barnRingRadius   = 8.0;
    this._barnRingDistance = 12.0;
    this._hayBaleRingRadius = 5.0;

    // --- Textures ---
    this.skyTexture     = new CGFtexture(this, "textures/skyTex.png");
    this.skyMap         = new CGFtexture(this, "textures/skyMap.png");
    this.terrainTexture = new CGFtexture(this, "textures/terrain.jpg");
    this.hillMap        = new CGFtexture(this, "textures/hillMap.png");
    this.pathMask       = new CGFtexture(this, "textures/path1.png");
    this.pathTex        = new CGFtexture(this, "textures/pathTex.jpg");
    this.woodTexture    = new CGFtexture(this, "textures/wood.jpg");
    this.rockTexture    = new CGFtexture(this, "textures/rock.jpg");

    // --- Appearances ---
    this.woodAppearance = new CGFappearance(this);
    this.woodAppearance.setAmbient(0.35, 0.22, 0.10, 1.0);
    this.woodAppearance.setDiffuse(0.55, 0.35, 0.16, 1.0);
    this.woodAppearance.setSpecular(0.08, 0.05, 0.02, 1.0);
    this.woodAppearance.setTexture(this.woodTexture);
    this.woodAppearance.setTextureWrap('REPEAT', 'REPEAT');

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

    this.arrowAppearance = new CGFappearance(this);
    this.arrowAppearance.setEmission(1.0, 0.75, 0.0, 1.0);
    this.arrowAppearance.setAmbient(1.0, 0.75, 0.0, 1.0);
    this.arrowAppearance.setDiffuse(0.0, 0.0, 0.0, 1.0);
    this.arrowAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);

    this.ringBarnActiveAppearance = new CGFappearance(this);
    this.ringBarnActiveAppearance.setAmbient(0.0, 1.0, 0.0, 1.0);
    this.ringBarnActiveAppearance.setDiffuse(0.0, 1.0, 0.0, 1.0);

    this.ringBarnInactiveAppearance = new CGFappearance(this);
    this.ringBarnInactiveAppearance.setAmbient(0.6, 0.6, 0.6, 1.0);
    this.ringBarnInactiveAppearance.setDiffuse(0.6, 0.6, 0.6, 1.0);

    this.ringBaleActiveAppearance = new CGFappearance(this);
    this.ringBaleActiveAppearance.setAmbient(1.0, 1.0, 0.0, 1.0);
    this.ringBaleActiveAppearance.setDiffuse(1.0, 1.0, 0.0, 1.0);

    this.ringBaleInactiveAppearance = new CGFappearance(this);
    this.ringBaleInactiveAppearance.setAmbient(1.0, 0.5, 0.0, 1.0);
    this.ringBaleInactiveAppearance.setDiffuse(1.0, 0.5, 0.0, 1.0);

    // --- Shaders ---
    this.terrainShader = new CGFshader(this.gl, "shaders/terrain.vert", "shaders/terrain.frag");
    this.terrainShader.setUniformsValues({
      uHeightMap:   1,
      uPathMask:    2,
      uPathTex:     3,
      uHeightScale: 0.07
    });

    this.skyShader = new CGFshader(this.gl, "shaders/sky.vert", "shaders/sky.frag");
    this.skyShader.setUniformsValues({ uSampler2: 1, timeFactor: 0, normScale: 1 });

    this.rockShader = new CGFshader(this.gl, "shaders/rock.vert", "shaders/rock.frag");

    this.woodShader = new CGFshader(this.gl, "shaders/wood.vert", "shaders/wood.frag");
    this.woodShader.setUniformsValues({ uSunDirection: this.getSunDirection() });

    this.grassShader = new CGFshader(this.gl, "shaders/grass.vert", "shaders/grass.frag");

    this.arrowShader = new CGFshader(this.gl, "shaders/arrow.vert", "shaders/arrow.frag");
    this.arrowShader.setUniformsValues({ uTimeFactor: 0 });

    // --- Objects ---
    this.axis    = new CGFaxis(this);
    this.sky     = new Sphere(this, 64, 32, 0.5, true);
    this.sun     = new MyDisk(this, 32);
    this.terrain = new Plane(this, 50, 0, 30, 0, 30);

    this.barn     = new Barn(this,0,2,30);
    this.barnRing = new Ring(
      this,
      this.barn.x,
      this.barn.z - this._barnRingDistance,
      this._barnRingRadius,
      this.barn.y
    );

    this.wagon     = new Wagon(this);
    this.arrow     = new Arrow(this);
    this.grass     = new Grass(this, this._liveCount, 42,  this._liveHeightScale, this._liveSpread, this._bladesPerClump);
    this.deadGrass = new Grass(this, this._deadCount, 137, this._deadHeightScale, this._deadSpread, this._bladesPerClump);

    this._regenerate();

    // --- Uniforms ---
    const initialSunDir        = this.getSunDirection();
    this._uSkyTime             = { timeFactor: 0 };
    this._uGrassWind           = { uTime: 0, uWindStrength: this.windStrength };
    this._uTerrainLighting     = { uSunDir: initialSunDir };
    this._uGrassLive           = { uSunDir: initialSunDir, uDeadGrass: 0.0 };
    this._uGrassDead           = { uSunDir: initialSunDir, uDeadGrass: 1.0 };
    this._uRock                = { uSampler: 0, uSunDir: initialSunDir };
    this._uArrow               = { uTimeFactor: 0 };

    // --- Controllers ---
    this.wagonController = new WagonController(this.wagon, this.freeCamera, this.wagonCamera);
    this.gameController  = new GameController(this, 100, 2, 15, 18);
  }
  _regenerate() {
    this._placedObjects = [
      { x: this.barn.x,    z: this.barn.z,    r: this.barn.r },
      { x: this.wagon.posX * 3, z: this.wagon.posZ * 3, r: this.wagon.r },
    ];
    this.rocks    = this._spawnRandom(this.rockCount,   (x, z) => new Rock(this, x, z));
    this.flowers  = this._spawnRandom(this.flowerCount, (x, z) => new Flower(this, x, z));
    this.hayBales = this._spawnRandom(this._baleCount,  (x, z) => {
      const b = new HayBale(this, x, z);
      b.ring = new Ring(this, x, z, this._hayBaleRingRadius, b.y);
      return b;
    });
    this.balesList = this.hayBales;
  }

  tryPickUpBale()   { this.gameController.tryPickUpBale(); }
  tryDropOffBales() { this.gameController.tryDropOffBales(); }

  respawnBales(count) {
    const newBales = this._spawnRandom(count, (x, z) => {
      const b = new HayBale(this, x, z);
      b.ring = new Ring(this, x, z, this._hayBaleRingRadius, b.y);
      return b;
    });
    this.hayBales.push(...newBales);
  }

  get hp()                  { return this.gameController.hp; }
  get score()               { return this.gameController.score; }
  get gameOver()            { return this.gameController.gameOver; }
  get instantDamage()       { return this.gameController.instantDamage; }
  get instantHeal()         { return this.gameController.instantHeal; }
  get collectedBalesCount() { return this.gameController.collectedBalesCount; }
  get maxCollectedBales()   { return this.gameController.maxCollectedBales; }

  _spawnRandom(count, createFn) {
    const result = [];
    let attempts = 0;
    
    // 120 keeps objects perfectly distributed across the flat valley 
    // right up until the mountains start climbing around 130!
    const MAX_RADIUS = 170; 

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
    if (!this.displayRocks) return;
    this.setActiveShaderSimple(this.rockShader);
    this.rockTexture.bind(0);
    this._uRock.uSunDir = this.getSunDirection();
    this.rockShader.setUniformsValues(this._uRock);
    for (const rock of this.rocks) {
      this.pushMatrix();
        this.translate(rock.x, 0.25, rock.z); // Fixed: Sitting cleanly at requested height y = 0.25
        rock.display();
      this.popMatrix();
    }
  }

  drawFlora() {
    if (!this.displayFlowers) return;
    this.setActiveShaderSimple(this.defaultShader);
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
  set baleCount(v) { this._baleCount = v; }

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

    this.gameController.update(t);
    if (this.gameController.gameOver) return;

    const [sx, sy, sz] = this.getSunDirection();
    this.lights[1].setPosition(sx, sy, sz, 0);
    this.lights[1].update();
    this._uSkyTime.timeFactor = t / 8000 % 100;
    this._uGrassWind.uTime = (t / 1000) % 1000;
    this._uGrassWind.uWindStrength = this.windStrength;
    this._uArrow.uTimeFactor = (t / 1000) % 100;

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
    if (!this.displaySky) return;
    this.setActiveShaderSimple(this.skyShader);
    this.skyShader.setUniformsValues(this._uSkyTime);
    this.pushMatrix();
      this.skyAppearance.apply();
      this.translate(0, -10, 0);
      this.scale(200, 200, 200);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.sky.display();
    this.popMatrix();
  }
  
  drawSun() {
    if (!this.displaySun) return;
    const [sx, sy, sz] = this.getSunDirection();
    const elev = this.sunElevation * Math.PI / 180;
    const deg  = this.sunDegree   * Math.PI / 180;

    this.setActiveShaderSimple(this.defaultShader);
    this.sunAppearance.apply();
    this.pushMatrix();
      this.translate(sx * 190, sy * 190, sz * 190);
      this.rotate(Math.PI + deg, 0, 1, 0);
      this.rotate(elev, 1, 0, 0);
      this.scale(8, 8, 8);
      this.sun.display();
    this.popMatrix();
  }

  drawTerrain() {
    if (!this.displayTerrain) return;
    this.lights[0].disable();
    this.lights[1].disable();

    const sunDir = this.getSunDirection();

    this.setActiveShaderSimple(this.terrainShader);
    this.terrainAppearance.apply();
    this.hillMap.bind(1);
    this.pathMask.bind(2);
    this.pathTex.bind(3);

    this._uTerrainLighting.uSunDir = sunDir;
    this.terrainShader.setUniformsValues(this._uTerrainLighting );

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

    this.setActiveShaderSimple(this.defaultShader);
  }

  drawGrass() {
    if (!this.displayGrass || !this.grass) return;
    const sunDir = this.getSunDirection();
    this.gl.disable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.setActiveShaderSimple(this.grassShader);
    this.grassShader.setUniformsValues(this._uGrassWind);

    // Living green grass
    this._uGrassLive.uSunDir = sunDir;
    this.grassShader.setUniformsValues(this._uGrassLive);
    this.pushMatrix();
      this.translate(0, -10, 0);
      this.scale(400, 400, 400);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.grass.display();
    this.popMatrix();

    if (this.deadGrass) {
      this._uGrassDead.uSunDir = sunDir;
      this.grassShader.setUniformsValues(this._uGrassDead);
      this.pushMatrix();
        this.translate(0, -10, 0);
        this.scale(400, 400, 400);
        this.rotate(-Math.PI / 2, 1, 0, 0);
        this.deadGrass.display();
      this.popMatrix();
    }
    this.gl.disable(this.gl.BLEND);
    this.gl.enable(this.gl.CULL_FACE);

    this.setActiveShaderSimple(this.defaultShader);
  }

  drawBarn() {
    if (!this.displayBarn || !this.barn) return;

    this.setActiveShaderSimple(this.defaultShader);
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
    if (!this.displayWagon) return;
    const scale = this.wagon.scale || 1;
    this.pushMatrix();
      this.scale(scale, scale, scale);
      this.wagon.display();
    this.popMatrix();
  }

  drawInteractionRings() {
    if (!this.displayRings) return;
    this.setActiveShader(this.defaultShader);
    const wx = this.wagon.posX * 3;
    const wz = this.wagon.posZ * 3;

    // 1. Barn drop-off zone
    (this.gameController.isInsideRing
      ? this.ringBarnActiveAppearance
      : this.ringBarnInactiveAppearance
    ).apply();
    this.barnRing.display(this);

    // 2. Pickup indicators beneath hay bales
    for (const bale of this.hayBales) {
      (bale.ring.contains(wx, wz)
        ? this.ringBaleActiveAppearance
        : this.ringBaleInactiveAppearance
      ).apply();
      bale.ring.display(this);
    }
  }

  drawHayBales() {
    if (!this.displayHayBales || !this.hayBales) return;
    this.setActiveShaderSimple(this.defaultShader);
    for (const bale of this.hayBales) {
      this.pushMatrix();
        this.translate(bale.x, 0.8, bale.z);
        this.rotate(bale.yRot, 0, 1, 0);
        bale.display();
      this.popMatrix();
    }
  }

  drawArrows() {
    if (!this.hayBales || !this.arrow) return;
    this.gl.disable(this.gl.CULL_FACE);
    this.setActiveShaderSimple(this.arrowShader);
    this.arrowShader.setUniformsValues(this._uArrow);

    this.arrowAppearance.apply();

    for (const bale of this.hayBales) {
      this.pushMatrix();
        this.translate(bale.x, 5.5, bale.z);
        this.scale(7,7,7);
        this.arrow.display();
      this.popMatrix();
    }
    this.gl.enable(this.gl.CULL_FACE);
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
    this.drawArrows();
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