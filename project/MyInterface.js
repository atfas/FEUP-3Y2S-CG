import { CGFinterface, dat } from '../lib/CGF.js';

export class MyInterface extends CGFinterface {
  constructor() {
    super();
  }

  init(application) {
    super.init(application);

    this.gui = new dat.GUI();

    //  GAME STATUS PANEL
    const gameFolder = this.gui.addFolder('Game Status');
    
    // Listeners tell dat.GUI to update values automatically when referenced variables shift
    this.hpController          = gameFolder.add(this.scene.gameController, 'hp').name("HP (Health)").listen();
    this.dmgController         = gameFolder.add(this.scene.gameController, 'instantDamage').name("Inst. Damage").listen();
    this.healController        = gameFolder.add(this.scene.gameController, 'instantHeal').name("Inst. Restored").listen();
    this.heldBalesController   = gameFolder.add(this.scene.gameController, 'collectedBalesCount').name("Carried Bales").listen();
    this.droppedBalesController= gameFolder.add(this.scene.gameController, 'balesDropped').name("Bales Dropped").listen();
    this.scoreController       = gameFolder.add(this.scene.gameController, 'score').name("Score (Time)").listen();
    
    gameFolder.open();

    this.gui.add(this.scene.wagonController, 'cameraMode', { 'Follow Wagon': 'wagon', 'Free Camera': 'free' }).name("Camera");
    this.gui.add(this.scene, 'displayAxis').name("Display Axis");

    const normalsFolder = this.gui.addFolder('Normals');
    normalsFolder.add(this.scene, 'displaySkyNormals').name("Sky Normals");
    normalsFolder.add(this.scene, 'displayTerrainNormals').name("Terrain Normals");
    normalsFolder.add(this.scene, 'displaySunNormals').name("Sun Normals");
    normalsFolder.add(this.scene, 'displayWagonNormals').name("Wagon Normals");
    normalsFolder.add(this.scene, 'displayRockNormals').name("Rock Normals");
    normalsFolder.open();

    const floraFolder = this.gui.addFolder('Flora');
    floraFolder.add(this.scene, 'rockCount', 0, 500, 1).name('Rocks').onFinishChange(() => this.scene._regenerate());
    floraFolder.add(this.scene, 'flowerCount', 0, 500, 1).name('Flowers').onFinishChange(() => this.scene._regenerate());
    floraFolder.open();

    const skyFolder = this.gui.addFolder('Sky');
    skyFolder.add(this.scene, 'sunElevation', 0, 180).name("Sun Elevation");
    skyFolder.add(this.scene, 'sunDegree', 0, 360).name("Sun Degree");
    skyFolder.open();

    const grassFolder = this.gui.addFolder('Grass');
    const liveFolder = grassFolder.addFolder('Live Grass');
    liveFolder.add(this.scene, 'liveCount',       10, 400, 1   ).name("Clumps");
    liveFolder.add(this.scene, 'liveHeightScale',  0.2, 4.0    ).name("Height Scale");
    liveFolder.add(this.scene, 'liveSpread',        5,  200    ).name("Clump Spread");
    liveFolder.open();

    const deadFolder = grassFolder.addFolder('Dead Grass');
    deadFolder.add(this.scene, 'deadCount',       10, 400, 1   ).name("Clumps");
    deadFolder.add(this.scene, 'deadHeightScale',  0.2, 4.0    ).name("Height Scale");
    deadFolder.add(this.scene, 'deadSpread',        5,  200    ).name("Clump Spread");
    deadFolder.open();

    grassFolder.add(this.scene, 'windStrength', 0.0, 2.0).name("Wind Strength");
    grassFolder.open();

    const balesFolder = this.gui.addFolder('Hay Bales');
    balesFolder.add(this.scene, 'baleCount', 1, 20, 1).name("Count");
    balesFolder.open();
    
    return true;
  }

  update() {
    this.setActiveCamera(this.scene.camera);
  }
}