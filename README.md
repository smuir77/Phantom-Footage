# Phantom Footage

Strange, creepy, and paranormal videos caught on camera.

A video grid with search, sorting by votes, up/down voting, and a submit
form for YouTube videos. The two starting entries are examples — submit a
real YouTube link to replace them with playable videos.

## How it works

- **Frontend:** `index.html`, `style.css`, and `app.js`. No build step.
- **Backend:** `server.js` (Node.js, no external dependencies). It serves
  the frontend and a small JSON API, storing videos and votes in
  `data.json`.
- **API:**
  - `GET /api/videos` — list videos, with vote totals
  - `POST /api/videos` — add a video (`{ title, url }`, YouTube watch,
    short, or embed link)
  - `POST /api/videos/:id/vote` — vote (`{ delta: 1 | 0 | -1, visitorId }`;
    tapping the same vote again clears it)
  - `DELETE /api/videos/:id` — remove a video
- **Fallback:** if the page is opened without the backend (for example,
  from GitHub Pages or as a plain file), videos and votes are saved in
  the visitor's browser with `localStorage` instead, so the page still
  works — but those saves are not shared with other visitors.

## Run it locally

```sh
node server.js
```

Then open http://localhost:3000

No dependencies to install. Requires Node.js 18 or newer.

## Deploy it

This is a plain Node.js web service, so it needs a host that runs a
server — GitHub Pages alone will not run it (it only serves static
files, so the frontend will fall back to browser-only saving there).

On a host such as Render, Railway, or a VPS:

- Start command: `node server.js`
- Port: the host's `PORT` environment variable is used automatically
- No build command is needed

## Storage note

`data.json` lives on the server's filesystem. On hosts with an
ephemeral filesystem, stored videos and votes can reset when the
service restarts. For long-term shared storage, replace `data.json`
with a hosted database — the API shape above stays the same.
