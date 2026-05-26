import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { Sphere } from "./objects/sphere.js";
import { Plane } from "./objects/plane.js";
import { Wagon } from "./objects/wagon.js";
import { WagonController } from "./controllers/WagonController.js";
import { Grass } from "./objects/grass.js";
import { Barn } from "./objects/barn/barn.js";

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

    this.barn = new Barn(this);

    // Textures
    this.skyTexture     = new CGFtexture(this, "textures/skyTex.png");
    this.skyMap         = new CGFtexture(this, "textures/skyMap.png");
    this.terrainTexture = new CGFtexture(this, "textures/terrain.jpg");
    this.hillMap        = new CGFtexture(this, "textures/hillMap.png");
    this.pathMask       = new CGFtexture(this, "textures/path1.png");
    this.pathTex        = new CGFtexture(this, "textures/pathTex.jpg");
    this.woodTexture    = new CGFtexture(this, "textures/wood.jpg");

    // Wood Material
    this.woodAppearance = new CGFappearance(this);
    this.woodAppearance.setAmbient(0.35, 0.22, 0.10, 1.0);
    this.woodAppearance.setDiffuse(0.55, 0.35, 0.16, 1.0);
    this.woodAppearance.setSpecular(0.08, 0.05, 0.02, 1.0);
    this.woodAppearance.setTexture(this.woodTexture);
    this.woodAppearance.setTextureWrap('REPEAT', 'REPEAT');

    this.wagon = new Wagon(this);
    this.wagonController = new WagonController(this.wagon, this.freeCamera, this.wagonCamera);

    // Sky Appearance
    this.skyAppearance = new CGFappearance(this);
    this.skyAppearance.setEmission(1, 1, 1, 1);
    this.skyAppearance.setAmbient(0.0, 0.0, 0.0, 1.0);
    this.skyAppearance.setDiffuse(0.0, 0.0, 0.0, 1.0);
    this.skyAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.skyAppearance.setTexture(this.skyTexture);
    this.skyAppearance.setTextureWrap('REPEAT', 'REPEAT');
    this.skyMap.bind(1);

    // Sun Appearance
    this.sunAppearance = new CGFappearance(this);
    this.sunAppearance.setEmission(1.0, 0.95, 0.5, 1.0);
    this.sunAppearance.setAmbient(1.0, 0.95, 0.5, 1.0);
    this.sunAppearance.setDiffuse(0.0, 0.0, 0.0, 1.0);
    this.sunAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);

    // Terrain Appearance
    this.terrainAppearance = new CGFappearance(this);
    this.terrainAppearance.setAmbient(0.3, 0.3, 0.3, 1.0);
    this.terrainAppearance.setDiffuse(0.8, 0.8, 0.8, 1.0);
    this.terrainAppearance.setSpecular(0.05, 0.05, 0.05, 1.0);
    this.terrainAppearance.setShininess(5.0);
    this.terrainAppearance.setTexture(this.terrainTexture);
    this.terrainAppearance.setTextureWrap('REPEAT', 'REPEAT');

    // Terrain shader
    this.terrainShader = new CGFshader(this.gl, "shaders/terrain.vert", "shaders/terrain.frag");
    this.terrainShader.setUniformsValues({
      uHeightMap:   1,
      uPathMask:    2,
      uPathTex:     3,
      uHeightScale: 0.07
    });

    // Sky shader
    this.skyShader = new CGFshader(this.gl, "shaders/sky.vert", "shaders/sky.frag");
    this.skyShader.setUniformsValues({ uSampler2: 1, timeFactor: 0, normScale: 1 });

    // Wood shader
    this.woodShader = new CGFshader(this.gl, "shaders/wood.vert", "shaders/wood.frag");
    this.woodShader.setUniformsValues({ uSunDirection: this.getSunDirection() });

    // Grass shader
    this.grassShader = new CGFshader(this.gl, "shaders/grass.vert", "shaders/grass.frag");

    // Grass GUI parameters
    this._liveCount       = 300;
    this._liveHeightScale = 0.8;
    this._liveSpread      = 50.0;
    this._bladesPerClump  = 40;

    this._deadCount       = 150;
    this._deadHeightScale = 0.75;
    this._deadSpread      = 40.0;

    this.grass     = new Grass(this, this._liveCount, 42,  this._liveHeightScale, this._liveSpread, this._bladesPerClump);
    this.deadGrass = new Grass(this, this._deadCount, 137, this._deadHeightScale, this._deadSpread, this._bladesPerClump);

    // GUI parameters
    this.sunElevation          = 40;
    this.sunDegree             = 180;
    this.displayAxis           = false;
    this.displaySkyNormals     = false;
    this.displayTerrainNormals = false;
    this.displaySunNormals     = false;
    this.displayWagonNormals   = false;
    this.windStrength          = 0.5;
  }

  // Grass property setters for each rebuilds the affected object

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
    this.freeCamera = new CGFcamera(
      1.2, 0.1, 500,
      vec3.fromValues(0, 8, -20),
      vec3.fromValues(0, 1.5,  0)
    );

    this.wagonCamera = new CGFcamera(
      1.2, 0.1, 500,
      vec3.fromValues(0, 4, -10),
      vec3.fromValues(0, 1.5,  0)
    );

    this.camera = this.wagonCamera;
  }

  getSunDirection() {
    const elev = this.sunElevation * Math.PI / 180;
    const deg  = this.sunDegree   * Math.PI / 180;
    return [
      Math.cos(elev) * Math.sin(deg),
      Math.sin(elev),
      Math.cos(elev) * Math.cos(deg),
    ];
  }

  update(t) {
    // Delta time in seconds, capped to avoid large jumps on tab switch
    if (this.lastTime === undefined) this.lastTime = t;
    const dt = Math.min((t - this.lastTime) / 1000, 0.1);
    this.lastTime = t;

    // Sun & sky
    const [sx, sy, sz] = this.getSunDirection();
    this.lights[1].setPosition(sx, sy, sz, 0);
    this.lights[1].update();
    this.skyShader.setUniformsValues({ timeFactor: t / 8000 % 100 });
    this.grassShader.setUniformsValues({ uTime: (t / 1000) % 1000, uWindStrength: this.windStrength });

    this.wagonController.update(dt);
    this.camera = this.wagonController.activeCamera;
  }

  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  }

  drawSky() {
    const cx = this.camera.position[0];
    const cz = this.camera.position[2];

    this.setActiveShader(this.skyShader);
    this.pushMatrix();
      this.skyAppearance.apply();
      this.translate(cx, -10, cz);
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
      const sunDist = 190;
      this.translate(cx + sx * sunDist, sy * sunDist, cz + sz * sunDist);
      this.scale(8, 8, 8);
      this.sun.display();
    this.popMatrix();
  }

  drawTerrain() {
    this.lights[0].disable();
    this.lights[1].disable();

    const sunDir = this.getSunDirection();

    this.setActiveShader(this.terrainShader);
    this.terrainAppearance.apply();
    this.hillMap.bind(1);
    this.pathMask.bind(2);
    this.pathTex.bind(3);

    this.terrainShader.setUniformsValues({
      uHeightMap: 1,
      uPathMask:  2,
      uPathTex:   3,
      uSunDir:    sunDir,
    });

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

    // Living green grass
    this.grassShader.setUniformsValues({ uSunDir: sunDir, uDeadGrass: 0.0 });
    this.pushMatrix();
      this.translate(0, -10, 0);
      this.scale(400, 400, 400);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.grass.display();
    this.popMatrix();

    // Dead brown grass
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

    const BARN_SCALE = 10;
    const BARN_X = 30;
    const BARN_Y = 2;
    const BARN_Z = 10;
    this.setActiveShader(this.defaultShader);

    this.gl.enable(this.gl.NORMALIZE);

    this.pushMatrix();
      this.translate(BARN_X, BARN_Y, BARN_Z);
      this.scale(BARN_SCALE, BARN_SCALE, BARN_SCALE);
      this.barn.display();
    this.popMatrix();

    this.gl.disable(this.gl.NORMALIZE);
  }

  drawWagon(){
    this.pushMatrix();
      this.scale(3,3,3);
      this.wagon.display();
    this.popMatrix();
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
    this.drawBarn();
    this.drawWagon();

    for (const [obj, show] of [
      [this.sky,     this.displaySkyNormals],
      [this.terrain, this.displayTerrainNormals],
      [this.sun,     this.displaySunNormals],
      [this.wagon,   this.displayWagonNormals],
    ]) {
      show ? obj.enableNormalViz() : obj.disableNormalViz();
    }
  }
}
