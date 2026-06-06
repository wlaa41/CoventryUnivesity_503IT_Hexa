# Solution for [BUG-108] Frontend code not running

## Root Cause
The frontend failed to run because `src/App.jsx` imported image assets that were missing from the frontend asset folder.  
The files existed in the main `hexa-quiz/src/assets/images` folder, but Vite was running from `hexa-quiz/frontend`, so it could only resolve assets inside `frontend/src/assets/images`.  
Running commands from the wrong directory also caused confusion because the active frontend app is inside the `frontend` folder.

## Fix
- Copy the missing images into `hexa-quiz/frontend/src/assets/images`.
- Run the frontend commands from `hexa-quiz/frontend`.
- Remove temporary Vite log files after testing.
- Avoid committing generated folders such as `node_modules` and `dist`.
- Verify the app with `npm run build` before committing.

## Code Suggestion
```powershell
cd hexa-quiz/frontend
npm install
npm run dev
```

Open:
```text
http://127.0.0.1:5173/
```
