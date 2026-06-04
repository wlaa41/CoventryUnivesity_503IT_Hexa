# Solution for [BUG-105] Visuals could be more realistic (enhancement)

## Root Cause
The 3D environment uses low‑detail models, basic lighting, and minimal environmental elements.  
This makes the bike ride and question screens feel flat, empty, or less immersive.  
Shadows, textures, and camera movement are not fully optimised for realism.

## Fix
- Add **ambient + directional lighting** to create depth.
- Improve **textures** for buildings, road, bike, and environment props.
- Add **simple shadows** to make objects feel grounded.
- Introduce small environment elements (trees, signs, fences, grass patches).
- Smooth out **camera movement** to feel more natural.
- Optimise assets so performance stays fast on mobile.

## Code Suggestion
```js
const light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true;
scene.add(light);
