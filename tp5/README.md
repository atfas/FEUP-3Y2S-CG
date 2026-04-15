# CG 2025/2026

## Group T05G08

## TP 5 Notes

---

### Exercise 2: Shaders – Water Effect on Plane

#### Description

This exercise consists of creating two GLSL shaders (`water.vert` and `water.frag`) 
based on the existing `texture2.vert` and `texture2.frag` examples, and using them 
to simulate an animated water surface on the `MyPlane` object.


#### 1. Creating and Registering the Water Shaders

Two new shader files were created (`water.vert` and `water.frag`) based on 
`texture2.vert` and `texture2.frag`. They were registered in `ShaderScene.js` 
by adding a new entry to the `testShaders` array and exposing it in the 
`shadersList` object so it appears in the dat.GUI interface under the name 
**"Water"**.

The shader uses two texture samplers:
| Uniform | Texture Unit | Texture |
|---|---|---|
| `uSampler` | 0 | `waterTex.jpg` |
| `uSampler2` | 1 | `waterMap.jpg` |



#### 2. Replacing Textures and Dark Patches Effect

The default scene textures (`texture.jpg` and `FEUP.jpg`) are swapped for 
`waterTex.jpg` and `waterMap.jpg` when the Water shader is active. This is 
handled in the `display()` method of `ShaderScene.js`:

```js
if (this.selectedExampleShader == 11) {
    this.appearance.setTexture(this.waterTexture);
    this.waterMap.bind(1);
} else {
    this.appearance.setTexture(this.texture);
    this.texture2.bind(1);
}
```

In the fragment shader, regions where the blue channel of `waterMap.jpg` 
exceeds 0.5 are darkened by multiplying the water texture color by a factor 
of `0.8`, producing a darker water tone instead of a fixed color:

```glsl
if (filter.b > 0.5)
    color = color * 0.4;
```


#### 3. Height Map Displacement in the Vertex Shader

The vertex shader was modified to use `waterMap.jpg` as a **height map**. 
Each vertex is displaced along its normal by an amount proportional to the 
red channel of the map texture sampled at that vertex's texture coordinates:

```glsl
vec4 heightMap = texture2D(uSampler2, vTextureCoord);
float height = heightMap.r;
vec3 displacedPosition = aVertexPosition + aVertexNormal * height * normScale * 0.01;
```

The `normScale` uniform (controlled by the interface slider) allows real-time 
adjustment of the displacement intensity. The `MyPlane` object is initialized 
with 50 divisions to provide sufficient vertex resolution for a smooth effect.


#### 4. Animation via timeFactor

Both shaders use the `timeFactor` uniform (updated every 50ms in `update()`) 
to scroll the texture coordinates over time, simulating flowing water. The two 
textures are scrolled at **different speeds and directions** to create a more 
natural, non-repetitive effect:

```glsl
// Vertex shader - drives height map movement
vTextureCoord = aTextureCoord + vec2(timeFactor * 0.01, timeFactor * 0.007);

// Fragment shader - two layers at different speeds
vec2 animCoord1 = vTextureCoord + vec2(timeFactor * 0.01,  timeFactor * 0.007);
vec2 animCoord2 = vTextureCoord + vec2(-timeFactor * 0.008, timeFactor * 0.005);
```

The result is a surface where the geometry undulates (vertex displacement) 
while the texture itself flows across it, producing a convincing animated 
water effect.

---

#### Biggest Difficulty

The main challenge was understanding that **vertex shaders can also sample 
textures** in WebGL/GLSL ES. Using the same `waterMap.jpg` in both the vertex 
shader (for geometry displacement) and the fragment shader (for color darkening) 
while keeping them animated independently required careful management of the 
`timeFactor` uniform across both shader stages.

Final Result:

![Water Shader](screenshots/cg-t05g08-tp5-3.png)