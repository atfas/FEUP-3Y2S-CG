import { CGFaxis }     from "../../lib/CGF.js";
import { CGFobjModel } from "../../lib/extra/CGFobjModel.js";
import { Sphere }  from "../objects/sphere.js";
import { MyDisk }  from "../objects/disk.js";
import { Plane }   from "../objects/plane.js";
import { Wagon }   from "../objects/wagon.js";
import { Arrow }   from "../objects/Arrow.js";
import { Grass }   from "../objects/grass.js";
import { Barn }    from "../objects/barn/barn.js";
import { Ring }    from "../objects/Ring.js";

export class ObjectLoader {
    constructor(scene) {
        scene.axis    = new CGFaxis(scene);
        scene.sky     = new Sphere(scene, 64, 32, 0.5, true);
        scene.sun     = new MyDisk(scene, 32);
        scene.terrain = new Plane(scene, 50, 0, 30, 0, 30);

        scene.horse = new CGFobjModel(scene, "objects/horse.obj");

        scene.barn = new Barn(scene, 0, 2, 30);
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
