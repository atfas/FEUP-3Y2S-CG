import { CGFaxis }     from "../../lib/CGF.js";
import { CGFobjModel } from "../../lib/extra/CGFobjModel.js";
import { Sphere }  from "../objects/basics/sphere.js";
import { MyDisk }  from "../objects/basics/disk.js";
import { Plane }   from "../objects/basics/plane.js";
import { Wagon }   from "../objects/composed/wagon.js";
import { Arrow }   from "../objects/composed/Arrow.js";
import { Grass }   from "../objects/composed/grass.js";
import { Barn }    from "../objects/composed/barn/barn.js";
import { Ring }    from "../objects/composed/Ring.js";

export class ObjectLoader {
    /**
     * Constructs and attaches every scene object that persists for the
     * lifetime of the game (i.e. objects that are not dynamically spawned).
     * Dynamic objects (rocks, flowers, hay bales) are managed by SpawnController.
     * @param {MyScene} scene
     */
    constructor(scene) {
        scene.axis    = new CGFaxis(scene);
        scene.sky     = new Sphere(scene, 64, 32, 0.5, true);
        scene.sun     = new MyDisk(scene, 32);
        scene.terrain = new Plane(scene, 50, 0, 30, 0, 30);

        scene.horse = new CGFobjModel(scene, "objects/horse.obj");

        scene.barn = new Barn(scene, 11, 1.3, 140);
        scene.barnRing = new Ring(
            scene,
            scene.barn.x,
            scene.barn.z - scene._barnRingDistance,
            scene._barnRingRadius,
            scene.barn.y
        );

        scene.wagon     = new Wagon(scene, 0, 0, 0, 3);
        scene.arrow     = new Arrow(scene);
        scene.grass     = new Grass(scene, scene._liveCount, 42,  scene._liveHeightScale, scene._liveSpread, scene._bladesPerClump);
        scene.deadGrass = new Grass(scene, scene._deadCount, 137, scene._deadHeightScale, scene._deadSpread, scene._bladesPerClump);

        scene._hitBoxDisk = new MyDisk(scene, 32);
    }
}
