# CG 2025/2026

## Group T05G08

## TP 1 Notes

- In exercise 1.1 we created the `MyTriangle` class following the `MyDiamond` example, defining a right triangle. We observed that vertex order (counter-clockwise) is critical for the face to be visible due to back-face culling.
- In exercise 1.2 we added two checkboxes to `MyInterface` to toggle the visibility of the diamond and the triangle independently, by binding boolean flags in `MyScene` to `dat.GUI` controls.
- In exercise 1.3 we created `MyParallelogram` with a leftmost vertex at the origin. To make it double-sided we duplicated the indices in reverse winding order, since setting would otherwise hide one side.
- In exercise 1.4 we added a third checkbox to control the visibility of the parallelogram, following the same pattern used for the diamond and triangle.

![Screenshot 1](screenshots/cg-t0xgxx-tp1-n.png)
![Screenshot 2](screenshots/cg-t05g08-tp1-1.png)
![Screenshot 3](screenshots/cg-t05g08-tp1-2.png)