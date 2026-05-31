export class SceneDraw {
  /**
   * @param {MyScene}    scene     - live WebGL scene
   * @param {GameModel}  gameModel - read-only source of dynamic object lists
   * @param {WorldModel} worldModel - sun direction and render-range values
   */
  constructor(scene, gameModel, worldModel) {
    this.scene = scene;
    this.model = gameModel;
    this.world = worldModel;
  }

  /**
   * Master draw call invoked by MyScene.display(). Draws every scene element
   * in a defined order so transparency and shader switches are predictable.
   */
  draw() {
    if (this.scene.displayAxis) this.scene.axis.display();

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
    this._updateNormalViz();
  }

  /**
   * Draws the inverted sky sphere centred at ground level with the animated
   * sky shader. The sphere uses inward normals so it renders correctly from inside.
   */
  drawSky() {
    if (!this.scene.displaySky) return;
    this.scene.setActiveShaderSimple(this.scene.skyShader);
    this.scene.skyShader.setUniformsValues(this.scene._uSkyTime);
    this.scene.pushMatrix();
    this.scene.skyAppearance.apply();
    this.scene.translate(0, this.scene._groundLevel, 0);
    this.scene.scale(
      this.scene._skyScale,
      this.scene._skyScale,
      this.scene._skyScale,
    );
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.sky.display();
    this.scene.popMatrix();
  }

  /**
   * Draws the sun disc at a distance proportional to _sunDistance along the
   * current sun direction vector, oriented to always face the viewer.
   */
  drawSun() {
    if (!this.scene.displaySun) return;
    const [sunX, sunY, sunZ] = this.world.getSunDirection();
    const elevation = (this.scene.sunElevation * Math.PI) / 180;
    const degree = (this.scene.sunDegree * Math.PI) / 180;

    this.scene.setActiveShaderSimple(this.scene.defaultShader);
    this.scene.sunAppearance.apply();
    this.scene.pushMatrix();
    this.scene.translate(
      sunX * this.scene._sunDistance,
      sunY * this.scene._sunDistance,
      sunZ * this.scene._sunDistance,
    );
    this.scene.rotate(Math.PI + degree, 0, 1, 0);
    this.scene.rotate(elevation, 1, 0, 0);
    this.scene.scale(
      this.scene._sunSize,
      this.scene._sunSize,
      this.scene._sunSize,
    );
    this.scene.sun.display();
    this.scene.popMatrix();
  }

  /**
   * Draws the height-mapped terrain plane. Scene lights are temporarily
   * disabled because the terrain shader handles its own lighting via the
   * uSunDirection uniform; they are re-enabled afterwards.
   */
  drawTerrain() {
    if (!this.scene.displayTerrain) return;
    this.scene.lights[0].disable();
    this.scene.lights[1].disable();

    this.scene.setActiveShaderSimple(this.scene.terrainShader);
    this.scene.terrainAppearance.apply();
    this.scene.hillMap.bind(1);
    this.scene.pathMask.bind(2);
    this.scene.pathTex.bind(3);

    this.scene._uTerrainLighting.uSunDirection = this.world.getSunDirection();
    this.scene.terrainShader.setUniformsValues(this.scene._uTerrainLighting);

    this.scene.pushMatrix();
    this.scene.translate(0, this.scene._groundLevel, 0);
    this.scene.scale(
      this.scene._terrainScale,
      this.scene._terrainScale,
      this.scene._terrainScale,
    );
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.terrain.display();
    this.scene.popMatrix();

    this.scene.lights[0].enable();
    this.scene.lights[1].enable();
    this.scene.lights[0].update();
    this.scene.lights[1].update();
    this.scene.setActiveShaderSimple(this.scene.defaultShader);
  }

  /**
   * Draws the live and dead grass layers using the grass shader with wind
   * animation uniforms. Each layer uses a different uDeadGrass flag so the
   * shader can colour them separately.
   */
  drawGrass() {
    if (!this.scene.displayGrass || !this.scene.grass) return;
    const sunDirection = this.world.getSunDirection();

    this.scene.setActiveShaderSimple(this.scene.grassShader);
    this.scene.grassShader.setUniformsValues(this.scene._uGrassWind);

    this.scene._uGrassLive.uSunDirection = sunDirection;
    this.scene.grassShader.setUniformsValues(this.scene._uGrassLive);
    this.scene.pushMatrix();
    this.scene.translate(0, this.scene._groundLevel, 0);
    this.scene.scale(
      this.scene._terrainScale,
      this.scene._terrainScale,
      this.scene._terrainScale,
    );
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.grass.display();
    this.scene.popMatrix();

    if (this.scene.deadGrass) {
      this.scene._uGrassDead.uSunDirection = sunDirection;
      this.scene.grassShader.setUniformsValues(this.scene._uGrassDead);
      this.scene.pushMatrix();
      this.scene.translate(0, this.scene._groundLevel, 0);
      this.scene.scale(
        this.scene._terrainScale,
        this.scene._terrainScale,
        this.scene._terrainScale,
      );
      this.scene.rotate(-Math.PI / 2, 1, 0, 0);
      this.scene.deadGrass.display();
      this.scene.popMatrix();
    }

    this.scene.setActiveShaderSimple(this.scene.defaultShader);
  }

  /**
   * Translates and scales the barn to its world position then draws it.
   * Scale is read from barn.scale so barn size can be configured in ObjectLoader.
   */
  drawBarn() {
    if (!this.scene.displayBarn || !this.scene.barn) return;
    this.scene.setActiveShaderSimple(this.scene.defaultShader);
    const { x, y, z, scale } = this.scene.barn;
    this.scene.pushMatrix();
    this.scene.translate(x, y, z);
    this.scene.scale(scale, scale, scale);
    this.scene.barn.display();
    this.scene.popMatrix();
  }

  /** Delegates wagon rendering to the Wagon object (which manages its own transform). */
  drawWagon() {
    if (!this.scene.displayWagon) return;
    this.scene.wagon.display();
  }

  /**
   * Draws the barn drop-off ring (green when wagon is inside, grey otherwise)
   * and each hay-bale pickup ring (yellow when wagon overlaps, orange otherwise).
   */
  drawInteractionRings() {
    if (!this.scene.displayRings) return;
    this.scene.setActiveShaderSimple(this.scene.defaultShader);

    (this.model.isInsideRing
      ? this.scene.ringBarnActiveAppearance
      : this.scene.ringBarnInactiveAppearance
    ).apply();
    this.scene.barnRing.display(this.scene);

    for (const bale of this.model.hayBales) {
      (bale.ring.contains(this.scene.wagon.x, this.scene.wagon.z)
        ? this.scene.ringBaleActiveAppearance
        : this.scene.ringBaleInactiveAppearance
      ).apply();
      bale.ring.display(this.scene);
    }
  }

  /**
   * Draws all hay bales that are within renderRange of the wagon, skipping
   * distant ones to save draw calls. Each bale is rotated by its random yRot
   * so the field looks varied.
   */
  drawHayBales() {
    if (!this.scene.displayHayBales || !this.model.hayBales) return;
    this.scene.setActiveShaderSimple(this.scene.defaultShader);
    for (const bale of this.model.hayBales) {
      if (
        Math.hypot(bale.x - this.scene.wagon.x, bale.z - this.scene.wagon.z) >
        this.world.renderRange
      )
        continue;
      this.scene.pushMatrix();
      this.scene.translate(bale.x, this.scene._baleGroundY, bale.z);
      this.scene.rotate(bale.yRot, 0, 1, 0);
      bale.display();
      this.scene.popMatrix();
    }
  }

  /**
   * Draws a bobbing animated arrow above each uncollected hay bale using the
   * arrow shader. Arrows are always drawn regardless of render range so the
   * player can spot distant bales.
   */
  drawArrows() {
    if (!this.model.hayBales || !this.scene.arrow) return;
    this.scene.setActiveShaderSimple(this.scene.arrowShader);
    this.scene.arrowShader.setUniformsValues(this.scene._uArrow);
    this.scene.arrowAppearance.apply();

    for (const bale of this.model.hayBales) {
      this.scene.pushMatrix();
      this.scene.translate(bale.x, this.scene._arrowDisplayHeight, bale.z);
      this.scene.scale(
        this.scene._arrowDisplayScale,
        this.scene._arrowDisplayScale,
        this.scene._arrowDisplayScale,
      );
      this.scene.arrow.display();
      this.scene.popMatrix();
    }
  }

  /**
   * Draws flowers within renderRange of the wagon. Each flower is
   * translated to its world position, scaled, and randomly rotated around Y.
   */
  drawFlora() {
    if (!this.scene.displayFlowers) return;
    this.scene.setActiveShaderSimple(this.scene.defaultShader);
    for (const f of this.model.flowers) {
      if (
        Math.hypot(f.x - this.scene.wagon.x, f.z - this.scene.wagon.z) >
        this.world.renderRange
      )
        continue;
      this.scene.pushMatrix();
      this.scene.translate(f.x, this.scene._flowerGroundY, f.z);
      this.scene.scale(f.scale, f.scale, f.scale);
      this.scene.rotate(f.rotY, 0, 1, 0);
      f.display();
      this.scene.popMatrix();
    }
  }

  /**
   * Draws rocks within renderRange using the rock procedural shader.
   * The rock texture is bound to unit 0 and the sun direction uniform is
   * refreshed each frame for correct shading.
   */
  drawRocks() {
    if (!this.scene.displayRocks) return;
    this.scene.setActiveShaderSimple(this.scene.rockShader);
    this.scene.rockTexture.bind(0);
    this.scene._uRock.uSunDirection = this.world.getSunDirection();
    this.scene.rockShader.setUniformsValues(this.scene._uRock);
    for (const rock of this.model.rocks) {
      if (
        Math.hypot(rock.x - this.scene.wagon.x, rock.z - this.scene.wagon.z) >
        this.world.renderRange
      )
        continue;
      this.scene.pushMatrix();
      this.scene.translate(rock.x, this.scene._rockGroundY, rock.z);
      rock.display();
      this.scene.popMatrix();
    }
  }

  /**
   * Renders the collision radius of every dynamic object and the wagon as a
   * flat coloured disc on the ground. Only active when displayHitBoxes is true.
   */
  drawHitBoxes() {
    if (!this.scene.displayHitBoxes) return;
    this.scene.setActiveShaderSimple(this.scene.defaultShader);
    this.scene.hitBoxAppearance.apply();

    for (const rock of this.model.rocks)
      this._drawHitCircle(rock.x, rock.z, rock.r);
    for (const bale of this.model.hayBales)
      this._drawHitCircle(bale.x, bale.z, bale.r);
    for (const flower of this.model.flowers)
      this._drawHitCircle(flower.x, flower.z, flower.r);

    this._drawHitCircle(
      this.scene.barn.x,
      this.scene.barn.z,
      this.scene.barn.r,
    );
    this._drawHitCircle(
      this.scene.wagon.x,
      this.scene.wagon.z,
      this.scene.wagon.r / 2,
    );
  }

  /**
   * Draws a single flat disc at (x, _hitCircleY, z) scaled to radius r,
   * representing a bounding-circle visualisation.
   * @param {number} x
   * @param {number} z
   * @param {number} r
   */
  _drawHitCircle(x, z, r) {
    this.scene.pushMatrix();
    this.scene.translate(x, this.scene._hitCircleY, z);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.scale(r, r, 1);
    this.scene._hitBoxDisk.display();
    this.scene.popMatrix();
  }

  /**
   * Enables or disables the normal-vector visualisation on objects based on
   * the corresponding display flags in the scene. Called at the end of each
   * draw() so toggling a flag in the GUI takes effect on the next frame.
   */
  _updateNormalViz() {
    for (const [obj, show] of [
      [this.scene.sky, this.scene.displaySkyNormals],
      [this.scene.terrain, this.scene.displayTerrainNormals],
      [this.scene.sun, this.scene.displaySunNormals],
      [this.scene.wagon, this.scene.displayWagonNormals],
    ]) {
      if (obj) show ? obj.enableNormalViz() : obj.disableNormalViz();
    }
    for (const rock of this.model.rocks)
      if (rock)
        this.scene.displayRockNormals
          ? rock.enableNormalViz()
          : rock.disableNormalViz();

    for (const flower of this.model.flowers)
      if (flower)
        this.scene.displayFlowerNormals
          ? flower.enableNormalViz()
          : flower.disableNormalViz();
  }
}
