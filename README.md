<!DOCTYPE html><html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Phantom Footage showcases strange, creepy, and paranormal videos caught on camera." />
  <meta name="keywords" content="creepy videos, paranormal, scary footage, ghost sightings, unexplained videos" />
  <title>Phantom Footage</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #111;
      color: #eee;
      margin: 0;
      padding: 0;
    }
    header {
      background-color: #000;
      padding: 1rem;
      text-align: center;
    }
    header h1 {
      color: #f00;
      font-size: 2.5rem;
    }
    .video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }
    .video-card {
      background-color: #222;
      padding: 1rem;
      border-radius: 10px;
    }
    .video-card iframe {
      width: 100%;
      height: 200px;
      border: none;
    }
    .vote-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
    }
    .vote-buttons button {
      background-color: #444;
      color: #fff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      cursor: pointer;
    }
    .vote-buttons button:hover {
      background-color: #666;
    }
    footer {
      background-color: #000;
      color: #999;
      text-align: center;
      padding: 1rem;
    }
    .submit-section {
      background-color: #1a1a1a;
      padding: 2rem;
      text-align: center;
    }
    .submit-section input, .submit-section button {
      padding: 0.5rem;
      margin: 0.5rem;
      width: 300px;
      max-width: 90%;
      border-radius: 5px;
      border: none;
    }
    .submit-section button {
      background-color: #f00;
      color: white;
      cursor: pointer;
    }
    .submit-section button:hover {
      background-color: #c00;
    }
  </style>
</head>
<body>
  <header>
    <h1>Phantom Footage</h1>
    <p>Strange and creepy videos caught on camera</p>
  </header>  <div class="video-grid" id="videoGrid">
    <!-- Video cards will be dynamically inserted here -->
  </div>  <div class="submit-section">
    <h2>Submit Your Video</h2>
    <input type="text" id="videoTitle" placeholder="Video Title" />
    <input type="text" id="videoURL" placeholder="YouTube Embed Link" />
    <button onclick="submitVideo()">Submit</button>
  </div>  <footer>
    <p>&copy; 2025 Phantom Footage. All rights reserved.</p>
  </footer>  <script>
    const videos = [
      {
        title: "Ghost Caught in Hospital",
        url: "https://www.youtube.com/embed/VIDEO_ID1",
        votes: 0
      },
      {
        title: "Unexplained Figure in Woods",
        url: "https://www.youtube.com/embed/VIDEO_ID2",
        votes: 0
      }
    ];

    function renderVideos() {
      const grid = document.getElementById("videoGrid");
      grid.innerHTML = "";
      videos.forEach((video, index) => {
        const card = document.createElement("div");
        card.className = "video-card";
        card.innerHTML = `
          <h3>${video.title}</h3>
          <iframe src="${video.url}" allowfullscreen></iframe>
          <div class="vote-buttons">
            <button onclick="vote(${index}, 1)">👍</button>
            <span id="vote-count-${index}">${video.votes}</span>
            <button onclick="vote(${index}, -1)">👎</button>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function vote(index, delta) {
      videos[index].votes += delta;
      document.getElementById(`vote-count-${index}`).textContent = videos[index].votes;
    }

    function submitVideo() {
      const title = document.getElementById("videoTitle").value.trim();
      const url = document.getElementById("videoURL").value.trim();
      if (title && url && url.includes("https://www.youtube.com/embed/")) {
        videos.push({ title, url, votes: 0 });
        renderVideos();
        document.getElementById("videoTitle").value = "";
        document.getElementById("videoURL").value = "";
      } else {
        alert("Please enter a valid title and YouTube embed link.");
      }
    }

    renderVideos();
  </script></body>
</html><!DOCTYPE html><html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Phantom Footage showcases strange, creepy, and paranormal videos caught on camera." />
  <meta name="keywords" content="creepy videos, paranormal, scary footage, ghost sightings, unexplained videos" />
  <title>Phantom Footage</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #111;
      color: #eee;
      margin: 0;
      padding: 0;
    }
    header {
      background-color: #000;
      padding: 1rem;
      text-align: center;
    }
    header h1 {
      color: #f00;
      font-size: 2.5rem;
    }
    .video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }
    .video-card {
      background-color: #222;
      padding: 1rem;
      border-radius: 10px;
    }
    .video-card iframe {
      width: 100%;
      height: 200px;
      border: none;
    }
    .vote-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
    }
    .vote-buttons button {
      background-color: #444;
      color: #fff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      cursor: pointer;
    }
    .vote-buttons button:hover {
      background-color: #666;
    }
    footer {
      background-color: #000;
      color: #999;
      text-align: center;
      padding: 1rem;
    }
    .submit-section {
      background-color: #1a1a1a;
      padding: 2rem;
      text-align: center;
    }
    .submit-section input, .submit-section button {
      padding: 0.5rem;
      margin: 0.5rem;
      width: 300px;
      max-width: 90%;
      border-radius: 5px;
      border: none;
    }
    .submit-section button {
      background-color: #f00;
      color: white;
      cursor: pointer;
    }
    .submit-section button:hover {
      background-color: #c00;
    }
  </style>
</head>
<body>
  <header>
    <h1>Phantom Footage</h1>
    <p>Strange and creepy videos caught on camera</p>
  </header>  <div class="video-grid" id="videoGrid">
    <!-- Video cards will be dynamically inserted here -->
  </div>  <div class="submit-section">
    <h2>Submit Your Video</h2>
    <input type="text" id="videoTitle" placeholder="Video Title" />
    <input type="text" id="videoURL" placeholder="YouTube Embed Link" />
    <button onclick="submitVideo()">Submit</button>
  </div>  <footer>
    <p>&copy; 2025 Phantom Footage. All rights reserved.</p>
  </footer>  <script>
    const videos = [
      {
        title: "Ghost Caught in Hospital",
        url: "https://www.youtube.com/embed/VIDEO_ID1",
        votes: 0
      },
      {
        title: "Unexplained Figure in Woods",
        url: "https://www.youtube.com/embed/VIDEO_ID2",
        votes: 0
      }
    ];

    function renderVideos() {
      const grid = document.getElementById("videoGrid");
      grid.innerHTML = "";
      videos.forEach((video, index) => {
        const card = document.createElement("div");
        card.className = "video-card";
        card.innerHTML = `
          <h3>${video.title}</h3>
          <iframe src="${video.url}" allowfullscreen></iframe>
          <div class="vote-buttons">
            <button onclick="vote(${index}, 1)">👍</button>
            <span id="vote-count-${index}">${video.votes}</span>
            <button onclick="vote(${index}, -1)">👎</button>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function vote(index, delta) {
      videos[index].votes += delta;
      document.getElementById(`vote-count-${index}`).textContent = videos[index].votes;
    }

    function submitVideo() {
      const title = document.getElementById("videoTitle").value.trim();
      const url = document.getElementById("videoURL").value.trim();
      if (title && url && url.includes("https://www.youtube.com/embed/")) {
        videos.push({ title, url, votes: 0 });
        renderVideos();
        document.getElementById("videoTitle").value = "";
        document.getElementById("videoURL").value = "";
      } else {
        alert("Please enter a valid title and YouTube embed link.");
      }
    }

    renderVideos();
  </script></body>
</html><!DOCTYPE html><html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Phantom Footage showcases strange, creepy, and paranormal videos caught on camera." />
  <meta name="keywords" content="creepy videos, paranormal, scary footage, ghost sightings, unexplained videos" />
  <title>Phantom Footage</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #111;
      color: #eee;
      margin: 0;
      padding: 0;
    }
    header {
      background-color: #000;
      padding: 1rem;
      text-align: center;
    }
    header h1 {
      color: #f00;
      font-size: 2.5rem;
    }
    .video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }
    .video-card {
      background-color: #222;
      padding: 1rem;
      border-radius: 10px;
    }
    .video-card iframe {
      width: 100%;
      height: 200px;
      border: none;
    }
    .vote-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
    }
    .vote-buttons button {
      background-color: #444;
      color: #fff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      cursor: pointer;
    }
    .vote-buttons button:hover {
      background-color: #666;
    }
    footer {
      background-color: #000;
      color: #999;
      text-align: center;
      padding: 1rem;
    }
    .submit-section {
      background-color: #1a1a1a;
      padding: 2rem;
      text-align: center;
    }
    .submit-section input, .submit-section button {
      padding: 0.5rem;
      margin: 0.5rem;
      width: 300px;
      max-width: 90%;
      border-radius: 5px;
      border: none;
    }
    .submit-section button {
      background-color: #f00;
      color: white;
      cursor: pointer;
    }
    .submit-section button:hover {
      background-color: #c00;
    }
  </style>
