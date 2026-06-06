# BUG-108 — Frontend Code Not Running

**Project:** Hexa Quiz (Cyber-Smart Gaming for Education)
**Module:** 503IT — Communication and Collaboration
**Document type:** Defect report
**Test type:** Manual / build testing
**Build under test:** `hexa-quiz-frontend` v1.0.0 (React + Vite)

---

| Field | Detail |
|-------|--------|
| **ID** | BUG-108 |
| **Severity** | Critical |
| **Priority** | P1 |
| **Status** | Open |
| **Area** | Frontend build / dev environment (Vite + React) |
| **Environment** | OS: _[e.g. Windows 11]_ · Node.js: _[e.g. v20.x]_ · npm: _[e.g. 10.x]_ · Build: v1.0.0 |

**Preconditions:** Repository cloned; Node.js and npm installed.

**Steps to reproduce:**
1. Clone the repository.
2. Navigate to the `hexa-quiz` root directory (not `hexa-quiz/frontend`).
3. Run `npm install` and then `npm run dev`.
4. Observe the terminal output.

**Expected result:** The Vite development server starts successfully, and the app is accessible at `http://127.0.0.1:5173/`. All pages and assets load without errors.

**Actual result:** _[Describe — e.g. "Vite throws a 'failed to resolve import' error for image assets", "the dev server starts but the browser shows a blank page or asset 404 errors", "running npm commands from the wrong directory causes 'script not found' errors", "the build fails with missing module errors referencing image files in src/assets/images".]_

**Evidence:** `evidence/bug-108-frontend.*` _(terminal output / browser console screenshot)_

**Root cause:** `src/App.jsx` imports image assets that exist in `hexa-quiz/src/assets/images` but not in `hexa-quiz/frontend/src/assets/images`. Since the active Vite app runs from `hexa-quiz/frontend`, it cannot resolve assets outside its own directory. Running commands from the wrong directory compounds the issue.

**Suggested fix / notes:**
- Copy the missing images into `hexa-quiz/frontend/src/assets/images` so Vite can resolve them.
- Always run frontend commands from the `hexa-quiz/frontend` directory:
  ```
  cd hexa-quiz/frontend
  npm install
  npm run dev
  ```
- Remove temporary Vite log files (`.vite/`) after testing; do not commit them.
- Add `node_modules/` and `dist/` to `.gitignore` to avoid committing generated folders.
- Verify the app with `npm run build` before committing to catch any remaining import errors.

> **Why Critical / P1:** The frontend cannot run at all until this is resolved, blocking all testing and development work.
