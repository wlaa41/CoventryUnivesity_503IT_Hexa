# BSc Computing Science Project — Professional Minutes of Meetings

**Coventry University, Dagenham, London**

## Meeting 10 of 12: Sprint Finalisation and Full Integration Review

> **Team:** Sijan Bhandari · Johns Jimee · Abdhullah Badhurdeen · Aditya Bhandari · Sandesh Shah · Nabin Sunar

---

## Administrative Information

| Field               | Detail                                          |
| ------------------- | ----------------------------------------------- |
| Meeting Number      | Meeting 10                                      |
| Meeting Title       | Sprint Finalisation and Full Integration Review |
| Date                | 5 June 2026                                     |
| Time                | 10:00 AM – 12:00 PM                             |
| Location            | Microsoft Teams (Online)                        |
| Chairperson         | Aditya Bhandari                                 |
| Minutes Prepared By | Abdhullah Badhurdeen                            |
| Programme           | BSc (Hons) Computing Science                    |
| Institution         | Coventry University Dagenham, London            |
| Module              | 503IT — Communication and Collaboration         |
| Classification      | Confidential — Academic Use Only                |

---

## Attendance Register

| Name                | Role / Designation              | Programme                    | Attendance |
| ------------------- | ------------------------------- | ---------------------------- | ---------- |
| Sijan Bhandari      | Project Lead                    | BSc (Hons) Computing Science | Present    |
| Johns Jimee         | Secretary / Technical Analyst / QA Engineer | BSc (Hons) Computing Science | Present    |
| Abdhullah Badhurdeen| Lead Developer                  | BSc (Hons) Computing Science | Present    |
| Aditya Bhandari     | Chairperson / Systems Architect | BSc (Hons) Computing Science | Present    |
| Sandesh Shah        | Research Associate              | BSc (Hons) Computing Science | Present    |
| Nabin Sunar         | Implementation Support          | BSc (Hons) Computing Science | Present    |

_All team members were present at this meeting._

---

## Meeting Objective

To review and confirm all improvement work completed since Meeting 9, run a full end-to-end integration check of the game build with Johns Jimee leading QA, conduct an accessibility audit, and confirm the documentation pack is on track for submission.

---

## Review of Previous Actions

The following actions from Meeting 9 were reviewed and confirmed at the start of the session:

- **Abdhullah Badhurdeen** confirmed post-answer explanation cards are live across all three modes. After each answer, a brief explanation card appears before the next question loads.
- **Aditya Bhandari and Johns Jimee** confirmed the persistent leaderboard is implemented — scores stored server-side per registered user, displayed on a dedicated screen accessible from the main menu.
- **Nabin Sunar** confirmed the mode selection introductory prompt is added and displays correctly.
- **Johns Jimee** confirmed the Kids mode timer toggle is live, defaulting to timer-off.
- **Sijan Bhandari** confirmed the answer wording review is complete — seventeen questions updated across all three modes.
- **Sandesh Shah** confirmed the full SUS dataset has been uploaded to OneDrive.
- **Aditya Bhandari** confirmed the user testing summary report has been written and uploaded.

All actions from Meeting 9 were confirmed closed.

---

## Detailed Discussion and Proceedings

### 10.1 Persistent Leaderboard — Review

Aditya Bhandari opened by walking the team through the completed leaderboard feature, which he co-developed with Johns Jimee. Key elements reviewed:

- Scores are stored server-side on quiz completion for registered accounts. Guest play scores are not persisted, consistent with the ADR from Meeting 8.
- The 'Top 10' leaderboard is accessible from the main menu, segmented by mode — Kids, Teens, and Adults.
- Registered users can see their personal best highlighted alongside the ranked list.
- The end-of-game screen now shows the user's rank in real time.

One minor issue was noted: on mobile screens, usernames longer than twelve characters overflow the leaderboard table column. Abdhullah Badhurdeen logged this as a CSS fix item to address immediately.

### 10.2 Post-Answer Explanation Cards — Review

