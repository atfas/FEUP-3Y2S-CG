import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { Sphere } from "./objects/sphere.js";
import { Plane } from "./objects/plane.js";
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
    
    this.sky = new Sphere(this, 64, 32, 0.5, true);
    this.sun = new Sphere(this, 16, 8, 1.0, false);
    this.terrain = new Plane(this, 5, 1, 0, 1);
    this.rockCount   = 100;
    this.flowerCount = 100;
    this._regenerate();

    // Textures
    this.skyTexture = new CGFtexture(this,"textures/skyTex.png");
    this.skyMap = new CGFtexture(this, "textures/skyMap.png");
    this.rockTexture = new CGFtexture(this, "textures/rock.jpg");

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
    this.terrainAppearance.setAmbient(0.1, 0.35, 0.05, 1.0);
    this.terrainAppearance.setDiffuse(0.2, 0.6, 0.1, 1.0);
    this.terrainAppearance.setSpecular(0.05, 0.1, 0.05, 1.0);
    this.terrainAppearance.setShininess(5.0);


    // Shaders
    this.skyShader=new CGFshader(this.gl, "shaders/sky.vert", "shaders/sky.frag");
    this.skyShader.setUniformsValues({ uSampler2: 1 , timeFactor: 0 , normScale: 1});
    this.rockShader = new CGFshader(this.gl, "shaders/rock.vert","shaders/rock.frag");


    // GUI parameters
    this.sunElevation  = 20;
    this.sunDegree     = 180;
    this.displayAxis           = false;
    this.displaySkyNormals     = false;
    this.displayTerrainNormals = false;
    this.displaySunNormals     = false;
    this.displayRockNormals    = false;

  }
  
  _regenerate() {
    this._placedObjects = [];
    this.rocks   = this._spawnRandom(this.rockCount,   (x, z) => new Rock(this, x, z));
    this.flowers = this._spawnRandom(this.flowerCount, (x, z) => new Flower(this, x, z));
  }

  _spawnRandom(count, createFn) {
    const result = [];
    let attempts = 0;
    while (result.length < count && attempts < count * 10) {
      attempts++;
      const a = Math.random() * 2 * Math.PI;
      const x = Math.cos(a) * Math.random() * 200;
      const z = Math.sin(a) * Math.random() * 200;
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
        this.translate(rock.x, rock.y, rock.z);
        rock.display();
      this.popMatrix();
    }
  }

  drawFlora() {
    this.setActiveShader(this.defaultShader);
    for (const f of this.flowers) {
      this.pushMatrix();
        this.translate(f.x, f.y, f.z);
        this.scale(f.scale, f.scale, f.scale);
        this.rotate(f.rotY, 0, 1, 0);
        f.display();
      this.popMatrix();
    }
  }


  
  initLights() {
    // Ambient light
    this.lights[0].setPosition(0, 10, 0, 1);
    this.lights[0].setAmbient(0.3, 0.3, 0.35, 1.0);
    this.lights[0].setDiffuse(0.4, 0.4, 0.5,  1.0);
    this.lights[0].setSpecular(0.0, 0.0, 0.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();

    // Sun light
    this.lights[1].setPosition(0.6, 0.8, 0.0, 0);
    this.lights[1].setAmbient(0.0, 0.0, 0.0,  1.0);
    this.lights[1].setDiffuse(1.0, 0.95, 0.8, 1.0);
    this.lights[1].setSpecular(1.0, 0.95, 0.8, 1.0);
    this.lights[1].enable();
    this.lights[1].update();
  }

  initCameras() {
    this.camera = new CGFcamera(
      1.2, 0.1, 500,
      vec3.fromValues(0, 1.7, 0),
      vec3.fromValues(0, 1.7, -1)
    );
  }

  getSunDirection() {
    const elev = this.sunElevation * Math.PI / 180;
    const deg = this.sunDegree   * Math.PI / 180;
    return [
      Math.cos(elev) * Math.sin(deg),
      Math.sin(elev),
      Math.cos(elev) * Math.cos(deg),
    ];
  }

  update(t) {
    const [sx, sy, sz] = this.getSunDirection();
    this.lights[1].setPosition(sx, sy, sz, 0);
    this.lights[1].update();
		this.skyShader.setUniformsValues({ timeFactor: t / 8000 % 100 });
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


    // Sun: emissive sphere placed along the sun direction
    this.setActiveShader(this.defaultShader);
    this.sunAppearance.apply();
    const [sx, sy, sz] = this.getSunDirection();
    this.pushMatrix();
      this.translate(cx + sx * 180, sy * 180, cz + sz * 180);
      this.scale(10, 10, 10);
      this.sun.display();
    this.popMatrix();

  }

  drawTerrain() {
    const cx = this.camera.position[0];
    const cz = this.camera.position[2];
    this.terrainAppearance.apply();
    this.pushMatrix();
      this.translate(cx, 0, cz);
      this.scale(400, 400, 400);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.terrain.display();
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

    this.setActiveShader(this.defaultShader);
    this.setDefaultAppearance();
    this.drawTerrain();
    this.drawFlora();

    this.drawRocks();

    // Normals display
    for (const [obj, show] of [
      [this.sky,     this.displaySkyNormals],
      [this.terrain, this.displayTerrainNormals],
      [this.sun,     this.displaySunNormals],
    ]) {
      show ? obj.enableNormalViz() : obj.disableNormalViz();
    }
    for (const rock of this.rocks)
      this.displayRockNormals ? rock.enableNormalViz() : rock.disableNormalViz();
  }
}
