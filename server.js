// Minimal static server for the Temple web app. Serves its own folder (__dirname),
// so it has no dependency on the process working directory.
// It also carries the realtime presence layer on /ws — see visitors.js.
const http = require('http');
const fs = require('fs');
const path = require('path');
const attachPresence = require('./visitors');

const root = __dirname;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
};
const PORT = Number(process.env.PORT) || 8123;

const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/' || u.endsWith('/')) u += 'index.html';
  const file = path.normalize(path.join(root, u));
  if (!file.startsWith(root)) { res.statusCode = 403; res.end('forbidden'); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.statusCode = 404; res.end('not found'); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});

attachPresence(server);

server.listen(PORT, () => console.log('temple server on http://127.0.0.1:' + PORT + '  (presence on /ws)'));