Abdhullah Badhurdeen demonstrated the explanation cards across all three modes. Cards display plain-English explanations appropriate to each age group — simpler language for Kids, more detailed for Adults. The team agreed to extend the display window to five seconds and add a manual 'Next' button so players can advance earlier if ready.

### 10.3 Full Integration Review

Abdhullah Badhurdeen led the team through a structured end-to-end walkthrough of the complete game, testing each mode from landing page through mode selection, full quiz, leaderboard, and back to the main menu. Aditya Bhandari documented all findings.

| Area Tested                          | Result  | Notes                                                              |
| ------------------------------------ | ------- | ------------------------------------------------------------------ |
| Landing page — guest and login flows | Pass    | Both flows work independently with no cross-contamination          |
| Mode selection with new prompt       | Pass    | Prompt displayed correctly; dismissable before mode entry          |
| Kids timer toggle                    | Pass    | Default off; toggle held for session duration                      |
| Quiz flow — all three modes          | Pass    | All questions load; no blank screens or missing assets             |
| Post-answer explanation cards        | Pass    | Display on every question; correct content per age group           |
| Leaderboard — registered user        | Pass    | Score recorded and ranked correctly                                |
| Leaderboard — guest user             | Pass    | No score submitted; "Log in to save score" message displayed       |
| End-of-game screen — all viewports   | Pass    | No layout shift across narrow, standard, and wide screens          |
| Mobile responsiveness                | Pass    | All screens render correctly at 375 px and 768 px                  |
| Female voice narration (Kids mode)   | Pass    | Voice asset loads and plays correctly                              |
| Email-connected feedback form        | Pass    | Test submission received with no errors                            |

One issue identified by Abdhullah Badhurdeen: on Firefox, the background animation in Teens mode flickers briefly during question transitions. Does not affect gameplay but is visually distracting. He took ownership of the fix immediately.

### 10.4 Accessibility Audit

Abdhullah Badhurdeen presented the results of the accessibility audit he conducted against WCAG 2.1 Level AA criteria.

| Criterion                            | Status   | Notes                                                             |
| ------------------------------------ | -------- | ----------------------------------------------------------------- |
| Keyboard navigation (full game)      | Pass     | All interactive elements reachable via Tab key                    |
| ARIA labels on buttons and inputs    | Pass     | Labels added to all form elements and interactive controls        |
| Colour contrast (text on background) | Partial  | Two screens in Adult mode fall below the 4.5:1 minimum ratio      |
| Alt text on images                   | Pass     | All decorative images marked aria-hidden                          |
| Focus indicator visibility           | Pass     | Visible focus ring on all focusable elements                      |
| Screen reader compatibility (NVDA)   | Partial  | Leaderboard reads correctly; explanation card not yet announced   |

**Actions from the audit:**
- Abdhullah Badhurdeen to fix colour contrast on the two Adult mode screens.
- Johns Jimee to add ARIA live region to explanation card for screen reader support.

### 10.5 Documentation Status

Aditya Bhandari presented the current documentation status:

- **README** — complete; project overview, tech stack, setup guide, and feature list.
- **Contribution notes** — complete; documents each member's area of responsibility.
- **Architecture Decision Records** — two ADRs written: guest play implementation and leaderboard storage approach. Both authored by Aditya Bhandari.
- **Sprint retrospectives** — Sprints 4, 5, and 6 are on file.
- **User testing summary report** — complete.

**Gap identified:** A project evaluation report synthesising the SUS findings, qualitative feedback, and the team's response is still required. Aditya Bhandari and Sandesh Shah agreed to co-author it before Meeting 11.

---

## Academic and Research Considerations

The integration testing approach used today reflects a core principle in software quality assurance: end-to-end testing is not interchangeable with unit testing. Features that pass in isolation can interact unexpectedly when combined, and a structured walkthrough of the complete user journey guards against regressions that would otherwise surface only during a live demonstration. Johns Jimee's systematic approach to the QA review — working from a structured test matrix rather than ad hoc exploration — ensures that the test coverage is documented and reproducible. Aditya Bhandari's documentation of all architectural decisions through formal ADRs demonstrates the kind of professional engineering practice expected at BSc Computing Science level.

