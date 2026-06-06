# Meeting 8  Game Review and Improvement Planning
**BSc (Hons) Computing Science | Project Meeting Minutes**
*Coventry University Dagenham, London*

---

## Administrative Information

| | |
|---|---|
| **Meeting Number** | Meeting 8 |
| **Meeting Title** | Game Review Session and Improvement Planning |
| **Date** | Tuesday, 30 June 2026 |
| **Time** | 10:00 – 12:00 |
| **Location** | University Classroom, Coventry University Dagenham, London |
| **Chairperson** | Sijan Bhandari |
| **Minutes Prepared By** | Johns Jimee |
| **Programme** | BSc (Hons) Computing Science |
| **Institution** | Coventry University Dagenham, London |
| **Module** | BSc Computing Project |
| **Classification** | Confidential — Academic Use Only |

---

## Attendance Register

| Full Name | Role / Designation | Programme | Attendance |
|---|---|---|---|
| Sijan Bhandari | Project Lead / Chairperson | BSc (Hons) Computing Science | ✅ Present |
| Johns Jimee | Secretary / Lead Developer | BSc (Hons) Computing Science | ✅ Present |
| Abdullah Badhurdeen | Technical Analyst / QA Engineer | BSc (Hons) Computing Science | ✅ Present |
| Aditya Bhandari | Systems Architect / Planner | BSc (Hons) Computing Science | ✅ Present |
| Sandesh Shah | Research Associate | BSc (Hons) Computing Science | ✅ Present |
| Nabin Sunar | Implementation Support | BSc (Hons) Computing Science | ✅ Present |

> All six team members were present for the full duration of the session. No apologies were received.

---

## Meeting Objective

Today's session had two clear purposes. First, to collectively review the progress made on the browser-based game since the last meeting — specifically the visual improvements and bug fixes that were completed. Second, to play through the game together as a full team so that everyone could see the current state with fresh eyes, identify what is working well, and have a detailed, honest discussion about what needs to improve next. The main item on the forward agenda was the missing guest play functionality, which the team agreed needs to be the top priority going into the next sprint.

---

## Review of Previous Actions

Before getting into today's main agenda, the team ran through the actions carried forward from Meeting 7:

- **Johns Jimee** confirmed the graphical overhaul discussed last session is complete — updated visual assets are live in the current build.
- **Abdullah Badhurdeen** confirmed the critical performance bug (causing frame drops on lower-spec browsers) has been resolved and tested across three different browsers.
- **Aditya Bhandari** confirmed the change documentation has been updated on the shared OneDrive.

All actions from Meeting 7 were confirmed closed before the session moved forward.

---

## Detailed Discussion and Proceedings

### 8.1 — What Has Been Done: Progress Review

Sijan Bhandari opened the session by inviting Johns Jimee to walk the group through what has changed in the browser-based game since Meeting 7. Two main areas of work were covered: graphics and bug fixes.

**Graphics improvements:**
The visual design of the game has been meaningfully refreshed. The background artwork has been redrawn with better colour contrast and cleaner lines, making the interface more visually appealing and easier to read at a glance. Button styles and menu layouts were updated to feel consistent across all screens — previously the styling felt slightly mismatched between different parts of the game, and that has now been sorted. Nabin Sunar noted that the updated visuals look considerably more professional than the earlier version.

**Bug fixes:**
Abdullah Badhurdeen summarised the two issues that were addressed since the last meeting:
- A **performance issue** causing noticeable stuttering and frame drops on browsers other than Chrome — fixed by optimising the rendering loop and reducing unnecessary DOM repaints.
- A **scoring logic error** that occasionally awarded incorrect points under specific conditions — corrected and tested across multiple game scenarios.

Both fixes are confirmed stable in the current build. The team went through the change log together and confirmed everything matched what was agreed in Meeting 7.

---

### 8.2 — Playing the Game Together: Live Review

With the progress summary done, the team moved into the live play session — each member took a turn running through the game on their own machine while the rest of the group watched and took notes. This turned out to be genuinely useful. Watching someone else play reveals things you simply do not notice when you are the one doing it.

**Overall impression:** The game is clearly in a much better place than it was a few weeks ago. The visual improvements are obvious and well received. The core gameplay loop functions smoothly, and the bug fixes have made the experience noticeably more consistent across browsers. Sandesh Shah commented that the game feels stable in a way it did not before — which is a meaningful milestone.

**Key issue surfaced:** The live play session made one problem very obvious — the **guest play feature is completely missing**. At the moment, only registered or logged-in users can play the game. There is no way for someone to try it without going through account creation first. This came up repeatedly during the review and became the focal point of the forward planning discussion.

