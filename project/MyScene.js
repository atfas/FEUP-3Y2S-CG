import { CGFscene, CGFcamera } from "../lib/CGF.js";
import { SceneConfig } from "./SceneConfig.js";
import { TextureLoader }    from "./loaders/TextureLoader.js";
import { AppearanceLoader } from "./loaders/AppearanceLoader.js";
import { ShaderLoader }     from "./loaders/ShaderLoader.js";
import { ObjectLoader }     from "./loaders/ObjectLoader.js";
import { UniformLoader }    from "./loaders/UniformLoader.js";
import { WagonController }  from "./controllers/WagonController.js";
import { GameController }   from "./controllers/GameController.js";
import { InputController }  from "./controllers/InputController.js";
import { SpawnController }  from "./controllers/SpawnController.js";
import { GameModel }        from "./models/GameModel.js";
import { WorldModel }       from "./models/WorldModel.js";
import { SceneDraw }        from "./views/SceneDraw.js";

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

    // --- Models ---
    this.worldModel = new WorldModel(this);
    this.gameModel  = new GameModel(100, 2, 5, 15, 18);

    // --- Loaders ---
    new TextureLoader(this);
    new AppearanceLoader(this);
    new ShaderLoader(this);
    new ObjectLoader(this);
    new UniformLoader(this);

    // --- Controllers ---
    this.inputController  = new InputController();
    this.spawnController  = new SpawnController(this, this.gameModel);
    this.wagonController  = new WagonController(this.wagon, this.freeCamera, this.wagonCamera, this.inputController);
    this.gameController   = new GameController(this.gameModel, this.wagon, this.barnRing, this.inputController);
    this.gameController.setSpawnController(this.spawnController);

    this.spawnController.regenerate();

    this.SceneDraw = new SceneDraw(this, this.gameModel, this.worldModel);
  }

  // getters/setters for interface
  get hp()                  { return this.gameModel.hp; }
  get score()               { return this.gameModel.score; }
  get gameOver()            { return this.gameModel.gameOver; }
  get instantDamage()       { return this.gameModel.instantDamage; }
  get instantHeal()         { return this.gameModel.instantHeal; }
  get collectedBalesCount() { return this.gameModel.collectedBalesCount; }
  get maxCollectedBales()   { return this.gameModel.maxCollectedBales; }

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
    return this.worldModel.getSunDirection();
  }

  update(t) {
    if (this.lastTime === undefined) this.lastTime = t;
    const dt = Math.min((t - this.lastTime) / 1000, this._maxDeltaTime);
    this.lastTime = t;

    this.gameController.update(t);
    if (this.gameModel.gameOver) return;

    const [sunX, sunY, sunZ] = this.worldModel.getSunDirection();
    this.lights[1].setPosition(sunX, sunY, sunZ, 0);
    this.lights[1].update();
    this._uSkyTime.uTimeFactor = t / this._skyAnimPeriod % this._skyAnimWrap;
    this._uGrassWind.uTime = (t / 1000) % this._grassAnimWrap;
    this._uGrassWind.uWindStrength = this.windStrength;
    this._uArrow.uTimeFactor = (t / 1000) % this._arrowAnimWrap;

    this.wagonController.update(dt);
    this.camera = this.wagonController.activeCamera;
  }

  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  }

  display() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.updateProjectionMatrix();
    this.loadIdentity();
    this.applyViewMatrix();
    this.SceneDraw.draw();
  }
}
