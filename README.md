# The Beis HaMikdash — a learning game 🏛️

An explorable, kid‑friendly 3D model of the Holy Temple (Beis HaMikdash) of Jerusalem, built as
a learning **escape room**: walk through the courts, answer questions about the Temple to open
each glowing gate, collect golden coins, and find your way into the Holy of Holies.

▶ **Play it:** https://tribesofisrael613.github.io/beis-hamikdash/

Built with [three.js](https://threejs.org). Modeled on the future Temple as described by the
**Ramchal** in *Mishkney Elyon* (Yechezkel 40–48) — the gates, the Levites on the Nicanor steps,
the altar, the Menorah and the vessels, the Kohen Gadol before the Aron, and more.

## Controls
- **Computer** — **Walk:** W A S D / arrow keys · **Look:** mouse · **M** mute · **V** read‑aloud voice · **T** free‑roam tour
- **Phone / tablet** — tap an age button to start · **left side** of the screen is a walk stick · **drag the right side** to look · **tap** the answers · in the guard phase, tap **Sound the shofar**
- **Answer** the question at each glowing gate to open it · **Collect** the golden coins · reach the **Holy of Holies** to win

## Run locally
```
node server.js          # or:  python3 -m http.server 8123
```
then open http://localhost:8123

(A local server is needed — opening the file directly won't load the 3D modules.)

---
Made for Torah learning. 🕎
