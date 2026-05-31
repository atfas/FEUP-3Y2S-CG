# CG Final Project 2025/2026

**Computação Gráfica / Computer Graphics - L.EIC, 3rd year**
**Class T5 · Group 8**

---

## Group Members

| Name | Student Number |
|------|---------------|
| Afonso Tavares Fernandes de Almeida Saraiva | 202304461 |
| Pedro Manuel Pinto Coelho | 202306714 |

---

## Scene Description

A fully interactive **prairie survival game** built with WebCGF and WebGL.

You are the driver of a covered prairie schooner wagon. Your health drains every second - the only way to survive is to race across the open prairie, collect scattered hay bales, and deliver them to the barn before your HP hits zero. Rocks will damage your wagon on impact. The longer you survive, the higher your score.

---

## Implemented Features

### Sky & Environment *(Advanced)*
- Sky hemisphere with two independently animated texture layers moving at different speeds and directions, creating a parallax cloud effect
- Cloud map drives per-vertex geometry displacement on the sphere in addition to the texture blend
- Cloud shadowing: fragments under thick clouds are darkened automatically based on the cloud mask
- Sun rendered as a directional disk; configurable elevation and azimuth angle via GUI
- Directional light position tied to sun angle, updating in real-time

<p align="center">
  <img src="screenshots/project-t5g8-6.png" width="49%"/>
  <img src="screenshots/project-t5g8-7.png" width="49%"/>
</p>

### Terrain & Ground *(Advanced)*
- Heightmap terrain with per-vertex normals computed via finite differences for correct hill lighting
- Procedural mountain ring at terrain edges via smoothstep, with high-frequency heightmap noise for jagged peaks
- Path automatically suppressed on mountain slopes via edge factor passed from vertex to fragment shader
- 3-way texture blend: grass base + path texture masked by path mask, all in a single pass

<p align="center">
  <img src="screenshots/project-t5g8-8.png" width="49%"/>
  <img src="screenshots/project-t5g8-9.png" width="49%"/>
</p>


### Scatter Elements *(Advanced)*
- Randomised rock placement across the prairie, configurable count via GUI
- Procedural vertex displacement: per-vertex 3D value noise with a unique seed per rock produces naturally irregular, never-repeated silhouettes
- 4 rock colour variants (natural, warm orange, dark grey, greenish) selected via shader tint uniform
- Per-fragment diffuse lighting based on real-time sun direction

<p align="center">
  <img src="screenshots/project-t5g8-10.png" width="49%"/>
  <img src="screenshots/project-t5g8-11.png" width="49%"/>
</p>

### Flora
- Parametric flower system: each flower has randomised colour, scale, rotation, and position
- Hundreds of flowers scattered naturally across the terrain
- Distance-based culling for performance

<p align="center">
  <img src="screenshots/project-t5g8-12.png" width="49%"/>
  <img src="screenshots/project-t5g8-13.png" width="49%"/>
</p>


### Grass *(Advanced)*
- Dense live grass patches and dead/dry grass patches, independently configurable (count, height scale, clump spread) via GUI
- Dual-wave wind shader: primary wave + out-of-phase cross-wind gust for organic, non-repetitive movement
- Tip-weighted sway: displacement scales as height² so the base is fully anchored and the tip swings freely
- Per-blade ambient occlusion: base of each blade darkened procedurally for depth
- Single shader handles both live (green) and dead (straw) grass via `uDeadGrass` uniform - no extra draw calls

<p align="center">
  <img src="screenshots/project-t5g8-14.png" width="49%"/>
  <img src="screenshots/project-t5g8-15.png" width="49%"/>
</p>

### Covered Wagon (Prairie Schooner) *(Advanced)*
- Full hierarchical model: wooden bed, front tongue, 4 wheels, canvas cover
- Wheel rotation animation tied to wagon speed
- Front wheel axis rotates on pivot point when turning (steering animation)
- Imported horse model (OBJ format) attached to the front tongue
- Canvas cover shader: procedural quadratic sag between ribs simulates fabric droop, with analytically derived normals for physically correct lighting on the curved surface
- Alternating cream/blue stripe pattern on canvas computed purely from UV coordinates in the fragment shader - no texture needed

<p align="center">
  <img src="screenshots/project-t5g8-17.png" width="49%"/>
  <img src="screenshots/project-t5g8-16.png" width="49%"/>
</p>

### Barn
- Barn walls with wood plank texture, prism roof with dark wood texture
- Front facade texture mimicking windows and doors
- Circular interaction ring in front of the barn, changes colour (grey → green) when the wagon enters it

