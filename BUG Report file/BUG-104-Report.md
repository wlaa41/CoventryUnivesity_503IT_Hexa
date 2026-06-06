# BUG-104 — Narration Voice Needs Changing (Usability)

**Project:** Hexa Quiz (Cyber-Smart Gaming for Education)
**Module:** 503IT — Communication and Collaboration
**Document type:** Defect report (usability / enhancement)
**Test type:** Manual exploratory testing
**Build under test:** `hexa-quiz-frontend` v1.0.0 (React + Vite)

---

| Field | Detail |
|-------|--------|
| **ID** | BUG-104 |
| **Severity** | Low |
| **Priority** | P3 |
| **Status** | Open |
| **Area** | Audio / UX (browser SpeechSynthesis narration) |
| **Environment** | Browser: _[e.g. Chrome 125 / Firefox 126 / Safari 17]_ · OS: _[e.g. Windows 11 / macOS 14 / iOS 17]_ · Build: v1.0.0 |

**Preconditions:** Narration is enabled; a question screen is reached.

**Steps to reproduce:**
1. Start a quiz in the Kids Academy track (most critical, as the voice must be age-appropriate).
2. Listen to the narration of the question text, the four answer options, and the feedback message.
3. Repeat on a different browser (e.g. Chrome vs Firefox vs Safari) to compare voices.

**Expected result:** The narration voice is clear, natural, and age-appropriate — especially for the Kids Academy track. The voice sounds consistent and pleasant across all supported browsers.

**Actual result:** _[Describe — e.g. "the default voice sounds robotic and hard to understand", "narration speed is too fast for younger users", "the voice does not suit the Kids track (sounds adult and flat)", "the voice changes noticeably between Chrome and Firefox", "the narration mispronounces quiz terms".]_

**Evidence:** `evidence/bug-104-voice.*` _(audio recording recommended)_

**Suggested fix / notes:**
This is a usability enhancement rather than a functional fault.
- Programmatically select a clearer, more natural `SpeechSynthesis` voice (e.g. Google UK English Female where available).
- Reduce the narration rate slightly (e.g. `utterance.rate = 0.9`) for better clarity with younger audiences.
- Adjust pitch and volume for a natural tone.
- Add a **voice selector** in the settings menu so users can choose their preferred voice.
- Provide a **mute narration** option for accessibility and user comfort.

Related test case: TC-D05. _Recommended as a usability improvement._
