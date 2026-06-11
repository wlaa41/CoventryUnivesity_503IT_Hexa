# BSc Computing Science Project — Professional Minutes of Meetings

**Coventry University, Dagenham, London**

## Meeting 6 of 13: Sprint 4 Review and Sprint 5 Planning

> **Team:** Sijan Bhandari · Johns Jimee · Abdhullah Badhurdeen · Aditya Bhandari · Sandesh Shah · Nabin Sunar

---

## Administrative Information

| Field               | Detail                                                       |
| ------------------- | ------------------------------------------------------------ |
| Meeting Number      | Meeting 6                                                    |
| Meeting Title       | Hexa Quiz — Sprint 4 Review and Sprint 5 Planning            |
| Date                | 2 June 2026                                                  |
| Time                | 09:13 AM (UTC)                                               |
| Location            | To be confirmed                                              |
| Chairperson         | Sijan Bhandari                                               |
| Minutes Prepared By | Sijan Bhandari                                               |
| Programme           | BSc Computing Science                                        |
| Institution         | Coventry University Dagenham, London                         |
| Module              | BSc Project / Dissertation                                   |
| Classification      | Confidential — Academic Use Only                             |

---

## Attendance Register

| Name                 | Role / Designation              | Programme             | Attendance |
| -------------------- | ------------------------------- | --------------------- | ---------- |
| Sijan Bhandari       | Project Lead / Chairperson      | BSc Computing Science | Present    |
| Johns Jimee          | Secretary / Technical Analyst / QA Engineer | BSc Computing Science | Present    |
| Abdhullah Badhurdeen | Lead Developer                  | BSc Computing Science | Present    |
| Aditya Bhandari      | Systems Architect / Planner     | BSc Computing Science | Present    |
| Sandesh Shah         | Research Associate              | BSc Computing Science | Present    |
| Nabin Sunar          | Implementation Support          | BSc Computing Science | Present    |

_All team members were present at this meeting._

---

## Meeting Objective

To review the Sprint 4 peer feedback report for Hexa Quiz, discuss the project's strengths and areas for improvement identified in the evaluation, and plan the Sprint 5 workstreams covering code, presentation, and documentation deliverables.

---

## Review of Previous Actions

Prior to this meeting, the team had completed Sprint 4 development activities. The peer feedback report submitted by Sijan Bhandari following the Sprint 4 demonstration was distributed and reviewed by all present members before the session began.

---

## Detailed Discussion and Proceedings

### 6.1 Game Overview — Hexa Quiz

Hexa Quiz is a browser-based educational quiz game designed to teach cyber security and digital safety awareness. It caters to three distinct age groups: Kids (CyberWorld Adventure), Teens (CyberCity Underground), and Adults (CyberOffice Intel). The project demonstrates strong team effort and a clear, purposeful concept.

### 6.2 Strengths Identified in Peer Feedback

The following strengths were highlighted in the Sprint 4 peer feedback review:

- **Excellent UI Design and Visual Identity** — dark background with purple/blue gradient creates a professional 'cyber' aesthetic; each mode has a distinct and immersive visual theme.
- **Age-Appropriate Content Segmentation** — splitting the game into Kids, Teens, and Adults modes demonstrates strong product thinking, delivering the same core message in a resonant context for each audience.
- **Engaging Scenario-Based Questions** — real-life scenarios (e.g. 'Tommy is watching a funny cat video...') make learning more effective than abstract theory-based questions.
- **Difficulty Labelling** — displaying difficulty level per question is a strong UX touch that could support adaptive difficulty paths in the future.
- **Voice Narration Feature** — demonstrates genuine accessibility thinking, particularly for the Kids Mode audience; this feature is absent from many polished commercial applications.
- **Progress Tracking** — 'Question 1 of 15' and topic tags reduce cognitive load and maintain player engagement throughout.

### 6.3 Areas for Improvement Identified in Peer Feedback

The following areas were identified for improvement:

- **Leaderboard Feature** — currently incomplete; a priority for Sprint 5 as it significantly boosts replayability, especially for the Teens audience.
- **Timer Bug** — mid-quiz countdown bug on certain browsers must be resolved before any public or assessed demo; full cross-browser testing required (Chrome, Firefox, Edge).
- **Image Load Performance** — high-resolution background images affect load times on slower connections; compression to WebP format and lazy loading of non-critical assets recommended.
- **Answer Feedback Screen** — it is unclear whether explanations are displayed post-answer; adding a 'Why is this correct?' card would reinforce educational value.
- **Mobile Responsiveness** — current layout appears desktop-first; Kids and Teens audiences are likely on tablets/phones; responsive layout testing on smaller viewports is essential.
- **Accessibility** — keyboard navigation, ARIA labels, and improved colour contrast on overlaid text should be addressed.

### 6.4 Overall Assessment

| Category            | Rating        | Score                                        |
| ------------------- | ------------- | -------------------------------------------- |
| Visual Design       | ⭐⭐⭐⭐⭐    | 5.0 / 5                                      |
| Content Quality     | ⭐⭐⭐⭐½    | 4.5 / 5                                      |
| User Experience     | ⭐⭐⭐⭐      | 4.0 / 5                                      |
| Accessibility       | ⭐⭐⭐        | 3.0 / 5                                      |
| Technical Stability | ⭐⭐⭐½      | 3.5 / 5                                      |
| Educational Value   | ⭐⭐⭐⭐⭐    | 5.0 / 5                                      |
| **Overall**         | *Strong work — clear scope for polished release* | **4.2 / 5** |

