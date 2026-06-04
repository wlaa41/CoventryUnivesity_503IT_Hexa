# Solution for [BUG-103] Animation glitch / stutter

## Root Cause
Animations were tied directly to the device frame rate instead of using delta time.  
This caused stuttering, inconsistent speed, and frame jumps — especially on lower‑end devices or when switching scenes.  
Heavy assets and unnecessary re-renders also contributed to performance drops.

## Fix
- Use `requestAnimationFrame` with **delta time** to ensure smooth, consistent animation.
- Preload all animation assets before starting the animation sequence.
- Reduce unnecessary re-renders during transitions.
- Optimise the bike ride animation loop to avoid blocking the main thread.
- Compress or optimise large textures and models.

## Code Suggestion
```js
const delta = clock.getDelta();
mixer.update(delta);
