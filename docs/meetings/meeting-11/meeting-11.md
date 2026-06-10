# BSc Computing Science Project — Professional Minutes of Meetings

**Coventry University, Dagenham, London**

## Meeting 11 of 12: Presentation Rehearsal and Final Submission Preparation

> **Team:** Sijan Bhandari · Johns Jimee · Abdhullah Badhurdeen · Aditya Bhandari · Sandesh Shah · Nabin Sunar

---

## Administrative Information

| Field               | Detail                                          |
| ------------------- | ----------------------------------------------- |
| Meeting Number      | Meeting 11                                      |
| Meeting Title       | Presentation Rehearsal and Final Submission Preparation |
| Date                | 5 June 2026                                     |
| Time                | 2:00 PM – 5:00 PM                               |
| Location            | WhatsApp Group Call / Microsoft Teams (Online)  |
| Chairperson         | Sijan Bhandari                                  |
| Minutes Prepared By | Nabin Sunar                                     |
| Programme           | BSc (Hons) Computing Science                    |
| Institution         | Coventry University Dagenham, London            |
| Module              | 503IT — Communication and Collaboration         |
| Classification      | Confidential — Academic Use Only                |

---

## Attendance Register

| Name                | Role / Designation              | Programme                    | Attendance |
| ------------------- | ------------------------------- | ---------------------------- | ---------- |
| Sijan Bhandari      | Project Lead / Chairperson      | BSc (Hons) Computing Science | Present    |
| Johns Jimee         | Secretary / Technical Analyst   | BSc (Hons) Computing Science | Present    |
| Abdhullah Badhurdeen| QA Lead / Demo Manager          | BSc (Hons) Computing Science | Present    |
| Aditya Bhandari     | Documentation Lead / Planner    | BSc (Hons) Computing Science | Present    |
| Sandesh Shah        | Research Associate              | BSc (Hons) Computing Science | Present    |
| Nabin Sunar         | Implementation Support          | BSc (Hons) Computing Science | Present    |

_All team members were present at this meeting._

---

## Meeting Objective

To confirm the final build is complete and all Meeting 10 actions are closed, run a full dress rehearsal of the group presentation with each member delivering their assigned section, review and adjust timing, and complete a final submission checklist to ensure all materials are ready for sign-off.

---

## Review of Previous Actions

The following actions from Meeting 10 (morning session) were reviewed and confirmed before the rehearsal began:

- **Abdhullah Badhurdeen** confirmed the Firefox animation flicker in Teens mode is resolved using a requestAnimationFrame-based approach.
- **Abdhullah Badhurdeen** confirmed both Adult mode colour contrast failures are corrected — all screens now meet WCAG 2.1 Level AA at 4.5:1 minimum.
- **Abdhullah Badhurdeen** confirmed the leaderboard username truncation on mobile has been patched with a CSS text-overflow fix.
- **Johns Jimee** confirmed the ARIA live region has been added to the post-answer explanation card — now announced correctly by screen readers.
- **Johns Jimee** confirmed the explanation card display time is extended to five seconds with a manual 'Next' button.
- **Aditya Bhandari and Sandesh Shah** confirmed the project evaluation report is written, reviewed, and uploaded to OneDrive.

All actions from Meeting 10 were confirmed closed. The build is now feature-complete.

---

## Detailed Discussion and Proceedings

### 11.1 Final Build Status Confirmation

Abdhullah Badhurdeen confirmed the status of all features in the final build before the rehearsal began.

| Feature                                   | Status   |
| ----------------------------------------- | -------- |
| Guest play (anonymous session)            | Complete |
| Persistent leaderboard (registered users) | Complete |
| Post-answer explanation cards             | Complete |
| Mode selection introductory prompt        | Complete |
| Kids mode timer toggle                    | Complete |
| Female voice narration (Kids mode)        | Complete |
| Email-connected feedback form             | Complete |
| Mobile responsive layout (all modes)      | Complete |
| Keyboard navigation (full game)           | Complete |
| ARIA labels and screen reader support     | Complete |
| WCAG 2.1 Level AA colour contrast         | Complete |
| WebP image assets with lazy loading       | Complete |
| Background animation (all modes)          | Complete |
| Fixed single-page layout                  | Complete |

Two items were formally descoped by team agreement:
- Shareable pre-authorised guest link (Option 3 from Meeting 8) — deferred; out of scope.
- Statistic references in Adult mode explanation cards — partial; remaining cards agreed out of scope.

