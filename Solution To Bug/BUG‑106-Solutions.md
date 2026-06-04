# Solution for [BUG-106] Rendering issue during the 3D bike ride

## Root Cause
The Three.js scene was not fully loading all assets before rendering.  
Large models and textures were being requested during the ride, causing blank screens, missing objects, or flickering.  
Some devices (especially mobile) struggled with GPU load due to high‑resolution textures and unoptimised rendering settings.

## Fix
- Preload **all models, textures, and shaders** before starting the bike ride.
- Add a **loading screen** until all assets are fully ready.
- Reduce texture sizes for better performance on mobile devices.
- Ensure the renderer and camera **resize correctly** when the screen size changes.
- Optimise scene objects by reducing polygon count where possible.
- Enable Three.js performance settings like `antialias: false` on low-end devices.

## Code Suggestion
```js
Promise.all([
  loadModel('bike'),
  loadModel('road'),
  loadTextures(),
]).then(() => {
  startRide();
});