---

## Risk Assessment

| Risk Description                                              | Likelihood | Impact | Mitigation Strategy                                                             |
| ------------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------- |
| Firefox animation flicker visible in assessed demo            | Low        | Medium | Abdhullah Badhurdeen to fix before Meeting 11; low-complexity change            |
| Colour contrast and screen reader issues not corrected        | Low        | High   | Both items owned by Abdhullah Badhurdeen and Johns Jimee; deadline today        |
| Evaluation report not drafted before submission               | Medium     | High   | Aditya Bhandari and Sandesh Shah co-authoring; draft due before Meeting 11      |
| Leaderboard overflow on mobile not patched                    | Low        | Low    | CSS fix; Abdhullah Badhurdeen to include alongside contrast corrections         |

---

## Decisions Approved

1. All Meeting 9 actions confirmed complete and closed.
2. Persistent leaderboard, explanation cards, timer toggle, and mode selection prompt confirmed working and approved for the final build.
3. Explanation card display time to be extended to five seconds with a manual 'Next' button added.
4. Firefox flicker, colour contrast failures, screen reader gap, and mobile overflow identified as remaining fixes — all owned by Abdhullah Badhurdeen and Johns Jimee.
5. Project evaluation report added as a required submission deliverable — Aditya Bhandari leads.

---

## Action Plan

| Action Item                                                                   | Owner                          | Deadline    | Priority | Status |
| ----------------------------------------------------------------------------- | ------------------------------ | ----------- | -------- | ------ |
| Fix Firefox animation flicker (Teens mode, question transitions)              | Abdhullah Badhurdeen           | 5 Jun 2026  | Medium   | Open   |
| Fix colour contrast on two Adult mode screens to WCAG 4.5:1                   | Abdhullah Badhurdeen           | 5 Jun 2026  | High     | Open   |
| Add ARIA live region to post-answer explanation card                          | Johns Jimee                    | 5 Jun 2026  | High     | Open   |
| Fix leaderboard username truncation on mobile                                 | Abdhullah Badhurdeen           | 5 Jun 2026  | Low      | Open   |
| Extend explanation card to 5 seconds and add manual 'Next' button             | Johns Jimee                    | 5 Jun 2026  | Medium   | Open   |
| Write project evaluation report (SUS findings and qualitative synthesis)      | Aditya Bhandari & Sandesh Shah | 5 Jun 2026  | High     | Open   |
| Circulate meeting minutes to all members                                      | Abdhullah Badhurdeen           | 5 Jun 2026  | Medium   | Open   |

---

## Expected Deliverables

- Final build with Firefox flicker, contrast, and screen reader issues resolved
- Extended explanation cards with manual advance button
- Project evaluation report drafted and uploaded to OneDrive
- Updated documentation on shared OneDrive
- Integrated build ready for presentation rehearsal at Meeting 11

---

## Meeting Outcome and Conclusion

Meeting 10 provided the team with a clear, honest picture of the product's current state. The integration review led by Abdhullah Badhurdeen confirmed that Hexa Quiz is functioning cohesively as a complete application. The ADR documentation managed by Aditya Bhandari ensures every architectural decision is formally recorded. The remaining items are well-defined, fully assigned, and achievable before the presentation rehearsal. Aditya Bhandari reminded the team that Meeting 11 is the rehearsal session — the build should be in its final state before it begins. The Chair closed the meeting at 12:00 PM.

---

| Signatory   | Name             | Date       |
| ----------- | ---------------- | ---------- |
| Chairperson | Aditya Bhandari  | 5 Jun 2026 |
| Secretary   | Abdhullah Badhurdeen | 5 Jun 2026 |

**Next Meeting:** 5 June 2026 (Afternoon Session)

_Document Version: v1.0 — Confidential_