### 6.5 Sprint 5 Improvement Plan

Based on the feedback discussed, the following workstreams were agreed for Sprint 5:

**Code and Technical Development:**
- Fix the leaderboard feature — implement persistent score tracking and a display page
- Debug and resolve the countdown timer issue across all targeted browsers
- Optimise all background image assets (compress to WebP, implement lazy loading)
- Implement post-answer feedback/explanation cards for each question
- Ensure full mobile and tablet responsive design across all modes
- Add keyboard navigation, ARIA labels, and review colour contrast across all screens

**Presentation Slides:**
- Prepare a professional final presentation deck covering project overview, design decisions, technical implementation, accessibility features, and lessons learned
- Include screenshots and a live demonstration walkthrough
- Assign presentation roles to all team members (including those who were absent this session)

**Documentation and Other Deliverables:**
- Write and finalise codebase documentation (README, setup guide, and contribution notes)
- Update project log and sprint retrospective report
- Ensure all team members review and contribute to final submission materials

---

## Academic and Research Considerations

The structured peer feedback process undertaken in Sprint 4 reflects recognised formative assessment practices in software development education. The overall rating of 4.2/5 evidences a strong baseline with clear scope for targeted improvement in Sprint 5. The team's methodical approach to categorising feedback across visual design, accessibility, and technical stability demonstrates the kind of analytical capability expected in BSc Computing Science project work.

---

## Risk Assessment

| Risk Description                                                        | Likelihood | Impact | Mitigation Strategy                                                           |
| ----------------------------------------------------------------------- | ---------- | ------ | ----------------------------------------------------------------------------- |
| Leaderboard feature not completed before final submission               | Medium     | High   | Assigned as highest priority; Johns Jimee and Navin Sunar to lead delivery    |
| Timer bug reoccurring across browsers after fix                         | Medium     | High   | Full cross-browser testing required (Chrome, Firefox, Edge) before sign-off   |
| Presentation slides not completed in time                               | Low        | High   | Roles assigned to all members; first draft required before Meeting 7          |
| Mobile responsiveness issues affecting user evaluation quality          | Medium     | Medium | Responsive design testing to be completed as part of Sprint 5 deliverables    |

---

## Decisions Approved

1. Sprint 4 peer feedback report reviewed and findings accepted as the basis for Sprint 5 planning.
2. Leaderboard completion designated as the highest-priority Sprint 5 code task.
3. Timer bug fix and cross-browser testing to be completed before any assessed demo.
4. Presentation slide preparation to begin immediately, with roles assigned to all members.
5. Codebase documentation to be written and finalised before final submission.

---

## Action Plan

| # | Action Item                                                                           | Owner                     | Priority | Deadline  |
| - | ------------------------------------------------------------------------------------- | ------------------------- | -------- | --------- |
| 1 | Complete and deploy leaderboard feature                                               | Johns Jimee / Navin Sunar | Critical | Sprint 5  |
| 2 | Resolve countdown timer bug — cross-browser testing (Chrome, Firefox, Edge)           | Navin Sunar               | Critical | Sprint 5  |
| 3 | Compress background images to WebP; implement lazy loading                            | Johns Jimee               | High     | Sprint 5  |
| 4 | Add 'Why is this correct?' explanation cards after each answer                        | Full Team                 | High     | Sprint 5  |
| 5 | Implement full mobile/tablet responsive layout                                        | Full Team                 | Critical | Sprint 5  |
| 6 | Add keyboard navigation, ARIA labels, and improve colour contrast                     | Sijan Bhandari            | High     | Sprint 5  |
| 7 | Write and submit codebase documentation                                               | Full Team                 | High     | Sprint 5  |
| 8 | Prepare and deliver final presentation slides                                         | Sijan Bhandari            | Critical | TBC       |
| 9 | Schedule next team meeting and circulate agenda                                       | Sijan Bhandari            | Medium   | This Week |

---

## Expected Deliverables

- Completed and deployed leaderboard feature
- Timer bug resolved and cross-browser tested
- Optimised image assets (WebP format, lazy loading implemented)
- Post-answer explanation cards for all questions
- Fully responsive layout across mobile and tablet
- Accessibility improvements (keyboard navigation, ARIA labels, colour contrast)
- Codebase documentation (README, setup guide, contribution notes)
- Final presentation deck with roles assigned

---

## Meeting Outcome and Conclusion

Meeting 6 was a productive Sprint 4 review session with full team attendance. The peer feedback was discussed openly and the team acknowledged both the project's clear strengths and the areas that require focused effort in Sprint 5. The workstreams for code, presentation, and documentation are now clearly defined with ownership assigned. The Chair encouraged all members to maintain active communication and to raise any blockers promptly through the WhatsApp group.

---

| Signatory   | Name           | Date       |
| ----------- | -------------- | ---------- |
| Chairperson | Sijan Bhandari | 2 Jun 2026 |
| Secretary   | Sijan Bhandari | 2 Jun 2026 |

**Next Meeting:** 2 June 2026 at 2:00 PM

_Document Version: v1.0 — Confidential_
