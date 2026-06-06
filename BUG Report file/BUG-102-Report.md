# BUG-102 — Background Visual Rendering Issue

**Project:** Hexa Quiz (Cyber-Smart Gaming for Education)
**Module:** 503IT — Communication and Collaboration
**Document type:** Defect report
**Test type:** Manual exploratory testing
**Build under test:** `hexa-quiz-frontend` v1.0.0 (React + Vite)

---

| Field | Detail |
|-------|--------|
| **ID** | BUG-102 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Status** | Open |
| **Area** | Visual / UI background |
| **Environment** | Browser: _[e.g. Chrome 125]_ · OS: _[e.g. Windows 11]_ · Screen size: _[e.g. 1920×1080 / 375×812]_ · Build: v1.0.0 |

**Preconditions:** App loaded; navigate to the affected screen(s).

**Steps to reproduce:**
1. Launch the game.
2. Navigate to _[screen where the issue occurs — e.g. home screen / question screen / bike ride]_.
3. Observe the background image and layering.
4. Switch theme (if applicable) and observe whether the background updates.
5. Resize the browser window or test on a smaller screen and observe the background.

**Expected result:** The background image renders correctly, fills the entire screen, stays behind all UI content, and updates consistently when the theme is changed. It scales correctly across all screen sizes and devices.

**Actual result:** _[Describe — e.g. "background image does not load / shows blank", "background overlaps text or buttons (z-index issue)", "background does not resize on mobile", "background flickers during transitions", "wrong background image appears after switching theme", "a white or black gap appears at screen edges".]_

**Evidence:** `evidence/bug-102-background.png`

**Suggested fix / notes:**
- Set a dedicated background layer with `position: absolute`, `z-index: -1`, and `background-size: cover`.
- Ensure the theme switching logic updates the background image for all screens.
- Add responsive CSS (`width: 100vw; height: 100vh`) for full coverage at any screen size.

Related test cases: TC-H01–TC-H04.
