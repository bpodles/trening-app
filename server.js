// Prosty serwer statyczny do lokalnego uruchomienia/testów PWA.
// Użycie: node server.js  → http://localhost:8123
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8123;
const ROOT = __dirname;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.md': 'text/markdown; charset=utf-8'
};

http.createServer((req, res) => {
  let file = decodeURIComponent(req.url.split('?')[0]);
  if (file === '/') file = '/index.html';
  const full = path.join(ROOT, path.normalize(file));
  if (!full.startsWith(ROOT) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
    res.writeHead(404); res.end('Not found'); return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(full)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(full).pipe(res);
}).listen(PORT, () => console.log(`Serwer działa: http://localhost:${PORT}`));
