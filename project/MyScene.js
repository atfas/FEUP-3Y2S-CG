  import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
  import { Sphere } from "./objects/sphere.js";
  import { Plane } from "./objects/plane.js";

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
      this.terrain = new Plane(this, 50, 0, 30, 0, 30);

      // Textures
      this.skyTexture = new CGFtexture(this,"textures/skyTex.png");
      this.skyMap = new CGFtexture(this, "textures/skyMap.png");

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

      // Terrain Texture
      this.terrainTexture = new CGFtexture(this, "textures/terrain.jpg");

      // // Terrain Appearance
      // this.terrainAppearance = new CGFappearance(this);
      // this.terrainAppearance.setAmbient(0.8, 0.8, 0.8, 1.0);
      // this.terrainAppearance.setDiffuse(0.8, 0.8, 0.8, 1.0);  
      // this.terrainAppearance.setSpecular(0.05, 0.05, 0.05, 1.0);
      // this.terrainAppearance.setShininess(5.0);
      // this.terrainAppearance.setTexture(this.terrainTexture);
      // this.terrainAppearance.setTextureWrap('REPEAT', 'REPEAT');
  // In init(), add heightmap texture

      this.hillMap = new CGFtexture(this, "textures/hillMap.png");

      // Replace terrainAppearance block
      this.terrainAppearance = new CGFappearance(this);
      this.terrainAppearance.setAmbient(0.3, 0.3, 0.3, 1.0);
      this.terrainAppearance.setDiffuse(0.8, 0.8, 0.8, 1.0);
      this.terrainAppearance.setSpecular(0.05, 0.05, 0.05, 1.0);
      this.terrainAppearance.setShininess(5.0);
      this.terrainAppearance.setTexture(this.terrainTexture);
      this.terrainAppearance.setTextureWrap('REPEAT', 'REPEAT');

      // Add terrain shader
      this.terrainShader = new CGFshader(this.gl, "shaders/terrain.vert", "shaders/terrain.frag");
      this.terrainShader.setUniformsValues({ uHeightMap: 1, uHeightScale: 0.03 });
      //                                                              ^^^^
      //                            tune this: 0.05 = subtle, 0.15 = dramatic hills

      // Shaders
      this.skyShader=new CGFshader(this.gl, "shaders/sky.vert", "shaders/sky.frag");
      this.skyShader.setUniformsValues({ uSampler2: 1 });
      this.skyShader.setUniformsValues({ timeFactor: 0 });
      this.skyShader.setUniformsValues({ normScale: 1});


      // GUI parameters
      this.sunElevation  = 20;   
      this.sunDegree     = 180;   
      this.displayAxis           = false;
      this.displaySkyNormals     = false;
      this.displayTerrainNormals = false;
      this.displaySunNormals     = false;

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
            vec3.fromValues(0, 1.7, 0),   // back to original eye height
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
    // Remove gl.disable(CULL_FACE)


    this.lights[0].disable();
    this.lights[1].disable();

    const sunDir = this.getSunDirection();

    this.setActiveShader(this.terrainShader);
    this.terrainAppearance.apply();
    this.hillMap.bind(1);

    this.terrainShader.setUniformsValues({ 
        uHeightMap: 1,
        uSunDir: sunDir,
        uSunElevation: this.sunElevation
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

  display() {
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      this.updateProjectionMatrix();
      this.loadIdentity();
      this.applyViewMatrix();

      if (this.displayAxis) this.axis.display();

      this.drawSky();
      this.drawTerrain(); 
      
      // Normals display
      for (const [obj, show] of [
          [this.sky,     this.displaySkyNormals],
          [this.terrain, this.displayTerrainNormals],
          [this.sun,     this.displaySunNormals],
      ]) {
          show ? obj.enableNormalViz() : obj.disableNormalViz();
      }
  }
}
