// Realtime presence for the Temple — everyone walking the courts sees everyone else.
//
// Deliberately tiny: the server owns nothing but a name and a pose per socket, and never
// trusts either. There is no chat here on purpose — free text between strangers in a
// children's space needs a moderation plan, not just a text box.
const { WebSocketServer } = require('ws');

const TICK_MS = 80;            // 12.5 Hz — plenty for walking pace, cheap on a hobby dyno
// Chrome throttles timers in a backgrounded tab to roughly once a minute, so anything under
// ~90s here would reap visitors who simply switched tabs. The client keeps a pose heartbeat.
const IDLE_MS = 120000;
const MAX_VISITORS = 60;       // past this the courtyard is full; keeps broadcast cost bounded
const EMOTE_COUNT = 4;         // must match the EMOTES list in index.html
const EMOTE_MS = 4000;         // how long a greeting stays up over someone's head

// Auto-assigned names, so a visitor who types nothing still has an identity.
const TRIBES = ['Reuven', 'Shimon', 'Levi', 'Yehuda', 'Dan', 'Naftali', 'Gad', 'Asher',
                'Yissachar', 'Zevulun', 'Yosef', 'Binyamin'];

// Names are shown to children, so allow only letters, digits, spaces and hyphens, and cap
// the length. This is sanitation, not moderation — see the note in the README.
function cleanName(raw, fallback) {
  if (typeof raw !== 'string') return fallback;
  const n = raw.replace(/[^\p{L}\p{N} '-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 14);
  return n || fallback;
}

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

module.exports = function attachPresence(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  const visitors = new Map();  // ws -> {id, name, x, y, z, ry, seen}
  let nextId = 1;

  wss.on('connection', (ws) => {
    if (visitors.size >= MAX_VISITORS) { ws.close(1013, 'courtyard full'); return; }
    const id = nextId++;
    const v = { id, name: TRIBES[id % TRIBES.length] + ' ' + id, x: 0, y: 0, z: 96, ry: 0, seen: Date.now() };
    visitors.set(ws, v);
    ws.send(JSON.stringify({ t: 'welcome', id, name: v.name }));

    ws.on('message', (buf) => {
      let m; try { m = JSON.parse(buf); } catch { return; }
      v.seen = Date.now();
      if (m.t === 'hello') v.name = cleanName(m.name, v.name);
      else if (m.t === 'pose') { v.x = num(m.x); v.y = num(m.y); v.z = num(m.z); v.ry = num(m.ry); }
      // Emotes are a fixed, numbered set — the whole point is that visitors can greet each
      // other without anyone being able to type anything. An out-of-range index is dropped.
      else if (m.t === 'emote' && Number.isInteger(m.e) && m.e >= 0 && m.e < EMOTE_COUNT) {
        v.em = m.e; v.emSeq = (v.emSeq || 0) + 1; v.emAt = Date.now();
      }
    });

    const bye = () => visitors.delete(ws);
    ws.on('close', bye);
    ws.on('error', bye);
  });

  // One snapshot per tick. Each visitor is sent everyone *else*, so no client has to
  // filter itself out and a lagging client can never see itself stutter.
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [ws, v] of visitors) {
      if (now - v.seen > IDLE_MS) { visitors.delete(ws); try { ws.close(); } catch {} }
    }
    if (!visitors.size) return;
    const all = [...visitors.values()];
    for (const [ws, self] of visitors) {
      if (ws.readyState !== ws.OPEN) continue;
      const others = all.filter((o) => o.id !== self.id)
        .map((o) => {
          const p = { id: o.id, name: o.name, x: +o.x.toFixed(2), y: +o.y.toFixed(2), z: +o.z.toFixed(2), ry: +o.ry.toFixed(2) };
          if (o.emSeq && now - o.emAt < EMOTE_MS) { p.em = o.em; p.emSeq = o.emSeq; }
          return p;
        });
      ws.send(JSON.stringify({ t: 'state', here: all.length, ps: others }));
    }
  }, TICK_MS);

  wss.on('close', () => clearInterval(timer));
  return wss;
};
