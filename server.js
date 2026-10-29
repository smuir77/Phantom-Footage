// Phantom Footage backend — Node.js, no external dependencies.
// Serves the frontend and a small JSON API backed by data.json.
// Run:  node server.js
// Then open http://localhost:3000 (or the PORT environment variable).
//
// API:
//   GET    /api/videos                 -> { videos: [...] }
//   POST   /api/videos                 -> { video }  body: { title, url }
//   POST   /api/videos/:id/vote        -> { video }  body: { delta: -1|0|1, visitorId }
//   DELETE /api/videos/:id             -> { ok: true }
//
// A video's votes are the sum of each visitor's vote (-1, 0, or 1), so a
// visitor can change or clear their vote without voting twice.
// Note: data.json lives on the server's filesystem. On hosts with an
// ephemeral filesystem, stored videos and votes can reset when the
// service restarts. For long-term shared storage, swap data.json for a
// hosted database — the API shape above stays the same.
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const PUBLIC_DIR = __dirname;

const seedVideos = [];

function loadData() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (Array.isArray(parsed.videos)) return parsed;
  } catch (e) { /* missing or unreadable: start empty */ }
  return { videos: [] };
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function totalVotes(video) {
  return Object.values(video.votesByVisitor || {}).reduce((sum, v) => sum + (v || 0), 0);
}

function publicVideo(video, visitorId) {
  return {
    id: video.id,
    title: video.title,
    url: video.url,
    votes: totalVotes(video),
    myVote: visitorId ? (video.votesByVisitor[visitorId] || 0) : 0,
    createdAt: video.createdAt,
    submitted: !!video.submitted,
    placeholder: !!video.placeholder,
  };
}

function toEmbedUrl(input) {
  const text = String(input || '').trim();
  const embed = text.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/);
  if (embed) return 'https://www.youtube.com/embed/' + embed[1];
  const watch = text.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
  if (watch) return 'https://www.youtube.com/embed/' + watch[1];
  const short = text.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
  if (short) return 'https://www.youtube.com/embed/' + short[1];
  return null;
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 100000) req.destroy();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
};

function serveStatic(req, res, urlPath) {
  const requested = urlPath === '/' ? '/index.html' : urlPath;
  const safePath = path.normalize(requested).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const visitorId = req.headers['x-visitor-id'] || url.searchParams.get('visitorId') || null;

  // API routes
  if (url.pathname === '/api/videos' && req.method === 'GET') {
    const data = loadData();
    return sendJson(res, 200, { videos: data.videos.map((v) => publicVideo(v, visitorId)) });
  }

  if (url.pathname === '/api/videos' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const title = String(body.title || '').trim().slice(0, 120);
      const embed = toEmbedUrl(body.url);
      if (!title || !embed) return sendJson(res, 400, { error: 'A title and a valid YouTube link are required.' });
      const data = loadData();
      const video = {
        id: 'video-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
        title,
        url: embed,
        createdAt: new Date().toISOString(),
        submitted: true,
        placeholder: false,
        votesByVisitor: {},
      };
      data.videos.push(video);
      saveData(data);
      return sendJson(res, 201, { video: publicVideo(video, visitorId) });
    } catch (e) {
      return sendJson(res, 400, { error: 'Invalid request body.' });
    }
  }

  const voteMatch = url.pathname.match(/^\/api\/videos\/([^/]+)\/vote$/);
  if (voteMatch && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const delta = body.delta === 1 || body.delta === -1 ? body.delta : 0;
      const voter = String(body.visitorId || visitorId || '').trim();
      if (!voter) return sendJson(res, 400, { error: 'A visitorId is required to vote.' });
      const data = loadData();
      const video = data.videos.find((v) => v.id === voteMatch[1]);
      if (!video) return sendJson(res, 404, { error: 'Video not found.' });
      video.votesByVisitor = video.votesByVisitor || {};
      if (delta === 0) delete video.votesByVisitor[voter];
      else video.votesByVisitor[voter] = delta;
      saveData(data);
      return sendJson(res, 200, { video: publicVideo(video, voter) });
    } catch (e) {
      return sendJson(res, 400, { error: 'Invalid request body.' });
    }
  }

  const deleteMatch = url.pathname.match(/^\/api\/videos\/([^/]+)$/);
  if (deleteMatch && req.method === 'DELETE') {
    const data = loadData();
    const before = data.videos.length;
    data.videos = data.videos.filter((v) => v.id !== deleteMatch[1]);
    if (data.videos.length === before) return sendJson(res, 404, { error: 'Video not found.' });
    saveData(data);
    return sendJson(res, 200, { ok: true });
  }

  if (url.pathname.startsWith('/api/')) {
    return sendJson(res, 404, { error: 'Unknown API route.' });
  }

  return serveStatic(req, res, url.pathname);
});

server.listen(PORT, () => {
  console.log('Phantom Footage running at http://localhost:' + PORT);
});
