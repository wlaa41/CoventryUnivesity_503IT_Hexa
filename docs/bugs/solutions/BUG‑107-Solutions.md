# Solution for [BUG-107] Cursor freezes / gets stuck during the game

## Root Cause
The cursor freeze was caused by pointer events being blocked by an invisible overlay or UI element.  
In some cases, the canvas was not updating pointer lock correctly, causing the mouse to stop responding.  
Event listeners were also interfering with each other, preventing normal mouse movement and clicks.

## Fix
- Remove or disable hidden overlays that capture pointer events.
- Ensure pointer lock is **requested and released correctly** during gameplay.
- Add fallback support for mobile touch events.
- Fix event listeners that stop propagation or block default behaviour.
- Improve input handling during the bike ride to avoid locking the cursor unintentionally.

## Code Suggestion
```js
canvas.requestPointerLock();
// ...
document.exitPointerLock();
