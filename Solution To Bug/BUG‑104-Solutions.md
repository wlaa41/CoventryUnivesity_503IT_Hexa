# Solution for [BUG-104] Narration voice needs changing (usability)

## Root Cause
The default SpeechSynthesis voice varies across browsers and devices.  
Some voices sound robotic, too fast, or not age‑appropriate — especially for the Kids track.  
Different browsers load different voice libraries, causing inconsistency.

## Fix
- Select a clearer, more natural voice programmatically (e.g., Google UK English Female, if available).
- Adjust narration **rate**, **pitch**, and **volume** for better clarity.
- Add a **voice selector** in the settings menu so users can choose their preferred voice.
- Provide a **mute narration** option for accessibility and user comfort.

## Code Suggestion
```js
const utterance = new SpeechSynthesisUtterance(text);
utterance.rate = 0.9;   // slower for clarity
utterance.pitch = 1;    // natural tone
utterance.volume = 1;   // full volume
speechSynthesis.speak(utterance);
