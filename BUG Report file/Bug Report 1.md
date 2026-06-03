# Hexa Quiz — QA Bug Report

**Project:** Hexa Quiz (Cyber-Smart Gaming for Education)
**Module:** 503IT — Communication and Collaboration
**Document type:** Defect report (individual QA contribution / portfolio evidence)
**Tester role:** QA / Test Engineer
**Test type:** Manual exploratory testing
**Build under test:** `hexa-quiz-frontend` v1.0.0 (React + Vite)
**Tracks covered:** Kids Academy, Teen Cybercity, Adult Intel (general pass)
**Date of test session:** _[fill in your test date]_
**Tester name:** _[your name]_

---

## 1. Summary

During a manual exploratory test session across all three game tracks, **5 defects**
were identified. They fall into three areas: audio/sound, visual/animation, and
overall realism. None of the defects fully block play, but they reduce the polish,
accessibility, and immersion of the game, which matters for an educational product
aimed at younger and more vulnerable users (per the client brief).

| Severity | Count |
|----------|-------|
| High | 0 |
| Medium | 3 |
| Low | 2 |
| **Total** | **5** |

### Severity & priority key

- **Severity** = technical impact on the product (Critical / High / Medium / Low).
- **Priority** = how soon it should be fixed (P1 highest → P3 lowest).
- **Status** = Open / In Progress / Fixed / Closed.

---

## 2. Defect summary table

| ID | Title | Area | Severity | Priority | Status |
|----|-------|------|----------|----------|--------|
| BUG-101 | Background music / sound effect playback issue | Audio | Medium | P2 | Open |
| BUG-102 | Background visual rendering issue | Visual | Medium | P2 | Open |
| BUG-103 | Animation glitch / stutter | Animation | Medium | P2 | Open |
| BUG-104 | Narration voice needs changing | Audio / UX | Low | P3 | Open |
| BUG-105 | Visuals/experience not realistic enough | Realism / UX | Low | P3 | Open |

---

## 3. Detailed defect reports

> Each defect below uses a standard industry format: ID, title, severity, priority,
> environment, preconditions, steps to reproduce, expected vs actual result,
> evidence, and a suggested fix. Replace the _[bracketed]_ placeholders with your
> exact observations and attach screenshots/recordings in the `/evidence` folder.

---

### BUG-101 — Background music / sound effect playback issue

| Field | Detail |
|-------|--------|
| **ID** | BUG-101 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Status** | Open |
| **Area** | Audio (procedural Web Audio soundtrack) |
| **Environment** | Browser: _[e.g. Chrome 125]_ · OS: _[e.g. Windows 11]_ · Build: v1.0.0 |

**Preconditions:** App loaded; first user gesture performed so audio is unlocked.

**Steps to reproduce:**
1. Launch the game and tap/click once to unlock audio.
2. Move between scenes (portal → home → question → bike ride → results).
3. Observe the background music / sound effects during and across these transitions.

**Expected result:** Background music plays cleanly, loops without gaps, and the
correct scene track starts/stops smoothly on each transition. Volume control affects
it consistently.

