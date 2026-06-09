# Solution for [BUG-101] Background music / sound playback issue

## Root Cause
Audio context not unlocked properly on mobile; scene transitions create multiple audio instances or stop the current track.

## Fix
- Ensure `AudioContext` is created once and reused across all scenes.
- Stop all audio before loading a new scene using a global audio manager.
- Add a `resume()` call on first user interaction for iOS/Android.
- Ensure volume slider updates the same audio instance.

## Code Suggestion
Use a global audio controller:
```js
window.audio = window.audio || new Audio();

