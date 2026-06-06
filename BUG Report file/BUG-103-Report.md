# BUG-103 — Animation Glitch / Stutter

**Project:** Hexa Quiz (Cyber-Smart Gaming for Education)
**Module:** 503IT — Communication and Collaboration
**Document type:** Defect report
**Test type:** Manual exploratory testing
**Build under test:** `hexa-quiz-frontend` v1.0.0 (React + Vite)

---

| Field | Detail |
|-------|--------|
| **ID** | BUG-103 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Status** | Open |
| **Area** | Animation (logo intro, screen transitions, Three.js bike ride) |
| **Environment** | Browser: _[e.g. Chrome 125]_ · OS: _[e.g. Windows 11]_ · Device: _[desktop / mobile]_ · Build: v1.0.0 |

**Preconditions:** App loaded.

**Steps to reproduce:**
1. Launch the game and watch the 5-second logo intro animation.
2. Trigger a screen transition (e.g. portal → home screen).
3. Answer a question to start the 20-second bike reward ride.
4. Observe the smoothness of animations throughout, particularly on lower-end devices.

**Expected result:** All animations run smoothly with no stutter, tearing, or frozen frames. The logo intro completes cleanly. Screen transitions are fluid. The bike ride and all its elements (road, houses, pedestrians, collectibles) animate at a consistent speed regardless of the device frame rate.

**Actual result:** _[Describe — e.g. "logo animation stutters or jumps", "scene transition flickers or tears", "bike ride drops frames / lags", "animation speed varies with device performance", "an element freezes mid-animation", "animation does not reset correctly between questions", "frame jumps occur on lower-end hardware".]_

**Evidence:** `evidence/bug-103-animation.*` _(screen recording recommended)_

**Suggested fix / notes:**
- Replace frame-rate-dependent animation logic with `requestAnimationFrame` using **delta time** so speed is consistent across devices.
- Preload all animation assets before starting the sequence.
- Reduce unnecessary re-renders during scene transitions.
- Optimise the bike ride animation loop to avoid blocking the main thread.
- Compress or optimise large textures and 3D models.

Related test cases: TC-A01, TC-F01–TC-F07.
