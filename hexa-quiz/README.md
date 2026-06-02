# Hexa Quiz

Hexa Quiz is a CSV-driven cybersecurity training game with three age-specific
tracks: Kids Academy, Teen Cybercity, and Adult Intel.

## Hexa Pro Experience

The frontend uses a lightweight pseudo-3D presentation instead of a WebGL game
engine. This keeps the app fast and easy to run while adding a complete game
flow:

- A five-second animated Hexa logo intro with bright blink effects.
- A terminal-style local sign-up, login, resume-session, and guest portal.
- A player dashboard with local best scores, completed missions, bike points,
  and submitted-review count.
- Dark and light interface themes.
- An instruction manual modal available from the portal, home, and quiz screens.
- Procedural Web Audio background music for the portal, home screen, dashboard,
  topic-specific questions, bike stages, and results. The volume can be
  adjusted at any time.
- Browser narration for each question, all four answers, and correct or
  incorrect feedback.
- A three-stage difficulty run in every mode: five Easy, five Medium, and five
  Hard missions.
- Forced retry behavior after an incorrect answer.
- The supplied Three.js bike engine adapted into a playable 20-second HEXA
  reward ride after every resolved question. It includes a real 3D bike, road,
  footpaths, animated houses, walking pedestrians, collectibles, obstacles,
  collisions, boost and brake controls, keyboard controls, touch buttons, bike
  points, and a pause menu.
- A three-star results screen. A perfect first-try score of 15/15 earns all
  three stars.
- A game-review popup after the final results screen.

## Portal Notes

The included login portal is a local prototype. It hashes passcodes before
storing local demo accounts in browser storage, but it is not a substitute for
server-side authentication. Use a real backend authentication service, secure
session cookies, and a database before a public launch.

## Audio Notes

The adaptive soundtrack is generated in the browser, so it does not use
copyrighted music or external audio downloads. Modern browsers require a user
gesture before audio can start. The app unlocks the current scene soundtrack
after the player's first tap or click.

## Accuracy Notes

The CSV loader rejects malformed questions with missing options or invalid
correct-answer letters instead of silently assuming that option A is correct.
The final star score measures first-try answers. A player must still retry and
resolve every incorrectly answered scenario before progressing.

The educational scenarios are based on the references in
`frontend/public/content/references.md`. No educational app should promise
permanent factual accuracy: review the question bank periodically against the
latest guidance before using it for formal training.

## Run The Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Build The Frontend

```powershell
cd frontend
npm run build
```