### 11.2 Presentation Structure and Role Assignment

Aditya Bhandari, as Documentation Lead, confirmed the final presentation structure and role assignments. The deck covers ten sections with a total target of twenty minutes.

| Section | Title                                         | Owner               | Target Time |
| ------- | --------------------------------------------- | ------------------- | ----------- |
| 1       | Introduction and project overview             | Sijan Bhandari      | 2 minutes   |
| 2       | Problem statement and research rationale      | Aditya Bhandari     | 2 minutes   |
| 3       | Team structure, roles, and collaboration      | Nabin Sunar         | 2 minutes   |
| 4       | Technical design and architecture             | Aditya Bhandari     | 3 minutes   |
| 5       | Feature walkthrough — live demo               | Abdhullah Badhurdeen| 3 minutes   |
| 6       | User testing methodology and SUS results      | Sandesh Shah        | 2 minutes   |
| 7       | Accessibility and inclusive design            | Abdhullah Badhurdeen| 1 minute    |
| 8       | Challenges and lessons learned                | Johns Jimee         | 2 minutes   |
| 9       | Future development recommendations            | Aditya Bhandari     | 1 minute    |
| 10      | Conclusion and team acknowledgements          | Sijan Bhandari      | 1 minute    |
| —       | Q&A buffer                                    | Full Team           | 5 minutes   |

### 11.3 Full Dress Rehearsal

The team ran a complete, timed rehearsal over the WhatsApp / Teams call. Each member delivered their section while the others watched and noted feedback.

**Timing outcomes:**

| Section | Target  | Actual  | Outcome            |
| ------- | ------- | ------- | ------------------ |
| 1       | 2 min   | 2:05    | On target          |
| 2       | 2 min   | 2:40    | Over — needs trim  |
| 3       | 2 min   | 1:55    | On target          |
| 4       | 3 min   | 3:20    | Slight over        |
| 5       | 3 min   | 4:10    | Over — needs trim  |
| 6       | 2 min   | 2:15    | On target          |
| 7       | 1 min   | 1:10    | On target          |
| 8       | 2 min   | 1:50    | On target          |
| 9       | 1 min   | 1:30    | Slight over        |
| 10      | 1 min   | 1:05    | On target          |
| Total   | 19 min  | 22:00   | Needs trimming     |

**Feedback and adjustments agreed:**

- **Section 2 (Aditya Bhandari):** Remove one background statistic; shorten the closing sentence. Target: two minutes.
- **Section 4 (Aditya Bhandari):** Reference the database schema visually rather than walking through it verbally. Target: three minutes.
- **Section 5 (Abdhullah Badhurdeen — live demo):** Pre-load a saved game state to jump directly to the leaderboard, cutting two minutes from the walkthrough. Target: three minutes.
- **Section 9 (Aditya Bhandari):** Cut one future recommendation. Target: one minute.
- All other sections approved without changes.

Abdhullah Badhurdeen agreed to prepare a short pre-recorded fallback demo video in case the live internet connection fails during the actual presentation.

### 11.4 Submission Checklist Review

Aditya Bhandari ran through the complete submission checklist against the module brief.

| Item                                             | Status      | Notes                                                |
| ------------------------------------------------ | ----------- | ---------------------------------------------------- |
| Final game build (deployed and accessible)       | Complete    | URL confirmed working across three browsers          |
| Source code repository (GitHub)                  | Complete    | Repository cleaned; README updated                   |
| Project documentation (README, ADRs, setup)      | Complete    | Two ADRs, README, contribution notes on file         |
| Minutes of meetings 1–11                         | Complete    | All formatted, signed, and filed                     |
| User testing summary and SUS dataset             | Complete    | Uploaded to OneDrive                                 |
| Project evaluation report                        | Complete    | Uploaded to OneDrive                                 |
| Sprint retrospectives (Sprints 4, 5, 6)          | Complete    | Three retrospectives on file                         |
| Ethics documentation                             | Complete    | Consent forms and ethics application retained        |
| Microsoft Planner task log export                | Complete    | Exported and filed as evidence of task management    |
| Final presentation deck (PDF and PPTX)           | Complete    | Both formats uploaded to OneDrive                    |
| Peer assessment forms                            | In Progress | Each member to complete individually before 6 Jun    |

**One gap:** Peer assessment forms are still outstanding. Each member must complete their own individually before 6 June 2026.

---

## Academic and Research Considerations