</head>
<body>
  <header>
    <h1>Phantom Footage</h1>
    <p>Strange and creepy videos caught on camera</p>
  </header>  <div class="video-grid" id="videoGrid">
    <!-- Video cards will be dynamically inserted here -->
  </div>  <div class="submit-section">
    <h2>Submit Your Video</h2>
    <input type="text" id="videoTitle" placeholder="Video Title" />
    <input type="text" id="videoURL" placeholder="YouTube Embed Link" />
    <button onclick="submitVideo()">Submit</button>
  </div>  <footer>
    <p>&copy; 2025 Phantom Footage. All rights reserved.</p>
  </footer>  <script>
    const videos = [
      {
        title: "Ghost Caught in Hospital",
        url: "https://www.youtube.com/embed/VIDEO_ID1",
        votes: 0
      },
      {
        title: "Unexplained Figure in Woods",
        url: "https://www.youtube.com/embed/VIDEO_ID2",
        votes: 0
      }
    ];

    function renderVideos() {
      const grid = document.getElementById("videoGrid");
      grid.innerHTML = "";
      videos.forEach((video, index) => {
        const card = document.createElement("div");
        card.className = "video-card";
        card.innerHTML = `
          <h3>${video.title}</h3>
          <iframe src="${video.url}" allowfullscreen></iframe>
          <div class="vote-buttons">
            <button onclick="vote(${index}, 1)">👍</button>
            <span id="vote-count-${index}">${video.votes}</span>
            <button onclick="vote(${index}, -1)">👎</button>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function vote(index, delta) {
      videos[index].votes += delta;
      document.getElementById(`vote-count-${index}`).textContent = videos[index].votes;
    }

    function submitVideo() {
      const title = document.getElementById("videoTitle").value.trim();
      const url = document.getElementById("videoURL").value.trim();
      if (title && url && url.includes("https://www.youtube.com/embed/")) {
        videos.push({ title, url, votes: 0 });
        renderVideos();
        document.getElementById("videoTitle").value = "";
        document.getElementById("videoURL").value = "";
      } else {
        alert("Please enter a valid title and YouTube embed link.");
      }
    }

    renderVideos();
  </script></body>
</html># Phantom-Footage