---

### 8.3 — The Guest Play Problem: Why It Matters

The team had a detailed conversation about why this is worth prioritising above everything else right now.

- **Sijan Bhandari** framed it clearly: the game's value depends on people being able to use it, and right now the entry barrier is too high. Requiring an account before playing reduces engagement — especially in a testing context where participants need to pick it up and play quickly.
- **Abdullah Badhurdeen** raised the evaluation angle: when the team moves into the formal user testing phase, managing account creation for every participant will be time-consuming and logistically awkward. A guest mode would let participants load the game from a link and start immediately.
- **Aditya Bhandari** flagged the technical consideration: implementing guest play is not trivial. The game currently ties session state to a user account, so changes are needed to how sessions are initialised and how progress is tracked. It is doable, but it needs to be planned carefully.

**Consensus reached:** Guest play is the single most important improvement to implement before the next meeting. Everything else is secondary until this is resolved.

---

### 8.4 — Technical Approach to Guest Play

Johns Jimee led the technical discussion. Three approaches were considered:

| Option | Approach | Effort | Selected? |
|---|---|---|---|
| **Option 1** | Anonymous browser session (localStorage / session cookie) — temporary session, scores not persisted | Low | ✅ Yes — immediate |
| **Option 2** | Prompted guest flow — 'Play as Guest' option on landing page, lightweight temporary profile | Medium | Attempt if time allows |
| **Option 3** | Shareable pre-authorised link — unique URL that opens a guest session directly | High | Deferred |

**Decision:** Start with Option 1 as the immediate deliverable. Move to Option 2 if capacity allows before Meeting 9. Option 3 noted as a future nice-to-have. Johns Jimee leads implementation; Nabin Sunar supports on front-end integration.

---

### 8.5 — Other Improvements Noted for Future Sprints

The live play session also surfaced a few smaller items, logged here so they do not get forgotten:

- **Loading time on mobile** — first-visit load feels slow, particularly on mobile browsers. Likely an asset size issue. Worth investigating but lower priority than guest play. *(Owner: Sandesh Shah)*
- **On-screen instructions clarity** — some instructions are not immediately obvious to a first-time player. A brief tutorial or tooltip layer was suggested. Connects directly to usability evaluation criteria. *(Deferred to post-guest-play sprint)*
- **End-of-game screen layout** — a minor CSS issue causes the layout to shift slightly on narrower viewport widths. Quick fix — less than an hour of work. *(Owner: Abdullah Badhurdeen)*

---

## Academic and Research Considerations

The live play session today served a dual purpose: it was both a practical development review and a form of **heuristic evaluation** — a recognised usability assessment method (Nielsen, 1994). Having the whole team observe each other playing without assistance mirrors an expert walkthrough, and the issues surfaced — particularly the guest play barrier — are exactly the kind of friction points that usability heuristics are designed to catch.

The decision to implement guest play before formal user evaluation is well-grounded in usability research. Barriers to entry are consistently identified as one of the most significant factors affecting user engagement and task completion rates. Removing that barrier will improve the quality of the evaluation data collected in Meeting 9.

The team's structured approach to selecting a technical implementation path — evaluating three options against project constraints — reflects the kind of evidence-based decision-making that BSc Computing projects are expected to demonstrate. The rationale will be documented in an Architecture Decision Record.

---

## Risk Assessment

| Risk Description | Likelihood | Impact | Mitigation Strategy |
|---|---|---|---|
| Guest play implementation breaking existing login/session logic | Medium | High | Develop on a separate feature branch; test login flow in parallel before merging |
| Anonymous session data lost if browser clears storage | Medium | Medium | Inform users clearly that guest progress is not saved; set UI expectations upfront |
| Guest play taking longer than estimated | Medium | High | Start with Option 1 (simplest); defer Option 2 if time is tight |
| Loading time on mobile affecting user evaluation quality | Low | Medium | Investigate asset compression before Meeting 9; log for tracking |
| End-of-game screen layout issue reappearing after fix | Low | Low | Regression test on narrow viewport after CSS fix; include in PR checklist |

---

## Decisions Approved

1. Progress confirmed: graphical improvements and bug fixes from Meeting 7 are complete and stable.
2. Guest play identified as the **single highest-priority improvement** for the next sprint.
3. Anonymous browser session (Option 1) selected as the immediate guest play implementation approach.
4. Prompted guest flow (Option 2) to follow in the same sprint if capacity allows.
5. Architecture Decision Record to be written for the guest play implementation decision.
6. CSS layout fix on the end-of-game screen to be completed as a quick win this week.
7. Loading time investigation and tutorial/tooltip layer deferred to a later sprint.

