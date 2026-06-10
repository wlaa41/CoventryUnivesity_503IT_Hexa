# BSc Computing Science Project — Professional Minutes of Meetings

**Coventry University, Dagenham, London**

## Meeting 9 of 12: User Testing and Evaluation Session

> **Team:** Sijan Bhandari · Johns Jimee · Abdhullah Badhurdeen · Aditya Bhandari · Sandesh Shah · Nabin Sunar

---

## Administrative Information

| Field               | Detail                                          |
| ------------------- | ----------------------------------------------- |
| Meeting Number      | Meeting 9                                       |
| Meeting Title       | User Testing and Evaluation Session             |
| Date                | 4 June 2026                                     |
| Time                | 2:00 PM – 4:30 PM                               |
| Location            | Microsoft Teams (Online)                        |
| Chairperson         | Abdhullah Badhurdeen                            |
| Minutes Prepared By | Johns Jimee                                     |
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
| Aditya Bhandari     | Systems Architect / Planner     | BSc (Hons) Computing Science | Present    |
| Sandesh Shah        | Research Associate              | BSc (Hons) Computing Science | Present    |
| Nabin Sunar         | Implementation Support          | BSc (Hons) Computing Science | Present    |

_All team members were present at this meeting._

---

## Meeting Objective

To confirm the guest play feature is fully live and working, conduct the formal user testing and evaluation session using the System Usability Scale methodology, collect and review feedback from external participants across the three target age groups, and agree on the final improvement priorities for the next sprint.

---

## Review of Previous Actions

The following actions assigned in Meeting 8 (held earlier the same day) were reviewed and confirmed before the session proceeded:

- **Johns Jimee** confirmed the guest play feature — anonymous browser session via localStorage — is live and has been tested across Chrome, Firefox, and Edge.
- **Nabin Sunar** confirmed the front-end 'Play as Guest' button integration is complete and consistent across all tested browsers.
- **Aditya Bhandari** confirmed the Architecture Decision Record documenting the guest play decision has been written and uploaded to OneDrive.
- **Abdhullah Badhurdeen** confirmed the CSS end-of-game layout fix is complete and regression tested across narrow, standard, and wide viewports.
- **Sandesh Shah** confirmed the mobile asset loading investigation is complete — PNG assets were recompressed to WebP format, reducing first-visit mobile load time by approximately 40%.

All actions from Meeting 8 were confirmed closed.

---

## Detailed Discussion and Proceedings

### 9.1 Guest Play — Pre-Testing Verification

Abdhullah Badhurdeen opened the session by leading the group through a final internal check of the guest journey. Each member confirmed the full flow — landing page, mode selection, quiz completion, and end-of-game screen — ran without errors from a clean browser session with no prior cookies or localStorage. The on-screen message informing guest users that their progress is not saved was confirmed visible and appropriately worded.

Abdhullah Badhurdeen confirmed the build is ready for external participants.

### 9.2 User Testing Methodology

Sijan Bhandari outlined the evaluation approach. Six external participants were recruited — two per age group: Kids (aged 10–12), Teens (aged 14–17), and Adults (aged 23–35). Informed consent forms were signed by adult participants; parental consent was obtained for younger participants in line with the ethics protocol.

Each session followed a consistent structure:
1. Brief verbal introduction with no guidance on gameplay.
2. Think-aloud observation — observer notes taken without intervening.
3. Post-session System Usability Scale (SUS) questionnaire.
4. Optional verbal debrief.

**Roles assigned:** Abdhullah Badhurdeen led as primary observer and note-taker. Aditya Bhandari co-facilitated the session and managed the timing for each participant. Sandesh Shah distributed and collected questionnaires.

### 9.3 Testing Session — Key Observations

All six participants completed the quiz without abandoning mid-session.

**Positive findings:**
- All participants launched the game and began playing without any assistance, confirming guest play removes the entry barrier effectively.
- Age-appropriate theming was immediately recognised. Kids participants responded positively to the CyberWorld Adventure style. Teens were visibly more engaged when questions referenced social media scenarios.
- Voice narration in Kids mode drew unprompted positive comments from two younger participants.
- The difficulty label displayed per question was appreciated by both Teen and Adult participants.

**Issues identified by Abdhullah Badhurdeen and Aditya Bhandari during observation:**
- Two participants bypassed the mode selection screen without reading it. A prompt or tooltip is recommended.
- The countdown timer caused visible anxiety in one Kids participant, who rushed through answers. An optional timer for Kids mode was discussed.
- Two participants asked whether their score would appear on the leaderboard — confirming strong user appetite for the persistent leaderboard feature.
- One Adult participant noted some answer options were too similar in wording, making them hard to distinguish without careful reading.

### 9.4 SUS Questionnaire Results

Sandesh Shah compiled questionnaire responses immediately after the session. Full raw data was uploaded to OneDrive.

