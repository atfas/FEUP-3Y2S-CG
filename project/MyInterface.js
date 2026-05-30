import { CGFinterface, dat } from '../lib/CGF.js';

export class MyInterface extends CGFinterface {
  constructor() {
    super();
  }

  init(application) {
    super.init(application);

    this._hudBar       = document.getElementById('health-bar-inner');
    this._hudBarLabel  = document.getElementById('health-bar-label');
    this._hudScore     = document.getElementById('hud-score');
    this._hudBales     = document.getElementById('hud-bales');
    this._hudIndicator = document.getElementById('health-indicator');

    this.gui = new dat.GUI();

    this.gui.add(this.scene.wagonController, 'cameraMode', { 'Follow Wagon': 'wagon', 'Free Camera': 'free' }).name("Camera");
    this.gui.add(this.scene, 'displayAxis').name("Display Axis");

    const displayFolder = this.gui.addFolder('Display Objects');
    displayFolder.add(this.scene, 'displaySky').name("Sky");
    displayFolder.add(this.scene, 'displaySun').name("Sun");
    displayFolder.add(this.scene, 'displayTerrain').name("Terrain");
    displayFolder.add(this.scene, 'displayGrass').name("Grass");
    displayFolder.add(this.scene, 'displayBarn').name("Barn");
    displayFolder.add(this.scene, 'displayWagon').name("Wagon");
    displayFolder.add(this.scene, 'displayHayBales').name("Hay Bales");
    displayFolder.add(this.scene, 'displayFlowers').name("Flowers");
    displayFolder.add(this.scene, 'displayRocks').name("Rocks");
    displayFolder.add(this.scene, 'displayRings').name("Interaction Rings");
    displayFolder.add(this.scene, 'displayHorse').name("Horse");

    // GAME STATUS PANEL — bound to gameController directly so dat.GUI can read/write the live values
    const gameFolder = this.gui.addFolder('Game Status');
    gameFolder.add(this.scene.gameController, 'hp').name("HP (Health)").listen();
    gameFolder.add(this.scene.gameController, 'instantDamage').name("Inst. Damage").listen();
    gameFolder.add(this.scene.gameController, 'instantHeal').name("Inst. Restored").listen();
    gameFolder.add(this.scene.gameController, 'collectedBalesCount').name("Carried Bales").listen();
    gameFolder.add(this.scene.gameController, 'balesDropped').name("Bales Dropped").listen();
    gameFolder.add(this.scene.gameController, 'score').name("Score (Time)").listen();
    gameFolder.open();

    // FLORA — all three object types grouped together, all trigger _regenerate on finish
    const floraFolder = this.gui.addFolder('Flora');
    floraFolder.add(this.scene, 'rockCount',   0, 500, 1).name('Rocks')    .onFinishChange(() => this.scene.spawnController.regenerate());
    floraFolder.add(this.scene, 'flowerCount', 0, 500, 1).name('Flowers')  .onFinishChange(() => this.scene.spawnController.regenerate());
    floraFolder.add(this.scene, 'baleCount',   1,  20, 1).name('Hay Bales').onFinishChange(() => this.scene.spawnController.regenerate());

    const skyFolder = this.gui.addFolder('Sky');
    skyFolder.add(this.scene, 'sunElevation', 0, 180).name("Sun Elevation");
    skyFolder.add(this.scene, 'sunDegree', 0, 360).name("Sun Degree");

    const grassFolder = this.gui.addFolder('Grass');
    const liveFolder = grassFolder.addFolder('Live Grass');
    liveFolder.add(this.scene, 'liveCount',       10, 400, 1).name("Clumps");
    liveFolder.add(this.scene, 'liveHeightScale',  0.2, 4.0 ).name("Height Scale");
    liveFolder.add(this.scene, 'liveSpread',        5,  200 ).name("Clump Spread");

    const deadFolder = grassFolder.addFolder('Dead Grass');
    deadFolder.add(this.scene, 'deadCount',       10, 400, 1).name("Clumps");
    deadFolder.add(this.scene, 'deadHeightScale',  0.2, 4.0 ).name("Height Scale");
    deadFolder.add(this.scene, 'deadSpread',        5,  200 ).name("Clump Spread");

    grassFolder.add(this.scene, 'windStrength', 0.0, 2.0).name("Wind Strength");

    const debugFolder = this.gui.addFolder('Debug');
    debugFolder.add(this.scene, 'displayHitBoxes').name("Hit Boxes");
    debugFolder.add(this.scene, 'renderRange', 10, 300, 1).name("Bale Render Range");

    const normalsFolder = this.gui.addFolder('Normals');
    normalsFolder.add(this.scene, 'displaySkyNormals').name("Sky Normals");
    normalsFolder.add(this.scene, 'displayTerrainNormals').name("Terrain Normals");
    normalsFolder.add(this.scene, 'displaySunNormals').name("Sun Normals");
    normalsFolder.add(this.scene, 'displayWagonNormals').name("Wagon Normals");
    normalsFolder.add(this.scene, 'displayRockNormals').name("Rock Normals");
    normalsFolder.add(this.scene, 'displayFlowerNormals').name("Flower Normals");

    return true;
  }

  update() {
    this.setActiveCamera(this.scene.camera);

    // HUD reads through the scene's public getters, not gameController directly
    const s = this.scene;
    const hpPct = Math.max(0, Math.min(100, s.hp));
    this._hudBar.style.width  = hpPct + '%';
    this._hudBar.classList.toggle('hit', s.instantDamage > 0);
    this._hudBarLabel.textContent = s.hp + ' HP';
    this._hudScore.textContent    = 'Score: ' + s.score;
    this._hudBales.textContent    = 'Bales: ' + s.collectedBalesCount + ' / ' + s.maxCollectedBales;

    const ind = this._hudIndicator;
    if (s.instantDamage > 0) {
      ind.textContent = '-' + s.instantDamage;
      ind.className   = 'damage';
    } else if (s.instantHeal > 0) {
      ind.textContent = '+' + s.instantHeal;
      ind.className   = 'heal';
    } else {
      ind.textContent = '';
      ind.className   = '';
    }
  }
}
