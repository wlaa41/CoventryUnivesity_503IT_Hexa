# BUG-105 — Visuals Could Be More Realistic (Enhancement)

**Project:** Hexa Quiz (Cyber-Smart Gaming for Education)
**Module:** 503IT — Communication and Collaboration
**Document type:** Defect report (enhancement / UX polish)
**Test type:** Manual exploratory testing
**Build under test:** `hexa-quiz-frontend` v1.0.0 (React + Vite)

---

| Field | Detail |
|-------|--------|
| **ID** | BUG-105 |
| **Severity** | Low |
| **Priority** | P3 |
| **Status** | Open |
| **Area** | Realism / UX polish (bike ride and overall 3D environment) |
| **Environment** | Browser: _[e.g. Chrome 125]_ · OS: _[e.g. Windows 11]_ · Device: _[desktop / mobile]_ · Build: v1.0.0 |

**Preconditions:** App loaded.

**Steps to reproduce:**
1. Play through a question and enter the 20-second bike reward ride.
2. Observe the 3D environment — the bike, road, buildings, pedestrians, lighting, and overall atmosphere.
3. Compare the visual quality to the engagement level expected for the target audience.

**Expected result:** The 3D environment is visually engaging and immersive enough to motivate the target audience (kids, teens, adults) to continue playing, in line with the client's goal of an educational game.

**Actual result:** _[Describe — e.g. "3D models look flat or placeholder-like", "lighting is flat with no shadows or depth", "the environment feels empty with few details", "movement feels robotic or unnatural", "colours and textures look basic", "the scene lacks atmosphere or life".]_

**Evidence:** `evidence/bug-105-realism.*`

**Suggested fix / notes:**
This is an enhancement item, not a functional fault. Suggested improvements:
- Add **ambient and directional lighting** to create depth and realism.
- Improve **textures** for the road, buildings, bike, and environment props.
- Add **simple shadows** using `light.castShadow = true` to ground objects in the scene.
- Introduce small environmental details (trees, signs, fences, grass patches) to reduce emptiness.
- Smooth out **camera movement** for a more natural feel.
- Optimise all added assets to keep performance fast, especially on mobile.

These improvements should be balanced against the README's goal of keeping the app lightweight.
_Recommended as a future enhancement; prioritise functional defects (BUG-101 to BUG-103) first._
