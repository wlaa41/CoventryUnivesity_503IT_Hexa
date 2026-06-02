# MINUTES OF MEETING
## Hexa Quiz — Cyber Security & Digital Safety Quiz Game
### Sprint 4 Review & Sprint 5 Planning Session

---

## 1. Meeting Details

| Field | Details |
|---|---|
| **Meeting Title** | Hexa Quiz — Sprint Review & Planning Meeting |
| **Date** | Tuesday, 2 June 2026 |
| **Time** | 09:13 AM (UTC) |
| **Location** | To be confirmed |
| **Facilitator / Leader** | Sijan Bhandari |
| **Project** | Hexa Quiz — Cyber Security & Digital Safety Quiz Game |
| **Minutes Taker** | Sijan Bhandari |
| **Sprint** | Agile Sprint 4 Review / Sprint 5 Planning |

---

## 2. Attendance

| Name | Role | Status |
|---|---|---|
| Sijan Bhandari | Team Leader / Facilitator | Present ✓ |
| John Jimee | Team Member | Present ✓ |
| Navin Sunar | Team Member | Present ✓ |
| Aditya | Team Member | ⚠️ Apology — Absent |
| Abdullah Badhur | Team Member | ⚠️ Apology — Absent |
| Sandesh Shah | Team Member | ⚠️ Apology — Absent |

> **Apologies Received:** Aditya, Abdullah Badhur, and Sandesh Shah were unable to attend this session and have formally submitted their apologies. Their absence has been recorded. The team acknowledges their commitments and welcomes their contribution in the upcoming sprint. All decisions and action items from this meeting will be shared with absent members.

---

## 3. Agenda

- Review of Hexa Quiz peer feedback report (Sprint 4)
- Discussion of project strengths and accomplishments
- Analysis of areas identified for improvement
- Sprint 5 next steps and action item assignment
- Planning for upcoming deliverables: code, presentation slides, and documentation
- Scheduling of next team meeting

---

## 4. Game Review — Peer Feedback Summary

The following review was submitted by Sijan Bhandari following the Sprint 4 demonstration of Hexa Quiz. The feedback has been reviewed and discussed by present team members. A full copy of the report is appended to these minutes.

### 4.1 Project Overview

Hexa Quiz is a browser-based educational quiz game designed to teach cyber security and digital safety awareness. It caters to three distinct age groups: Kids (CyberWorld Adventure), Teens (CyberCity Underground), and Adults (CyberOffice Intel). The project demonstrates strong team effort and a clear, purposeful concept.

### 4.2 Strengths Identified

- **Excellent UI Design & Visual Identity** — dark background with purple/blue gradient creates a professional 'cyber' aesthetic; each mode has a distinct and immersive visual theme.
- **Age-Appropriate Content Segmentation** — splitting the game into Kids, Teens, and Adults modes demonstrates strong product thinking, delivering the same core message in a resonant context for each audience.
- **Engaging Scenario-Based Questions** — real-life scenarios (e.g. 'Tommy is watching a funny cat video...') make learning more effective than abstract theory-based questions.
- **Difficulty Labelling** — displaying difficulty level per question is a strong UX touch; this could support adaptive difficulty paths in the future.
- **Voice Narration Feature** — demonstrates genuine accessibility thinking, particularly for the Kids Mode audience; this feature is absent from many polished commercial applications.
- **Progress Tracking** — 'Question 1 of 15' and topic tags reduce cognitive load and maintain player engagement throughout.

### 4.3 Areas for Improvement

- **Leaderboard Feature** — currently incomplete; a priority for Sprint 5 as it significantly boosts replayability, especially for the Teens audience.
- **Timer Bug** — mid-quiz countdown bug on certain browsers must be resolved before any public or assessed demo; full cross-browser testing required (Chrome, Firefox, Edge).
- **Image Load Performance** — high-resolution background images affect load times on slower connections; compression to WebP format and lazy loading of non-critical assets recommended.
- **Answer Feedback Screen** — it is unclear whether explanations are displayed post-answer; adding a 'Why is this correct?' card would reinforce educational value.
- **Mobile Responsiveness** — current layout appears desktop-first; Kids and Teens audiences are likely on tablets/phones; responsive layout testing on smaller viewports is essential.
- **Accessibility** — keyboard navigation, ARIA labels, and improved colour contrast on overlaid text (particularly on card thumbnails) should be addressed.

