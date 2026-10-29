// Phantom Footage — frontend
// Tries the backend API first (shared videos and votes).
// Falls back to localStorage when the page is opened without the server
// (for example, from GitHub Pages or as a plain file), so it still works.
(function () {
  'use strict';

  var API_BASE = '';
  var STORAGE_VIDEOS = 'phantom-footage:videos';
  var STORAGE_VOTES = 'phantom-footage:votes';
  var STORAGE_VISITOR = 'phantom-footage:visitor';

  var seedVideos = [
    { id: 'seed-1', title: 'Ghost Caught in Hospital', url: '', votes: 0, createdAt: '2025-06-08T00:00:00.000Z', submitted: false, placeholder: true },
    { id: 'seed-2', title: 'Unexplained Figure in Woods', url: '', votes: 0, createdAt: '2025-06-09T00:00:00.000Z', submitted: false, placeholder: true }
  ];

  var state = {
    videos: [],
    myVotes: {}, // id -> 1, -1, or 0
    mode: 'local',
    search: '',
    sort: 'votes'
  };

  function $(id) { return document.getElementById(id); }

  function getVisitorId() {
    try {
      var id = localStorage.getItem(STORAGE_VISITOR);
      if (!id) {
        id = 'visitor-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
        localStorage.setItem(STORAGE_VISITOR, id);
      }
      return id;
    } catch (e) { return 'anonymous'; }
  }

  function loadLocal() {
    try {
      var raw = localStorage.getItem(STORAGE_VIDEOS);
      var saved = raw ? JSON.parse(raw) : [];
      var votesRaw = localStorage.getItem(STORAGE_VOTES);
      state.myVotes = votesRaw ? JSON.parse(votesRaw) : {};
      var byId = {};
      seedVideos.forEach(function (v) { byId[v.id] = Object.assign({}, v); });
      saved.forEach(function (v) { byId[v.id] = v; });
      state.videos = Object.keys(byId).map(function (k) { return byId[k]; });
      // Apply the visitor's own votes to the displayed totals for local mode.
      state.videos.forEach(function (v) {
        v.votes = (v.baseVotes || 0) + (state.myVotes[v.id] || 0);
      });
    } catch (e) {
      state.videos = seedVideos.map(function (v) { return Object.assign({}, v); });
      state.myVotes = {};
    }
  }

  function saveLocal() {
    try {
      var submitted = state.videos.filter(function (v) { return v.submitted; });
      localStorage.setItem(STORAGE_VIDEOS, JSON.stringify(submitted));
      localStorage.setItem(STORAGE_VOTES, JSON.stringify(state.myVotes));
    } catch (e) { /* storage unavailable: page still works for this visit */ }
  }

  function toEmbedUrl(input) {
    var text = (input || '').trim();
    var embedMatch = text.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/);
    if (embedMatch) return 'https://www.youtube.com/embed/' + embedMatch[1];
    var watchMatch = text.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
    if (watchMatch) return 'https://www.youtube.com/embed/' + watchMatch[1];
    var shortMatch = text.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
    if (shortMatch) return 'https://www.youtube.com/embed/' + shortMatch[1];
    return null;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function sortedVideos() {
    var q = state.search.trim().toLowerCase();
    var list = state.videos.filter(function (v) {
      return !q || v.title.toLowerCase().indexOf(q) !== -1;
    });
    if (state.sort === 'votes') {
      list.sort(function (a, b) { return b.votes - a.votes; });
    } else if (state.sort === 'newest') {
      list.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    } else {
      list.sort(function (a, b) { return a.title.localeCompare(b.title); });
    }
    return list;
  }

  function render() {
    var grid = $('videoGrid');
    var empty = $('emptyState');
    var note = $('savedNote');
    var list = sortedVideos();
    grid.innerHTML = '';
    empty.hidden = list.length !== 0;
    note.textContent = state.mode === 'api'
      ? 'Connected to the shared backend: videos and votes are shared with other visitors.'
      : 'No backend detected: videos and votes are saved in this browser only.';
    list.forEach(function (video) {
      var card = document.createElement('div');
      card.className = 'video-card';
      var myVote = state.myVotes[video.id] || 0;
      var media = video.placeholder || !video.url
        ? '<div class="video-placeholder">Example video — replace it by submitting a real YouTube link.</div>'
        : '<iframe src="' + escapeHtml(video.url) + '" allowfullscreen title="' + escapeHtml(video.title) + '"></iframe>';
      var removeButton = video.submitted
        ? '<button type="button" class="remove-button" data-action="remove">Remove</button>'
        : '';
      card.innerHTML =
        '<h3>' + escapeHtml(video.title) + '</h3>' + media +
        '<div class="vote-buttons">' +
        '<button type="button" data-action="up" aria-pressed="' + (myVote === 1) + '" aria-label="Upvote">👍</button>' +
        '<span class="vote-count">' + video.votes + '</span>' +
        '<button type="button" data-action="down" aria-pressed="' + (myVote === -1) + '" aria-label="Downvote">👎</button>' +
        removeButton +
        '</div>';
      card.querySelector('[data-action="up"]').addEventListener('click', function () { vote(video.id, 1); });
      card.querySelector('[data-action="down"]').addEventListener('click', function () { vote(video.id, -1); });
      var remove = card.querySelector('[data-action="remove"]');
      if (remove) remove.addEventListener('click', function () { removeVideo(video.id); });
      grid.appendChild(card);
    });
  }

  function vote(id, delta) {
    var current = state.myVotes[id] || 0;
    var next = current === delta ? 0 : delta; // tapping the same vote again clears it
    if (state.mode === 'api') {
      fetch(API_BASE + '/api/videos/' + encodeURIComponent(id) + '/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: next, visitorId: getVisitorId() })
      }).then(function (res) { return res.json(); }).then(function (data) {
        if (data && data.video) {
          state.myVotes[id] = next;
          var v = state.videos.find(function (x) { return x.id === id; });
          if (v) v.votes = data.video.votes;
          render();
        }
      }).catch(function () { /* keep the previous display on error */ });
      return;
    }
    state.myVotes[id] = next;
    var video = state.videos.find(function (x) { return x.id === id; });
    if (video) {
      var base = video.baseVotes || 0;
      // Seed videos were stored with votes already including the old vote;
      // recompute from the base so toggling cannot drift the total.
      if (video.baseVotes === undefined) { video.baseVotes = video.votes - current; base = video.baseVotes; }
      video.votes = base + next;
    }
    saveLocal();
    render();
  }

  function removeVideo(id) {
    if (state.mode === 'api') {
      fetch(API_BASE + '/api/videos/' + encodeURIComponent(id), { method: 'DELETE' })
        .then(function () { return loadFromApi(); })
        .catch(function () { /* keep the previous display on error */ });
      return;
    }
    state.videos = state.videos.filter(function (v) { return v.id !== id; });
    delete state.myVotes[id];
    saveLocal();
    render();
  }

  function loadFromApi() {
    return fetch(API_BASE + '/api/videos?visitorId=' + encodeURIComponent(getVisitorId()))
      .then(function (res) {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then(function (data) {
        state.mode = 'api';
        state.videos = data.videos || [];
        // The server returns each visitor's own vote in myVote.
        state.videos.forEach(function (v) { state.myVotes[v.id] = v.myVote || 0; });
        render();
      });
  }

  function init() {
    var search = $('searchInput');
    var sort = $('sortSelect');
    var form = $('submitForm');
    var error = $('formError');
    search.addEventListener('input', function () { state.search = search.value; render(); });
    sort.addEventListener('change', function () { state.sort = sort.value; render(); });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      error.hidden = true;
      var title = $('videoTitle').value.trim();
      var embed = toEmbedUrl($('videoUrl').value);
      if (!title || !embed) {
        error.textContent = 'Please enter a title and a valid YouTube link.';
        error.hidden = false;
        return;
      }
      if (state.mode === 'api') {
        fetch(API_BASE + '/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: title, url: embed })
        }).then(function (res) { return res.json(); }).then(function (data) {
          if (data && data.video) {
            state.videos.push(data.video);
            $('videoTitle').value = '';
            $('videoUrl').value = '';
            render();
          }
        }).catch(function () {
          error.textContent = 'Could not save that video to the backend. Please try again.';
          error.hidden = false;
        });
        return;
      }
      var video = {
        id: 'local-' + Date.now().toString(36),
        title: title,
        url: embed,
        votes: 0,
        baseVotes: 0,
        createdAt: new Date().toISOString(),
        submitted: true,
        placeholder: false
      };
      state.videos.push(video);
      saveLocal();
      $('videoTitle').value = '';
      $('videoUrl').value = '';
      render();
    });
    loadLocal();
    render();
    loadFromApi().catch(function () { state.mode = 'local'; render(); });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
