import { CGFinterface, dat } from '../lib/CGF.js';

export class MyInterface extends CGFinterface {
  constructor() {
    super();
  }

  init(application) {
    super.init(application);

    this.gui = new dat.GUI();

    this.gui.add(this.scene, 'displayAxis').name("Display Axis");
    this.gui.add(this.scene, 'displayNormals').name("Display Normals");

    const skyFolder = this.gui.addFolder('Sky');
    skyFolder.add(this.scene, 'sunElevation', 0, 180).name("Sun Elevation");
    skyFolder.add(this.scene, 'sunDegree', 0, 360).name("Sun Degree");
    skyFolder.open();

    return true;
  }
}