---

## Action Plan

| Action Item | Owner | Deadline | Priority | Status |
|---|---|---|---|---|
| Implement guest play — Option 1 (anonymous browser session) | Johns Jimee | 07 Jul 2026 | Critical | Open |
| Front-end integration and UI updates for guest play flow | Nabin Sunar | 07 Jul 2026 | Critical | Open |
| Write ADR for guest play implementation decision | Aditya Bhandari | 03 Jul 2026 | High | Open |
| Fix CSS layout issue on end-of-game screen (narrow viewports) | Abdullah Badhurdeen | 02 Jul 2026 | Medium | Open |
| Test login + guest session flows across 3 browsers | Abdullah Badhurdeen | 07 Jul 2026 | High | Open |
| Investigate asset loading time on mobile browsers | Sandesh Shah | 07 Jul 2026 | Low | Open |
| Circulate meeting minutes to all members | Johns Jimee | 01 Jul 2026 | Medium | Open |

---

## Expected Deliverables Before Next Meeting

- Working guest play feature (anonymous session, fully integrated and tested across browsers)
- Architecture Decision Record for guest play implementation
- Bug-free end-of-game screen across all tested viewport widths
- Cross-browser test report covering login and guest session flows
- Mobile loading time investigation report
- Updated project documentation on shared OneDrive

---

## Meeting Outcome and Conclusion

Meeting 8 was a genuinely productive session — partly because of what was formally reviewed, and partly because of what the live play exercise revealed. Seeing the game through each other's eyes made it clear that the guest play gap is not a minor inconvenience; it is a real barrier that needs to be removed before the project moves into its evaluation phase.

The progress made since last meeting deserves to be acknowledged. The graphical improvements have lifted the quality of the game noticeably, and the bug fixes have made it considerably more stable. The team can be proud of what has been delivered.

The path forward is clear: get guest play working first, then tidy up the smaller issues. The technical approach has been agreed, ownership is assigned, and the deadline is set. Sijan Bhandari reminded everyone to keep the WhatsApp group active so any blockers on the implementation can be picked up quickly.

**Meeting closed at 12:00.**

---

*Chairperson: Sijan Bhandari — Signature: ___________________________*

*Secretary: Johns Jimee — Signature: ___________________________*

---

---

# Meeting 9  — Agenda
**BSc (Hons) Computing Science | Project Meeting**
*Coventry University Dagenham, London*
**Tuesday, 07 July 2026 | 10:00 – 12:00 | University Classroom**

---

## Agenda Items

### Agenda Item 1 — Full Game Review

The team will conduct a thorough, end-to-end review of the browser-based game in its current state, with the guest play feature now implemented. Every team member will play through the game and the group will assess the overall experience from a user's perspective — covering gameplay flow, visual consistency, responsiveness, ease of use, and any remaining issues that need addressing before the formal user evaluation phase. This review will serve as the team's final quality check before external participants are invited to test the game.

**Expected outcome:** A shared, agreed view of the game's current quality; a short list of any remaining fixes required before user testing; confirmation that the system is ready for the evaluation phase.

---

### Agenda Item 2 — Presentation Slides Discussion

The second half of the meeting will be dedicated to planning and beginning work on the project presentation slides. The team will discuss the structure and content of the final presentation — what needs to be covered, how to divide sections between members, what visuals and evidence to include, and how to present the project's findings in a way that is clear, engaging, and appropriate for a BSc Computing assessment context.

Topics to be covered in the discussion:
- Agreed slide structure and running order
- Division of presentation sections between team members
- Key findings to highlight (performance results, usability scores, guest play implementation)
- Visual evidence to include (screenshots, charts, benchmark data)
- Presentation style and tone
- Rehearsal plan and timing

**Expected outcome:** A draft slide structure agreed by the whole team; section ownership assigned to each member; first draft of slides to be started before Meeting 10.

---

## Pre-Meeting Preparation

All members are asked to come to Meeting 9 having:

- [ ] Tested the guest play feature on their own machine and noted any issues
- [ ] Thought about what the project's three or four most important findings are
- [ ] Considered which section of the presentation they feel best placed to present
- [ ] Reviewed the module assessment criteria so the presentation structure can be aligned to it

---

*Next meeting: Tuesday, 07 July 2026 | 10:00 – 12:00 | University Classroom, Coventry University Dagenham*
