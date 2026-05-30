import { CGFscene, CGFcamera } from "../lib/CGF.js";
import { SceneConfig } from "./SceneConfig.js";
import { TextureLoader }    from "./loaders/TextureLoader.js";
import { AppearanceLoader } from "./loaders/AppearanceLoader.js";
import { ShaderLoader }     from "./loaders/ShaderLoader.js";
import { ObjectLoader }     from "./loaders/ObjectLoader.js";
import { UniformLoader }    from "./loaders/UniformLoader.js";
import { WagonController } from "./controllers/WagonController.js";
import { GameController }  from "./controllers/GameController.js";
import { HayBale } from "./objects/hayBale.js";
import { Flower }  from "./objects/Flower.js";
import { Rock }    from "./objects/Rock.js";
import { Ring }    from "./objects/Ring.js";

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

    // --- Config ---
    Object.assign(this, SceneConfig);

    // --- Loaders ---
    new TextureLoader(this);
    new AppearanceLoader(this);
    new ShaderLoader(this);
    new ObjectLoader(this);
    new UniformLoader(this);

    this._regenerate();

    // --- Controllers ---
    this.wagonController = new WagonController(this.wagon, this.freeCamera, this.wagonCamera);
    this.gameController  = new GameController(this, 100, 2, 5,15, 18);
  }
  _regenerate() {
    this._placedObjects = [
      { x: this.barn.x,    z: this.barn.z,    r: this.barn.r },
      { x: this.wagon.x, z: this.wagon.z, r: this.wagon.r },
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
    
    while (result.length < count && attempts < count * 10) {
      attempts++;
      const a = Math.random() * 2 * Math.PI;
      const r = Math.sqrt(Math.random()) * this._spawnRadius;
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
    this._uRock.uSunDirection = this.getSunDirection();
    this.rockShader.setUniformsValues(this._uRock);
    for (const rock of this.rocks) {
      if (Math.hypot(rock.x - this.wagon.x, rock.z - this.wagon.z) > this.renderRange) continue;
      this.pushMatrix();
        this.translate(rock.x, this._rockGroundY, rock.z);
        rock.display();
      this.popMatrix();
    }
  }

  drawFlora() {
    if (!this.displayFlowers) return;
    this.setActiveShaderSimple(this.defaultShader);
    for (const f of this.flowers) {
      if (Math.hypot(f.x - this.wagon.x, f.z - this.wagon.z) > this.renderRange) continue;
      this.pushMatrix();
        this.translate(f.x, this._flowerGroundY, f.z);
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
    const dt = Math.min((t - this.lastTime) / 1000, this._maxDeltaTime);
    this.lastTime = t;

    this.gameController.update(t);
    if (this.gameController.gameOver) return;

    const [sx, sy, sz] = this.getSunDirection();
    this.lights[1].setPosition(sx, sy, sz, 0);
    this.lights[1].update();
    this._uSkyTime.uTimeFactor = t / this._skyAnimPeriod % this._skyAnimWrap;
    this._uGrassWind.uTime = (t / 1000) % this._grassAnimWrap;
    this._uGrassWind.uWindStrength = this.windStrength;
    this._uArrow.uTimeFactor = (t / 1000) % this._arrowAnimWrap;

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
      this.translate(0, this._groundLevel, 0);
      this.scale(this._skyScale, this._skyScale, this._skyScale);
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
      this.translate(sx * this._sunDistance, sy * this._sunDistance, sz * this._sunDistance);
      this.rotate(Math.PI + deg, 0, 1, 0);
      this.rotate(elev, 1, 0, 0);
      this.scale(this._sunSize, this._sunSize, this._sunSize);
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

    this._uTerrainLighting.uSunDirection = sunDir;
    this.terrainShader.setUniformsValues(this._uTerrainLighting );

    this.pushMatrix();
      this.translate(0, this._groundLevel, 0);
      this.scale(this._terrainScale, this._terrainScale, this._terrainScale);
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

    this.setActiveShaderSimple(this.grassShader);
    this.grassShader.setUniformsValues(this._uGrassWind);

    // Living green grass
    this._uGrassLive.uSunDirection = sunDir;
    this.grassShader.setUniformsValues(this._uGrassLive);
    this.pushMatrix();
      this.translate(0, this._groundLevel, 0);
      this.scale(this._terrainScale, this._terrainScale, this._terrainScale);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.grass.display();
    this.popMatrix();

    if (this.deadGrass) {
      this._uGrassDead.uSunDirection = sunDir;
      this.grassShader.setUniformsValues(this._uGrassDead);
      this.pushMatrix();
        this.translate(0, this._groundLevel, 0);
        this.scale(this._terrainScale, this._terrainScale, this._terrainScale);
        this.rotate(-Math.PI / 2, 1, 0, 0);
        this.deadGrass.display();
      this.popMatrix();
    }

    this.setActiveShaderSimple(this.defaultShader);
  }

  drawBarn() {
    if (!this.displayBarn || !this.barn) return;

    this.setActiveShaderSimple(this.defaultShader);
    const { x, y, z, scale } = this.barn;
    this.pushMatrix();
      this.translate(x, y, z);
      this.scale(scale, scale, scale);
      this.barn.display();
    this.popMatrix();
  }

  drawWagon(){
    if (!this.displayWagon) return;
    this.wagon.display();
  }

  drawInteractionRings() {
    if (!this.displayRings) return;
    this.setActiveShaderSimple(this.defaultShader);

    // 1. Barn drop-off zone
    (this.gameController.isInsideRing
      ? this.ringBarnActiveAppearance
      : this.ringBarnInactiveAppearance
    ).apply();
    this.barnRing.display(this);

    // 2. Pickup indicators beneath hay bales
    for (const bale of this.hayBales) {
      (bale.ring.contains(this.wagon.x, this.wagon.z)
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
      if (Math.hypot(bale.x - this.wagon.x, bale.z - this.wagon.z) > this.renderRange) continue;
      this.pushMatrix();
        this.translate(bale.x, this._baleGroundY, bale.z);
        this.rotate(bale.yRot, 0, 1, 0);
        bale.display();
      this.popMatrix();
    }
  }

  drawArrows() {
    if (!this.hayBales || !this.arrow) return;
    this.setActiveShaderSimple(this.arrowShader);
    this.arrowShader.setUniformsValues(this._uArrow);

    this.arrowAppearance.apply();

    for (const bale of this.hayBales) {
      this.pushMatrix();
        this.translate(bale.x, this._arrowDisplayHeight, bale.z);
        this.scale(this._arrowDisplayScale, this._arrowDisplayScale, this._arrowDisplayScale);
        this.arrow.display();
      this.popMatrix();
    }
  }

  _drawHitCircle(x, z, r) {
    this.pushMatrix();
      this.translate(x, this._hitCircleY, z);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.scale(r, r, 1);
      this._hitBoxDisk.display();
    this.popMatrix();
  }

  drawHitBoxes() {
    if (!this.displayHitBoxes) return;
    this.setActiveShaderSimple(this.defaultShader);
    this.hitBoxAppearance.apply();

    for (const rock of this.rocks)
      this._drawHitCircle(rock.x, rock.z, rock.r);

    for (const bale of this.hayBales)
      this._drawHitCircle(bale.x, bale.z, bale.r);

    for (const flower of this.flowers){
        this._drawHitCircle(flower.x,flower.z,flower.r);
    }

    this._drawHitCircle(this.barn.x, this.barn.z, this.barn.r);

    this._drawHitCircle(this.wagon.x, this.wagon.z, this.wagon.r/2);
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
    this.drawHitBoxes();

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