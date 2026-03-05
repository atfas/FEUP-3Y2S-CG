Aqui tens a continuação **ligeiramente melhorada e mais clara**, mantendo o estilo simples do vosso README:

---

# CG 2025/2026

## Group T05G08

## TP 2 Notes

---

### Exercise 1 – MyTangram Composition

In this exercise, we combined all previously created objects into a single **composite object**, `MyTangram`, to recreate the Tangram figure.

#### MyTangram Class

* `MyTangram` extends `CGFobject` and holds instances of all Tangram pieces.
* Each piece is displayed in the correct position according to our assigned figure using **geometric transformations** relative to the origin `(0,0,0)`.
* We used `scene.pushMatrix()` and `scene.popMatrix()` to isolate transformations per piece, preventing one piece's translation or rotation from affecting the others.

The exercise itself was straightforward in terms of transformations.

![Screenshot Tangram](screenshots/cg-t05g08-tp2-1.png)

---

### Exercise 2 – MyUnitCube

In this exercise, we implemented a **unit cube** centered at the origin using a single triangle mesh.

#### MyUnitCube Class

The class `MyUnitCube` extends `CGFobject` and defines:

* 8 vertices (from `-0.5` to `0.5`)
* 12 triangles (2 per face × 6 faces)
* A single indexed mesh

The cube is centered at the origin `(0,0,0)`.

At this stage, we had the **unit cube centered at the origin**.

#### Positioning the Cube as Tangram Base

The cube was then transformed to act as a base behind the Tangram.

We applied geometric transformations to:

* Scale the cube to resemble a flat base
* Translate it so it sits behind the Tangram
* Rotate the entire Tangram + base set

Finally, we rotated the complete composition so that it became **parallel to the XZ plane**, positioning the top-left vertex of the base at the origin `(0,0,0)`.


### Final Result

* The Tangram composition
* A cube acting as a base
* The full structure aligned parallel to the XZ plane

![Screenshot Tangram](screenshots/cg-t05g08-tp2-2.png)

### Exercise 3 – MyUnitCubeQuad

In this exercise, we re-implemented the **unit cube** assembling all six faces from individual `MyQuad` classes instead of a single triangle mesh.

#### MyUnitCubeQuad Class

The class `MyUnitCubeQuad` extends `CGFobject` and builds the cube by:

* Creating a single `MyQuad` instance shared across all face methods
* Positioning and rotating it
* Each face is isolated with `pushMatrix` / `popMatrix`

The six face methods are: `displayBase`, `displayTop`, `displayFront`, `displayBack`, `displayLeft`, and `displayRight`.

#### Positioning the Cube as Tangram Base

The `MyUnitCubeQuad` object replaced the previous `MyUnitCube` in the Tangram support, using the same `displayXZ` transformation function:

* Translate to `(5, 0, 5)`
* Rotate `-90°` around the X axis
* Scale to `10×10×10` and position behind the Tangram with a slight offset to avoid same z value

### Final Result

* The Tangram composition
* A quad-based cube acting as a base
* The full structure aligned parallel to the XZ plane similar to the previews exercise

![Screenshot Tangram](screenshots/cg-t05g08-tp2-3.png)

---

### Conclusion – MyUnitCube vs MyUnitCubeQuad

Although both objects produce a unit cube, the rendering result differs:

* **MyUnitCube** (Exercise 2) uses a single shared mesh with all vertices joined together. This results in a cube with **smoother faces** where the edges and face boundaries are barely visible.

* **MyUnitCubeQuad** (Exercise 3) assembles the cube from **six independent quads**. This results in a cube with **sharper faces** with visible boundaries between them.

![Screenshot Tangram1](screenshots/cg-t05g08-tp2-2.png) 
Smoother Faces(2)

![Screenshot Tangram2](screenshots/cg-t05g08-tp2-3.png) 
Sharper Faces(3)
