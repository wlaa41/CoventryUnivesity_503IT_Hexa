# BUG-106 — Rendering Issue During the 3D Bike Ride

**Project:** Hexa Quiz (Cyber-Smart Gaming for Education)
**Module:** 503IT — Communication and Collaboration
**Document type:** Defect report
**Test type:** Manual exploratory testing
**Build under test:** `hexa-quiz-frontend` v1.0.0 (React + Vite)

---

| Field | Detail |
|-------|--------|
| **ID** | BUG-106 |
| **Severity** | High |
| **Priority** | P1 |
| **Status** | Open |
| **Area** | Rendering (Three.js bike reward ride) |
| **Environment** | Browser: _[e.g. Chrome 125]_ · OS: _[e.g. Windows 11]_ · GPU: _[if known]_ · Device: _[desktop / mobile]_ · Build: v1.0.0 |

**Preconditions:** App loaded; a question answered so the 20-second bike ride is triggered.

**Steps to reproduce:**
1. Launch the game and start a quiz in any track.
2. Answer a question to trigger the bike reward ride.
3. Observe how the 3D scene renders during the 20-second ride.
4. Repeat on a mobile device or lower-end hardware to check for device-specific degradation.

**Expected result:** The 3D bike ride renders correctly and fully. The bike, road, footpaths, houses, pedestrians, collectibles, and obstacles all appear and update smoothly for the full 20 seconds on both desktop and mobile devices.

**Actual result:** _[Describe exactly — e.g. "the scene renders black or blank", "models are missing or appear as flat shapes", "textures fail to load", "the scene flickers or tears", "objects disappear or appear in the wrong location", "the canvas shows nothing / white box", "performance is severely degraded on mobile".]_

**Evidence:** `evidence/bug-106-render.*` _(screen recording strongly recommended)_

**Suggested fix / notes:**
- Preload **all models, textures, and shaders** using `Promise.all()` before starting the ride, then call `startRide()` only once everything is ready.
- Add a **loading screen** that blocks the ride from starting until all assets are fully loaded.
- Reduce texture resolution for mobile devices to keep GPU load manageable.
- Ensure the renderer and camera **resize correctly** on window resize events.
- Reduce polygon count on scene objects where possible.
- Enable Three.js performance settings (e.g. `antialias: false`) conditionally on low-end devices.
- Add a graceful fallback message if WebGL is unavailable.

Related test cases: TC-17, TC-21.

> **Why High / P1:** A blank or broken 3D scene removes a core part of the reward experience and can make the game feel broken to the user.