**Actual result:** _[Describe exactly what you heard — e.g. "music does not start on
the home screen", "audio cuts out / crackles after the bike ride", "two tracks play
at once", "volume slider does not lower the music", "sound keeps playing after
leaving the screen".]_

**Evidence:** `evidence/bug-101-sound.*` _(screen recording with audio recommended)_

**Suggested fix / notes:** Verify each scene correctly starts and stops its Web Audio
nodes on mount/unmount; ensure only one track plays at a time; confirm the volume
control is wired to a shared gain node. Related test cases: TC-G01–TC-G04.

---

### BUG-102 — Background visual rendering issue

| Field | Detail |
|-------|--------|
| **ID** | BUG-102 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Status** | Open |
| **Area** | Visual / UI background |
| **Environment** | Browser: _[…]_ · OS: _[…]_ · Screen size: _[e.g. 1920×1080]_ · Build: v1.0.0 |

**Preconditions:** App loaded; navigate to the affected screen(s).

**Steps to reproduce:**
1. Launch the game.
2. Navigate to _[screen where you saw it — e.g. portal / question screen / bike ride]_.
3. Observe the background.

**Expected result:** Background renders correctly, fills the screen, stays behind the
content, and is consistent across both dark and light themes and across screen sizes.

**Actual result:** _[Describe — e.g. "background image does not load / shows blank",
"background does not resize on mobile width", "background overlaps the text /
buttons", "background flickers", "wrong background shows for the theme".]_

**Evidence:** `evidence/bug-102-background.png`

**Suggested fix / notes:** Check CSS sizing (`background-size`, `100vw/100vh`),
z-index layering so content stays on top, and that both themes define a background.
Related test cases: TC-H01–TC-H04.

---

### BUG-103 — Animation glitch / stutter

| Field | Detail |
|-------|--------|
| **ID** | BUG-103 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Status** | Open |
| **Area** | Animation (logo intro, transitions, and/or Three.js bike ride) |
| **Environment** | Browser: _[…]_ · OS: _[…]_ · Build: v1.0.0 |

**Preconditions:** App loaded.

**Steps to reproduce:**
1. Launch the game and watch the 5-second logo intro.
2. Trigger a screen transition and/or start the 20-second bike reward ride.
3. Observe the animation smoothness.

**Expected result:** Animations run smoothly (no stutter, tearing, or frozen frames);
the intro completes cleanly; the bike ride and its objects (road, houses, pedestrians,
collectibles) animate fluidly.

**Actual result:** _[Describe — e.g. "logo blink animation stutters", "transition
jumps / flickers", "bike ride lags or drops frames", "an element does not animate /
freezes", "animation does not reset between questions".]_

**Evidence:** `evidence/bug-103-animation.*` _(screen recording recommended)_

**Suggested fix / notes:** Profile with browser dev tools (Performance tab) to find
dropped frames; ensure animation loops use `requestAnimationFrame` and are cancelled
on unmount; check that the Three.js scene is disposed/reset between rides. Related
test cases: TC-A01, TC-F01–TC-F07.

---

### BUG-104 — Narration voice needs changing

| Field | Detail |
|-------|--------|
| **ID** | BUG-104 |
| **Severity** | Low |
| **Priority** | P3 |
| **Status** | Open |
| **Area** | Audio / UX (browser speech narration) |
| **Environment** | Browser: _[…]_ · OS: _[…]_ · Build: v1.0.0 |

**Preconditions:** Narration enabled; reach a question screen.

**Steps to reproduce:**
1. Start a quiz in any track.
2. Listen to the narration of the question, the four answers, and the feedback.

**Expected result:** The narration voice is clear, age-appropriate, and pleasant —
especially important for the Kids Academy track and for accessibility.

**Actual result:** _[Describe — e.g. "default robotic voice is hard to understand",
"voice is too fast", "voice does not match the target age group", "voice is
inconsistent across browsers".]_

**Evidence:** `evidence/bug-104-voice.*`

**Suggested fix / notes:** This is an enhancement/usability item rather than a
functional fault. Allow selecting a clearer `SpeechSynthesis` voice, adjust rate/pitch,
and let the user pick or mute the voice. Consider testing voices available on the
target browsers. Related test case: TC-D05. _Recommended as a usability improvement._

---

### BUG-105 — Visuals/experience not realistic enough

| Field | Detail |
|-------|--------|
| **ID** | BUG-105 |
| **Severity** | Low |
| **Priority** | P3 |
| **Status** | Open |
| **Area** | Realism / UX polish (bike ride and overall presentation) |
| **Environment** | Browser: _[…]_ · OS: _[…]_ · Build: v1.0.0 |

**Preconditions:** App loaded.

**Steps to reproduce:**
1. Play through a question and enter the bike reward ride.
2. Observe the 3D environment (bike, road, houses, pedestrians) and overall game feel.

**Expected result:** Visuals are engaging and believable enough to keep the target
audience immersed, in line with the client's goal of an engaging educational game.

**Actual result:** _[Describe — e.g. "3D models look flat / placeholder", "movement
feels unnatural", "lighting/colours look basic", "environment feels empty".]_

**Evidence:** `evidence/bug-105-realism.*`

**Suggested fix / notes:** Enhancement, not a defect. Possible improvements: better
lighting/shadows in the Three.js scene, smoother camera, more detailed models or
textures, subtle motion/sound to increase immersion. Should be balanced against the
README's stated goal of keeping the app fast and lightweight. _Recommended as a
future enhancement; prioritise functional fixes first._

---

## 4. Tester recommendation

- **Fix first (P2):** BUG-101 (sound), BUG-102 (background), BUG-103 (animation) —
  these affect the core experience and accessibility.
- **Improve next (P3):** BUG-104 (voice) and BUG-105 (realism) are usability/polish
  enhancements that increase engagement but do not block functionality.
- **Re-test:** After fixes, re-run the affected test cases and update each defect's
  **Status** to *Fixed* → *Closed* once verified.

---

## 5. How to use this report (for the repo)

1. Save this file in your repository as `BUG_REPORT.md` (or under `/docs`).
2. Create an `/evidence` folder and add your screenshots/recordings using the
   filenames referenced above.
3. Fill in every _[bracketed]_ placeholder with your actual observations,
   environment, date, and name.
4. Optionally open one GitHub Issue per bug (BUG-101 … BUG-105) and link them here,
   which also gives you version-controlled evidence of your QA contribution for the
   503IT portfolio.

---

*Prepared as individual QA / Test Engineer contribution evidence. Manual exploratory
test session, all three tracks. Severities and priorities assigned by the tester.*