| Metric                               | Score / Rating       |
| ------------------------------------ | -------------------- |
| Average SUS Score (all participants) | 76.7 / 100           |
| Ease of use (1–5 scale)              | 4.2 / 5              |
| Visual appeal (1–5 scale)            | 4.6 / 5              |
| Educational value (1–5 scale)        | 4.4 / 5              |
| Would recommend to others (Yes / No) | 5 Yes / 1 No         |

A SUS score of 76.7 places Hexa Quiz in the "Good" usability category. The result represents a strong baseline at this stage of development.

### 9.5 Improvement Priorities Agreed

Abdhullah Badhurdeen and Aditya Bhandari led the post-testing review discussion. Five priorities were agreed for the next sprint:

1. Add a short introductory prompt to the mode selection screen.
2. Make the quiz timer optional or hidden for Kids mode.
3. Review and rewrite ambiguous answer options across all three modes.
4. Complete the persistent leaderboard feature — confirmed high-value by participant feedback.
5. Add post-answer explanation cards — supported by participant requests for clearer learning outcomes.

---

## Academic and Research Considerations

The evaluation methodology applied today draws on established HCI research practice. The System Usability Scale (Brooke, 1996) provides a standardised instrument for measuring perceived usability, while the think-aloud protocol (Nielsen, 1993) generates qualitative depth that numerical data alone cannot capture. The combined approach reflects the mixed-methods evaluation design recommended in BSc Computing project guidance. The SUS score of 76.7 provides a statistically grounded, citable result for the project report. Abdhullah Badhurdeen's structured observation notes will form a key component of the evaluation evidence submitted alongside the final build.

---

## Risk Assessment

| Risk Description                                              | Likelihood | Impact | Mitigation Strategy                                                           |
| ------------------------------------------------------------- | ---------- | ------ | ----------------------------------------------------------------------------- |
| Improvement priorities not actioned before final submission   | Medium     | High   | All items assigned with deadlines; Abdhullah Badhurdeen to track via Planner  |
| Leaderboard absence reducing game's perceived value in demo   | Medium     | High   | Persistent leaderboard confirmed as top priority for Johns Jimee              |
| Kids timer anxiety visible during assessed demonstration      | Medium     | Medium | Timer toggle to be implemented before Meeting 10                              |
| Ambiguous answer options affecting perceived education quality | Low        | Medium | Sijan Bhandari to review and rewrite all affected questions by 5 June         |

---

## Decisions Approved

1. Guest play feature confirmed working and approved for the final build.
2. Formal user testing completed; SUS score of 76.7 accepted as the project's usability evaluation result.
3. Five improvement priorities agreed and assigned from testing findings.
4. All raw evaluation data to be retained in the project evidence pack.

---

## Action Plan

| Action Item                                                   | Owner               | Deadline    | Priority | Status |
| ------------------------------------------------------------- | ------------------- | ----------- | -------- | ------ |
| Implement post-answer explanation cards for all questions     | Abdhullah Badhurdeen| 5 Jun 2026  | Critical | Open   |
| Complete persistent leaderboard feature                       | Aditya Bhandari & Johns Jimee | 5 Jun 2026 | Critical | Open |
| Add introductory prompt to mode selection screen              | Nabin Sunar         | 5 Jun 2026  | High     | Open   |
| Make quiz timer optional / hidden in Kids mode                | Johns Jimee         | 5 Jun 2026  | High     | Open   |
| Review and rewrite ambiguous answer options across all modes  | Sijan Bhandari      | 5 Jun 2026  | High     | Open   |
| Upload full SUS questionnaire dataset to shared OneDrive      | Sandesh Shah        | 5 Jun 2026  | Medium   | Open   |
| Write user testing summary report for project evidence pack   | Aditya Bhandari     | 5 Jun 2026  | High     | Open   |
| Circulate meeting minutes to all members                      | Johns Jimee         | 5 Jun 2026  | Medium   | Open   |

---

## Expected Deliverables

- Updated game build with mode selection prompt, Kids timer toggle, explanation cards, and corrected answer wording
- Completed persistent leaderboard feature
- Full SUS dataset and user testing summary report on shared OneDrive

---

## Meeting Outcome and Conclusion

Meeting 9 was one of the most productive sessions of the project. Watching external participants engage with the game provided real, unfiltered evidence that the product works — and surfaced a clear, manageable list of improvements. The SUS score of 76.7 is a strong result. Abdhullah Badhurdeen and Aditya Bhandari's combined facilitation and observation ensured the session ran efficiently and that every participant's feedback was captured systematically. The Chair closed the meeting at 4:30 PM.

---

| Signatory   | Name                 | Date       |
| ----------- | -------------------- | ---------- |
| Chairperson | Abdhullah Badhurdeen | 4 Jun 2026 |
| Secretary   | Johns Jimee          | 4 Jun 2026 |

**Next Meeting:** 5 June 2026

_Document Version: v1.0 — Confidential_
