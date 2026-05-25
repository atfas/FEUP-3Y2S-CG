import { CGFinterface, dat } from '../lib/CGF.js';

export class MyInterface extends CGFinterface {
  constructor() {
    super();
  }

  init(application) {
    super.init(application);

    this.gui = new dat.GUI();

    this.gui.add(this.scene, 'displayAxis').name("Display Axis");
    const normalsFolder= this.gui.addFolder('Normals');
    normalsFolder.add(this.scene, 'displaySkyNormals').name("Sky Normals");
    normalsFolder.add(this.scene, 'displayTerrainNormals').name("Terrain Normals");
    normalsFolder.add(this.scene, 'displaySunNormals').name("Sun Normals");
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

    return true;
  }
}