Running a timed dress rehearsal with structured feedback reflects the standard of preparation expected from a team working at BSc final-year level. Using quantitative timing data — rather than informal impressions — to evaluate the rehearsal demonstrates analytical self-regulation. Abdhullah Badhurdeen's responsibility for the live demo and fallback contingency, combined with Aditya Bhandari's ownership of the documentation and presentation structure, reflects a mature division of labour that leverages each member's established strengths. The submission checklist confirms the evidence pack is comprehensive: process evidence — minutes, retrospectives, ethics trail, and evaluation data — carries as much weight as the final deliverable in BSc Computing Science project assessment.

---

## Risk Assessment

| Risk Description                                              | Likelihood | Impact | Mitigation Strategy                                                          |
| ------------------------------------------------------------- | ---------- | ------ | ---------------------------------------------------------------------------- |
| Presentation still over time after trimming                   | Low        | Medium | Recording available for self-review                                          |
| Peer assessment forms not submitted by deadline               | Low        | High   | Sijan Bhandari to send WhatsApp reminder on the morning of 6 June            |
| Live demo failing during actual presentation                  | Medium     | High   | Pre-recorded fallback video to be prepared by Abdhullah Badhurdeen           |
| Submission portal issues on upload day                        | Low        | High   | All materials zipped and ready; aim to submit as early as possible           |

---

## Decisions Approved

1. Final build confirmed feature-complete; two items formally descoped.
2. Presentation structure, roles, and timings confirmed — three sections to be trimmed.
3. Abdhullah Badhurdeen to use pre-loaded game state for live demo to hit Section 5 target.
4. Abdhullah Badhurdeen to prepare pre-recorded fallback demo video as contingency.
5. All submission materials confirmed complete except individual peer assessment forms.
6. Peer assessment forms to be submitted by 6 June 2026.

---

## Action Plan

| Action Item                                                           | Owner               | Deadline    | Priority | Status |
| --------------------------------------------------------------------- | ------------------- | ----------- | -------- | ------ |
| Trim Section 2 to two minutes                                         | Aditya Bhandari     | 6 Jun 2026  | High     | Open   |
| Trim Section 4 — reference database schema visually                   | Aditya Bhandari     | 6 Jun 2026  | High     | Open   |
| Trim Section 5 — use pre-loaded game state for live demo              | Abdhullah Badhurdeen| 6 Jun 2026  | High     | Open   |
| Trim Section 9 — cut one recommendation                               | Aditya Bhandari     | 6 Jun 2026  | Medium   | Open   |
| Prepare fallback pre-recorded demo video                              | Abdhullah Badhurdeen| 6 Jun 2026  | High     | Open   |
| Complete individual peer assessment forms                             | All Members         | 6 Jun 2026  | Critical | Open   |
| Final read-through of documentation pack for consistency              | Sijan Bhandari      | 6 Jun 2026  | High     | Open   |
| Export clean source code ZIP archive for submission                   | Johns Jimee         | 6 Jun 2026  | High     | Open   |
| Send peer assessment form reminder via WhatsApp                       | Sijan Bhandari      | 6 Jun 2026  | Medium   | Open   |
| Circulate meeting minutes to all members                              | Nabin Sunar         | 5 Jun 2026  | Medium   | Open   |

---

## Expected Deliverables

- Trimmed and finalised presentation deck (PDF and PPTX updated)
- Pre-recorded fallback demo video
- All six peer assessment forms submitted individually
- Clean source code ZIP archive
- Final documentation pack reviewed and confirmed consistent
- All materials ready for formal sign-off at Meeting 12

---

## Meeting Outcome and Conclusion

Meeting 11 was an intensive and productive session. Seeing the full project brought together — a stable, accessible, fully tested game, a complete evidence pack, and a polished presentation rehearsal — gave the team a clear sense of how much has been accomplished since Meeting 1. Abdhullah Badhurdeen's demo preparation and Aditya Bhandari's ownership of the presentation structure and documentation were instrumental in bringing the session to a successful close. The final steps are clear and straightforward. Sijan Bhandari thanked everyone for their commitment and reminded the team that Meeting 12 is the formal sign-off — materials must be in their final state before it begins. The Chair closed the meeting at 5:00 PM.

---

| Signatory   | Name           | Date       |
| ----------- | -------------- | ---------- |
| Chairperson | Sijan Bhandari | 5 Jun 2026 |
| Secretary   | Nabin Sunar    | 5 Jun 2026 |

**Next Meeting:** 6 June 2026

_Document Version: v1.0 — Confidential_
