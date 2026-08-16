# The Beis HaMikdash — a learning game 🏛️

An explorable, kid‑friendly 3D model of the Holy Temple (Beis HaMikdash) of Jerusalem, built as
a learning **escape room**: walk through the courts, answer questions about the Temple to open
each glowing gate, collect golden coins, and find your way into the Holy of Holies.

▶ **Play it:** https://tribesofisrael613.github.io/beis-hamikdash/

Built with [three.js](https://threejs.org). Modeled on the future Temple as described by the
**Ramchal** in *Mishkney Elyon* (Yechezkel 40–48) — the gates, the Levites on the Nicanor steps,
the altar, the Menorah and the vessels, the Kohen Gadol before the Aron, and more.

## Controls
- **Computer** — **Walk:** W A S D / arrow keys · **Look:** mouse · **Greet:** 1 2 3 4 · **M** mute · **V** read‑aloud voice · **T** free‑roam tour
  - If the browser refuses pointer lock (an iframe, a locked‑down school browser, Chrome's
    cooldown after Esc), the game starts anyway — **hold the mouse button** to look around.
- **Phone / tablet** — tap an age button to start · **left side** of the screen is a walk stick · **drag the right side** to look · **tap** the answers · in the guard phase, tap **Sound the shofar**
- **Answer** the question at each glowing gate to open it · **Collect** the golden coins · reach the **Holy of Holies** to win

## Visiting together

The temple is a meeting place. Everyone connected to the same server walks the courts at the
same time: other visitors appear as blue‑robed figures with their name above them, and the HUD
shows how many are here. Names are assigned from the twelve tribes (*Levi 2*, *Binyamin 7*).

Greet each other with **1 2 3 4** (👋 Shalom · 🙏 Amen · 📖 Learning · ✨ Wow) — on a phone the
same four sit in a row on the right, appearing only once somebody else is here. The greeting
floats over your head for four seconds.

There is deliberately **no chat**. That fixed set of four is the whole vocabulary: free text
between strangers in a children's space needs a moderation plan, not just a text box, so
presence ships first and conversation waits for that decision. Names are sanitised (letters,
digits, spaces, hyphens, 14 chars) but *not* moderated.

Presence needs the Node server below. Served as plain static files — GitHub Pages, or opening
`index.html` directly — the game runs exactly as it always did, single‑player, and says nothing.
Add `?solo=1` to visit alone, or `?server=wss://host/ws` to point at a presence server elsewhere.

## Run locally
```
npm install     # once — pulls in ws, the only dependency
node server.js
```
then open http://localhost:8123

`python3 -m http.server 8123` still serves the game, but without other visitors.

(A local server is needed either way — opening the file directly won't load the 3D modules.)

---
Made for Torah learning. 🕎