<p align="center">
  <img src="screenshots/project-t5g8-18.png" width="49%"/>
  <img src="screenshots/project-t5g8-19.png" width="49%"/>
</p>

### Game Mechanics
- HP drains 1 HP/second once the wagon starts moving
- Rock collisions deal 5–15 random damage with cooldown to prevent repeated hits
- Wagon carries up to 2 hay bales at a time; delivering them to the barn restores HP
- When all bales on the field are collected, a new batch respawns automatically
- Animated arrows float above hay bales - sinusoidal vertical bob with synchronised colour pulse - to pinpoint them across the prairie
- Game over alert shows final score when HP reaches zero

### Interface (dat.GUI + HUD)
- On-screen HUD: health bar with colour flash on damage, HP indicator, score, and bale count
- dat.GUI panel: live HP, instantaneous damage, instantaneous heal, carried bales, bales dropped, score
- Full display toggle panel for every scene element
- Grass, flora, and sky controls all exposed and adjustable at runtime via GUI
- Debug mode: hitbox overlay, render range slider, per-object normal visualisation


## Screenshots

### Overview
![Overview](./screenshots/project-t5g8-1.png)

### Flora detail
![Flora detail](./screenshots/project-t5g8-2.png)

### Wagon close-up
![Wagon close-up](./screenshots/project-t5g8-3.png)

### Barn close-up
![Barn close-up](./screenshots/project-t5g8-5.png)

### Shader animation
![Shader animation](./screenshots/project-t5g8-4.gif)

---

## How to Run

### VS Code Live Server *(easiest)*
1. Install the **Live Server** extension in VS Code
2. Open the project folder in VS Code
3. Right-click `index.html` → **"Open with Live Server"**
4. The game opens automatically at `http://127.0.0.1:5500`

### Browser Requirements
- A modern browser with WebGL support: **Chrome**, **Firefox**, or **Edge** (latest versions)
- Hardware acceleration must be enabled (on by default on most systems)

---

## Keyboard Controls

| Key | Action |
|-----|--------|
| `W` | Accelerate wagon forward |
| `S` | Reduce speed |
| `A` | Steer left |
| `D` | Steer right |
| `P` | Pick up nearby hay bale |
| `L` | Drop off hay bales at barn |
---

## Implemented Features Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Sky hemisphere with inward normals | ✅ | |
| Animated dual cloud layer (parallax) | ✅ | **Advanced** |
| Cloud geometry displacement | ✅ | **Advanced** |
| Sun + real-time directional light | ✅ | |
| Terrain with heightmap displacement | ✅ | |
| Per-vertex terrain normals (finite differences) | ✅ | **Advanced** |
| Procedural mountain ring at terrain edges | ✅ | **Advanced** |
| Ground texture + path blending | ✅ | |
| Rocks with procedural vertex noise | ✅ | **Advanced** |
| 4 rock colour variants via shader | ✅ | **Advanced** |
| Parametric flowers | ✅ | |
| Dense + dead grass patches | ✅ | |
| Dual-wave wind grass shader | ✅ | **Advanced** |
| Per-blade ambient occlusion | ✅ | **Advanced** |
| Hierarchical wagon model | ✅ | |
| Wheel + steering animation | ✅ | |
| OBJ horse model | ✅ | |
| Canvas quadratic sag shader | ✅ | **Advanced** |
| Procedural canvas stripe pattern | ✅ | **Advanced** |
| Barn with textures | ✅ | |
| Barn interaction ring | ✅ | |
| Hay bale pick-up / drop-off | ✅ | |
| Animated arrows (bob + colour pulse) | ✅ | |
| HP system + time score | ✅ | |
| Rock collision damage | ✅ | |
| HUD (health bar, score, bales) | ✅ | |
| dat.GUI full controls | ✅ | |
| Camera follow wagon / free camera | ✅ | |

---

## Known Issues / Limitations

- The horse OBJ model is static (no skeletal animation)
- Terrain height is visual only - the wagon does not physically ride the hills
- Flowers are culled beyond render range (intentional, for performance)

---

## AI Use Declaration

AI assistance (Claude by Anthropic) was used during this project for:
- Helping structure and debug JavaScript controller and loader classes
- Reviewing shader logic and uniform passing patterns
- Deriving and validating shader mathematics (e.g. quadratic sag normals, noise functions, grass)
- Helping comment and document source code
- Helping improve README design and accuracy