# BUG-109 Solution — Background Music on Login Page

**Bug ID:** BUG-109
**File Fixed:** `hexa-quiz/src/components/AuthScreen.jsx`
**Status:** Resolved

---

## What Was the Problem?

When you first open the Hexa Quiz game and land on the login screen, there was **complete silence** — no background music at all. Even after clicking or tapping on the screen, nothing played.

Every other screen in the game had music. The quiz screen played ambient background tones while you answered questions. But the login screen — the very first thing a player sees — was completely dead silent. That is what BUG-109 is about.

---

## Why Did It Happen?

The game has a built-in audio system called `HexaAudio` (inside `AudioContext.jsx`). It generates background music using sound waves — no audio files needed, just code producing tones. Every screen that plays music connects to this system and tells it when to start and stop.

Here is how the **quiz screen** (`GameScreen.jsx`) correctly connects to the audio system:

```js
// Step 1 — connect to the audio system
const { audio } = useAudio();

// Step 2 — start music when the screen loads, stop when it leaves
useEffect(() => {
  audio.startBg(mode);
  return () => audio.stopBg();
}, []);
```

Now look at what the **login screen** (`AuthScreen.jsx`) was doing before the fix:

```js
// Only this was imported — no audio connection at all
import { useAuth } from "../contexts/AuthContext";
```

That's the entire problem. The login screen was **never connected to the audio system**. No import, no call, nothing. The music player existed and worked perfectly — the login screen just had no idea it was there.

---

## Simple Way to Think About It

Picture the audio system as a **speaker sitting in the hallway**. Every room in the game has a **light switch** connected to it — flip the switch when you enter, music starts; flip it when you leave, music stops.

The quiz room has a switch. The results room has a switch. But whoever built the login room **forgot to install a switch**. The speaker was always there, always ready — the login room just had no way to turn it on.

The fix is simply **installing that switch**.

---

## One More Thing — The Browser Rule

Browsers have a rule that **blocks sound from playing automatically** until the user actually clicks or interacts with the page. This is a browser-level protection to stop websites from blasting audio at people unexpectedly.

The audio system already handles this internally — calling `audio._init()` creates the audio engine and wakes it up. We just needed to call it on the first click anywhere on the login screen so the browser gives permission for sound to play.

---

## The Fix — Step by Step

Only **3 lines were added** to `AuthScreen.jsx`. Nothing else was changed.

### Step 1 — Import the audio system

```js
// BEFORE (broken)
import { useAuth } from "../contexts/AuthContext";

// AFTER (fixed) — added one import
import { useAuth } from "../contexts/AuthContext";
import { useAudio } from "../contexts/AudioContext"; // ← ADD THIS
```

This gives the login screen access to the same audio system every other screen uses.

---

### Step 2 — Connect to audio and start music on load

```js
// BEFORE (broken) — no audio connection
export default function AuthScreen({ onAuth }) {
  const { login, signup, playAsGuest } = useAuth();

// AFTER (fixed) — added two lines
export default function AuthScreen({ onAuth }) {
  const { login, signup, playAsGuest } = useAuth();
  const { audio } = useAudio(); // ← ADD THIS

  useEffect(() => {
    audio.startBg("adults"); // ← ADD THIS — starts calm ambient music
    return () => audio.stopBg(); // stops music cleanly when leaving the screen
  }, []);
```

The `useEffect` with empty `[]` runs exactly once when the screen loads — perfect timing to start the music. The `return` line is a cleanup function that stops the music when the player navigates away, so it doesn't overlap with the next screen's music.

---

### Step 3 — Unlock audio on first click

```jsx
// BEFORE (broken)
<div className="auth-screen screen scanlines">

// AFTER (fixed) — added onClick
<div className="auth-screen screen scanlines" onClick={() => audio._init()}>
```

Adding `onClick` to the outermost wrapper `div` means the very first thing a player clicks — a button, an input field, anywhere on screen — will wake up the browser's audio engine. The player doesn't need to do anything special; it just works naturally with whatever they click first.

---

## Full Picture — Before vs After

**Before (broken):**
```jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
// ❌ No audio import
// ❌ No audio hook
// ❌ No startBg() call
// ❌ No onClick handler

export default function AuthScreen({ onAuth }) {
  const { login, signup, playAsGuest } = useAuth();
  // ... rest of component
  return (
    <div className="auth-screen screen scanlines"> {/* ❌ no onClick */}
```

**After (fixed):**
```jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAudio } from "../contexts/AudioContext"; // ✅ added

export default function AuthScreen({ onAuth }) {
  const { login, signup, playAsGuest } = useAuth();
  const { audio } = useAudio(); // ✅ added

  useEffect(() => {          // ✅ added
    audio.startBg("adults");
    return () => audio.stopBg();
  }, []);

  // ... rest of component unchanged ...

  return (
    <div className="auth-screen screen scanlines" onClick={() => audio._init()}> {/* ✅ added */}
```

---

## Why `"adults"` Mode?

The `startBg()` method accepts three modes: `"kids"`, `"teens"`, and `"adults"`. Each plays a different musical pattern — kids is bright and fast, teens is mid-tempo, adults is slow and calm. Since the login screen doesn't know which age group will be playing yet, `"adults"` was chosen because it produces the most neutral and welcoming ambient tone. This can be changed to any mode the team prefers.

---

## Checklist

- [x] `useAudio` imported in `AuthScreen.jsx`
- [x] `audio.startBg()` called on component mount
- [x] `audio.stopBg()` called on component unmount (no music overlap)
- [x] `audio._init()` called on first user click (satisfies browser autoplay policy)
- [x] No new files or dependencies required — uses the existing `HexaAudio` system
- [ ] Test in Chrome, Firefox, Safari, and mobile (browser autoplay rules vary slightly)

---

*Solution for BUG-109. See `BUG Report file/BUG-109-Report.md` for the original defect report.*
