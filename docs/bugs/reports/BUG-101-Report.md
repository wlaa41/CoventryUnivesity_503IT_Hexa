# BUG-101 — Background Music / Sound Effect Playback Issue

**Project:** Hexa Quiz (Cyber-Smart Gaming for Education)
**Module:** 503IT — Communication and Collaboration
**Document type:** Defect report
**Test type:** Manual exploratory testing
**Build under test:** `hexa-quiz-frontend` v1.0.0 (React + Vite)

---

| Field | Detail |
|-------|--------|
| **ID** | BUG-101 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Status** | Open |
| **Area** | Audio (Web Audio / background music) |
| **Environment** | Browser: _[e.g. Chrome 125]_ · OS: _[e.g. Windows 11 / iOS 17]_ · Build: v1.0.0 |

**Preconditions:** App loaded; first user gesture performed so audio context is unlocked.

**Steps to reproduce:**
1. Launch the game and tap/click once to unlock audio.
2. Navigate between scenes: portal → home screen → question screen → bike ride → results.
3. Observe background music and sound effects during and across scene transitions.
4. Adjust the volume slider while music is playing.

**Expected result:** Background music plays cleanly, loops without gaps, and the correct scene track starts and stops smoothly on each transition. Only one audio track plays at a time. The volume slider consistently controls the active audio instance.

**Actual result:** _[Describe exactly — e.g. "music does not start on the home screen", "audio cuts out after the bike ride", "two tracks play at once after a scene change", "volume slider has no effect", "audio keeps playing after leaving the screen", "music does not resume after returning from the bike ride".]_

**Evidence:** `evidence/bug-101-sound.*` _(screen recording with audio recommended)_

**Suggested fix / notes:**
- Create `AudioContext` once and reuse it across all scenes via a global audio manager.
- Stop all audio before loading a new scene to prevent overlapping tracks.
- Call `AudioContext.resume()` on the first user interaction for iOS/Android compatibility.
- Wire the volume slider to the shared gain node so it controls the active instance.

Related test cases: TC-G01–TC-G04.
