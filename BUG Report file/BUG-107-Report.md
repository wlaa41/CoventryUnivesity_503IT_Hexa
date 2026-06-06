# BUG-107 — Cursor Freezes / Gets Stuck During the Game

**Project:** Hexa Quiz (Cyber-Smart Gaming for Education)
**Module:** 503IT — Communication and Collaboration
**Document type:** Defect report
**Test type:** Manual exploratory testing
**Build under test:** `hexa-quiz-frontend` v1.0.0 (React + Vite)

---

| Field | Detail |
|-------|--------|
| **ID** | BUG-107 |
| **Severity** | High |
| **Priority** | P1 |
| **Status** | Open |
| **Area** | Input / controls (mouse / pointer events) |
| **Environment** | Browser: _[e.g. Chrome 125]_ · OS: _[e.g. Windows 11]_ · Build: v1.0.0 |

**Preconditions:** App loaded; playing through the game.

**Steps to reproduce:**
1. Launch the game and begin playing.
2. Navigate to _[state where the issue occurs — e.g. during the bike ride / on a question screen]_.
3. Continue interacting normally until the cursor stops responding.
4. Try to move the mouse and click on UI elements.

**Expected result:** The mouse cursor moves freely at all times and all clickable elements respond to clicks, so the player can always navigate, answer questions, and exit screens without interruption.

**Actual result:** The cursor freezes or becomes stuck — _[add detail: e.g. "it stops moving entirely", "it is locked in one position and clicks do nothing", "it only unfreezes after pressing Escape or clicking elsewhere", "it happens every time the bike ride starts", "touch input on mobile also stops working".]_

**Evidence:** `evidence/bug-107-cursor.*` _(screen recording recommended; the frozen cursor is best captured in video)_

**Suggested fix / notes:**
- Remove or disable any hidden overlays that unintentionally capture pointer events.
- Ensure pointer lock is **requested and released correctly** — call `document.exitPointerLock()` when the bike ride ends or the user pauses.
- Add fallback support for mobile touch events so touch input is not blocked.
- Review event listeners that call `stopPropagation()` or `preventDefault()` unnecessarily, as these can block normal mouse movement and clicks.
- Improve input handling during the bike ride to prevent unintentional cursor locking.

Related test cases: TC-18, TC-20.

> **Why High / P1:** A frozen cursor can completely block the player from continuing the game or answering questions, making the app unusable until the page is refreshed.
