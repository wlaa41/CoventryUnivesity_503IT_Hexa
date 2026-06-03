# Hexa Quiz — New Defects (BUG-106, BUG-107)

These two defects were found in a follow-up manual test session and should be added
to the main `BUG_REPORT.md`. Same standard format as the existing defects.

---

### BUG-106 — Rendering issue during the 3D bike ride

| Field | Detail |
|-------|--------|
| **ID** | BUG-106 |
| **Severity** | High |
| **Priority** | P1 |
| **Status** | Open |
| **Area** | Rendering (Three.js bike reward ride) |
| **Environment** | Browser: _[e.g. Chrome 125]_ · OS: _[e.g. Windows 11]_ · GPU: _[if known]_ · Build: v1.0.0 |

**Preconditions:** App loaded; a question resolved so the 20-second bike ride starts.

**Steps to reproduce:**
1. Launch the game and start a quiz in any track.
2. Answer a question to trigger the bike reward ride.
3. Observe how the 3D scene renders during the ride.

**Expected result:** The 3D bike ride renders correctly and fully — the bike, road,
footpaths, houses, pedestrians, collectibles, and obstacles all appear and update
smoothly for the full 20 seconds.

**Actual result:** _[Describe exactly what you saw — e.g. "the scene renders black /
blank", "models are missing or appear as flat shapes", "textures don't load",
"the scene flickers or tears", "objects disappear or render in the wrong place",
"the canvas does not display / shows nothing".]_

**Evidence:** `evidence/bug-106-render.*` _(screen recording strongly recommended)_

**Suggested fix / notes:** Check the Three.js renderer initialises correctly and the
canvas is sized to its container; confirm models/textures load before the scene
draws; check the browser console for WebGL or asset-loading errors; verify the scene
is disposed and re-created cleanly between rides. Add a graceful fallback message if
WebGL is unavailable. Related test cases: TC-17, TC-21.

---

### BUG-107 — Cursor freezes / gets stuck during the game

| Field | Detail |
|-------|--------|
| **ID** | BUG-107 |
| **Severity** | High |
| **Priority** | P1 |
| **Status** | Open |
| **Area** | Input / controls |
| **Environment** | Browser: _[e.g. Chrome 125]_ · OS: _[e.g. Windows 11]_ · Build: v1.0.0 |

**Preconditions:** App loaded; playing through the game.

**Steps to reproduce:**
1. Launch the game and begin playing _[state where it happens — e.g. during the bike
   ride / on a question screen]_.
2. Continue interacting until the cursor stops responding.
3. Try to move the mouse and click on buttons.

**Expected result:** The mouse cursor moves freely at all times and all clickable
elements respond, so the player can always navigate and answer.

**Actual result:** The cursor freezes / becomes stuck — _[add detail: e.g. "it stops
moving entirely", "it is stuck in one position and clicks do nothing", "it only
unfreezes after I click elsewhere / press a key / wait a few seconds", "it happens
every time during the bike ride".]_

**Evidence:** `evidence/bug-107-cursor.*` _(screen recording recommended; the frozen
cursor is best shown in a video)_

**Suggested fix / notes:** Likely caused by the game loop blocking the main thread,
or a pointer-lock / event handler not being released. Check whether the bike ride
uses pointer lock and releases it on pause/exit; profile the main thread for long
blocking frames; ensure `requestAnimationFrame` loops yield and are cancelled when a
screen unmounts. Reproduce across browsers to confirm scope. Related test cases:
TC-18, TC-20.

> **Why High / P1:** a frozen cursor can stop the player from continuing, and a
> failed 3D render removes a core part of the experience. Both can block normal play,
> so they are higher severity than the earlier polish/audio items.
