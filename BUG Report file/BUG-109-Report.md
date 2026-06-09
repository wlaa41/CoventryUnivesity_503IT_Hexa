# BUG-109 — No Background Music on Game Login Page

**Project:** Hexa Quiz (Cyber-Smart Gaming for Education)
**Module:** 503IT — Communication and Collaboration
**Document type:** Defect report
**Test type:** Manual exploratory testing
**Build under test:** `hexa-quiz-frontend` v1.0.0 (React + Vite)

---

| Field | Detail |
|-------|--------|
| **ID** | BUG-109 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Status** | Open |
| **Area** | Audio (background music — login / auth screen) |
| **Environment** | Browser: _[e.g. Chrome 125]_ · OS: _[e.g. Windows 11]_ · Device: _[desktop / mobile]_ · Build: v1.0.0 |

**Preconditions:** App loaded; login/auth screen is visible.

**Steps to reproduce:**
1. Launch the game.
2. Wait on the login/auth screen without interacting.
3. Listen for background music.
4. Also test: perform a click/tap (to satisfy browser autoplay policy) and observe whether music starts.

**Expected result:** Background music plays on the login page to create a welcoming atmosphere consistent with the rest of the game. Music should begin (or be ready to begin) on the first user interaction, in line with browser autoplay requirements.

**Actual result:** No background music plays on the login page. The screen is completely silent — there is no audio at all, even after clicking/tapping to unlock the audio context.

**Evidence:** `evidence/bug-109-login-music.*` _(screen recording with audio recommended)_

**Suggested fix / notes:**
- Check that the login/auth screen (`AuthScreen.jsx`) initialises and triggers the background audio track on mount or on the first user interaction.
- Ensure the global audio manager (see BUG-101) is wired up to the login screen the same way it is for other screens.
- Call `AudioContext.resume()` on the first click/tap event on the login screen to satisfy browser autoplay policy.
- Confirm the correct audio track is assigned to the login scene and that it does not depend on a later scene to initialise first.

Related bug: BUG-101 (general audio playback issue). Related file: `hexa-quiz/src/components/AuthScreen.jsx`.
