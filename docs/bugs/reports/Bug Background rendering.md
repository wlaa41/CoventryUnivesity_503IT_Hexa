# GitHub Issues — ready to paste

Open one GitHub Issue per bug. Copy the **Title** into the issue title box and the
block under it into the description. Add the suggested **labels**, attach your
screenshot/recording, then click *Submit new issue*.

> Tip: replace every _[bracketed]_ part with your real observation before posting.
> Drag an image/video straight into the GitHub description box to attach evidence.

---

## Issue 1

**Title:** `[BUG-101] Background music / sound playback issue`

**Labels:** `bug`, `audio`, `priority: medium`

```
**Severity:** Medium  |  **Priority:** P2  |  **Area:** Audio

**Environment:** [Browser + version] / [OS] / build v1.0.0

**Steps to reproduce:**
1. Launch the game and tap once to unlock audio.
2. Move between scenes (portal → home → question → bike ride → results).
3. Listen to the background music / sound effects.

**Expected:** Music plays cleanly, loops without gaps, the right track starts/stops
on each screen, and the volume control affects it.

**Actual:** [Describe exactly what you heard — e.g. music does not start / cuts out /
two tracks overlap / volume slider has no effect / sound keeps playing after leaving.]

**Evidence:** [attach screen recording with sound]
```

---

## Issue 2

**Title:** `[BUG-102] Background rendering issue`

**Labels:** `bug`, `ui`, `priority: medium`

```
**Severity:** Medium  |  **Priority:** P2  |  **Area:** Visual / UI

**Environment:** [Browser + version] / [OS] / [screen size] / build v1.0.0

**Steps to reproduce:**
1. Launch the game.
2. Go to [screen where you saw it].
3. Look at the background.

**Expected:** Background renders correctly, sits behind the content, and is consistent
across both themes and different screen sizes.

**Actual:** [Describe — e.g. background does not load / overlaps text / flickers /
does not resize / wrong background for the theme.]

**Evidence:** [attach screenshot]
```

---

## Issue 3

**Title:** `[BUG-103] Animation glitch / stutter`

**Labels:** `bug`, `animation`, `priority: medium`

```
**Severity:** Medium  |  **Priority:** P2  |  **Area:** Animation

**Environment:** [Browser + version] / [OS] / build v1.0.0

**Steps to reproduce:**
1. Launch the game and watch the logo intro.
2. Trigger a screen transition and/or start the bike reward ride.
3. Watch the animation.

**Expected:** Animations are smooth — no stutter, tearing, or frozen frames; the
intro and bike ride animate fluidly.

**Actual:** [Describe — e.g. logo blink stutters / transition jumps / bike ride lags /
an element freezes / animation does not reset between questions.]

**Evidence:** [attach screen recording]
```

---

## Issue 4

**Title:** `[BUG-104] Narration voice needs changing (usability)`

**Labels:** `enhancement`, `audio`, `accessibility`, `priority: low`

```
**Severity:** Low  |  **Priority:** P3  |  **Area:** Audio / UX

**Environment:** [Browser + version] / [OS] / build v1.0.0

**Steps to reproduce:**
1. Start a quiz in any track with narration enabled.
2. Listen to the question, the four answers, and the feedback.

**Expected:** A clear, age-appropriate, pleasant narration voice (important for the
Kids track and for accessibility).

**Actual:** [Describe — e.g. default voice is robotic / too fast / not suitable for
the age group / inconsistent across browsers.]

**Suggested improvement:** Allow choosing a clearer SpeechSynthesis voice and adjust
rate/pitch; let the user pick or mute the voice.

**Evidence:** [attach recording]
```

---

## Issue 5

**Title:** `[BUG-105] Visuals could be more realistic (enhancement)`

**Labels:** `enhancement`, `graphics`, `priority: low`

```
**Severity:** Low  |  **Priority:** P3  |  **Area:** Realism / UX polish

**Environment:** [Browser + version] / [OS] / build v1.0.0

**Steps to reproduce:**
1. Play a question and enter the bike reward ride.
2. Observe the 3D environment and overall game feel.

**Expected:** Visuals engaging/believable enough to keep the target audience immersed.

**Actual:** [Describe — e.g. models look flat / movement feels unnatural / lighting
looks basic / environment feels empty.]

**Suggested improvement:** Better lighting/shadows, smoother camera, more detailed
models/textures — balanced against keeping the app lightweight.

**Evidence:** [attach screenshot/recording]
```

---

## Issue 6

**Title:** `[BUG-106] Rendering issue during the 3D bike ride`

**Labels:** `bug`, `rendering`, `3d`, `priority: high`

```
**Severity:** High  |  **Priority:** P1  |  **Area:** Rendering (Three.js bike ride)

**Environment:** [Browser + version] / [OS] / [GPU if known] / build v1.0.0

**Steps to reproduce:**
1. Start a quiz in any track.
2. Answer a question to trigger the bike reward ride.
3. Watch how the 3D scene renders.

**Expected:** The 3D scene renders fully and smoothly for the whole ride — bike, road,
houses, pedestrians, collectibles and obstacles all visible and updating.

**Actual:** [Describe — e.g. scene is black/blank / models missing / textures don't
load / scene flickers or tears / objects in wrong place / canvas shows nothing.]

**Evidence:** [attach screen recording]

**Note:** Can block a core part of the experience, so prioritised High/P1.
```

---

## Issue 7

**Title:** `[BUG-107] Cursor freezes / gets stuck during the game`

**Labels:** `bug`, `input`, `priority: high`

```
**Severity:** High  |  **Priority:** P1  |  **Area:** Input / controls

**Environment:** [Browser + version] / [OS] / build v1.0.0

**Steps to reproduce:**
1. Play the game [state where — e.g. during the bike ride / on a question screen].
2. Keep interacting until the cursor stops responding.
3. Try to move the mouse and click buttons.

**Expected:** The cursor moves freely at all times and all buttons respond.

**Actual:** Cursor freezes / gets stuck — [add detail: stops moving / stuck in one
spot and clicks do nothing / only unfreezes after clicking elsewhere or a key / 
happens every time during the bike ride].

**Evidence:** [attach screen recording]

**Note:** Can stop the player progressing, so prioritised High/P1.
```