---

## 5. Overall Assessment

| Category | Rating | Score |
|---|---|---|
| Visual Design | ⭐⭐⭐⭐⭐ | **5.0 / 5** |
| Content Quality | ⭐⭐⭐⭐½ | **4.5 / 5** |
| User Experience | ⭐⭐⭐⭐ | **4.0 / 5** |
| Accessibility | ⭐⭐⭐ | **3.0 / 5** |
| Technical Stability | ⭐⭐⭐½ | **3.5 / 5** |
| Educational Value | ⭐⭐⭐⭐⭐ | **5.0 / 5** |
| **OVERALL** | *Strong work — clear scope for polished release* | **4.2 / 5** |

> **Overall Rating: 4.2 / 5** — Strong work with clear scope for a polished final release. The team should be proud of what has been built. With the leaderboard completed, the timer bug resolved, and performance optimisations applied, this will be a standout submission.

---

## 6. Next Steps — Sprint 5 Improvement Plan

Based on the feedback discussed, the following areas will be prioritised during Sprint 5. Improvements will be distributed across the following workstreams:

### 6.1 Code & Technical Development

- Fix the leaderboard feature — implement persistent score tracking and a display page
- Debug and resolve the countdown timer issue across all targeted browsers
- Optimise all background image assets (compress to WebP, implement lazy loading)
- Implement post-answer feedback/explanation cards for each question
- Ensure full mobile and tablet responsive design across all modes
- Add keyboard navigation, ARIA labels, and review colour contrast across all screens

### 6.2 Presentation Slides

- Prepare a professional final presentation deck covering: project overview, design decisions, technical implementation, accessibility features, and lessons learned
- Include screenshots and a live demonstration walkthrough
- Assign presentation roles to all team members (including those who were absent this session)

### 6.3 Documentation & Other Deliverables

- Write and finalise codebase documentation (README, setup guide, and contribution notes)
- Update project log / sprint retrospective report
- Ensure all team members review and contribute to final submission materials

---

## 7. Action Items

| # | Action Item | Owner | Priority | Due |
|---|---|---|---|---|
| 1 | Complete and deploy leaderboard feature | John Jimee / Navin Sunar | 🔴 HIGH | Sprint 5 |
| 2 | Resolve countdown timer bug — cross-browser testing (Chrome, Firefox, Edge) | Navin Sunar | 🔴 HIGH | Sprint 5 |
| 3 | Compress background images to WebP; implement lazy loading | John Jimee | 🟠 MEDIUM | Sprint 5 |
| 4 | Add 'Why is this correct?' explanation cards after each answer | Full Team | 🟠 MEDIUM | Sprint 5 |
| 5 | Implement full mobile/tablet responsive layout | Full Team | 🔴 HIGH | Sprint 5 |
| 6 | Add keyboard navigation, ARIA labels, and improve colour contrast | Sijan Bhandari | 🟠 MEDIUM | Sprint 5 |
| 7 | Write and submit codebase documentation | Full Team | 🟠 MEDIUM | Sprint 5 |
| 8 | Prepare and deliver final presentation slides | Sijan Bhandari | 🔴 HIGH | TBC |
| 9 | Schedule next team meeting and circulate agenda | Sijan Bhandari | 🟢 STANDARD | This Week |

---

## 8. Next Meeting

| Field | Details |
|---|---|
| **Date** | Tuesday, 2 June 2026 |
| **Time** | 2:00 PM |
| **Location** | TBC |
| **Agenda Items** | Sprint 5 progress check-in, code review, presentation rehearsal |

---

## 9. Sign-Off

These minutes were compiled following the meeting and are submitted for team review. Please notify the team leader if any corrections are required.

| | |
|---|---|
| **Minutes Prepared by:** | **Approved by:** |
| Sijan Bhandari | Sijan Bhandari |
| *Team Leader — HeXa Group* | *Team Leader — HeXa Group* |
| Date: 2 June 2026, 09:13 AM | Date: ______________________ |
| Signature: ___________________________ | Signature: ___________________________ |

---

*HeXa Group  |  Agile Sprint 4  |  2026  |  Confidential*
