# PPWNR URL Shortener CLI 🎮

A **retro pixel-style URL shortener** with a **terminal-like interface** and animated matrix background.

Users can **paste a URL and press Enter** to generate a shortened link instantly.

The UI is designed to look like a **pixel hacker terminal** with interactive background effects.

---

# ✨ Features

- 🎮 PPWNR CLI Interface (retro terminal style)
- 🖱 Matrix background animation following mouse
- 📋 One-click copy shortened link
- 🔗 Open shortened link instantly
- 🟢 CRT scanline effect
- ⚡ Fast URL shortening API
- 🧠 Redis cache for faster redirects

---

# 📸 Example

```
PIXEL URL SHORTENER v1.0

SYSTEM READY
PASTE URL AND PRESS ENTER

> https://example.com/very-long-url

PROCESSING...
SHORT LINK CREATED
http://localhost:888/b

[ COPY ]   [ OPEN ]
```

---

# 🧱 Tech Stack

### Frontend
- HTML
- CSS
- Vanilla JavaScript
- Canvas API (Matrix animation)

### Backend
- Node.js
- Express.js

### Database
- MariaDB / MySQL

### Cache
- Redis

---

# 📂 Project Structure

```
project
│
├─ api
│  ├─ server.js
│  ├─ base62.js
│  ├─ db.js
│  └─ redis.js
│
├─ public
│  └─ index.html
│
├─ docker-compose.yml
└─ README.md
```

---

# 🚀 Getting Started

## 1. Clone repository

```bash
git clone https://github.com/yourusername/pixel-url-shortener.git
cd pixel-url-shortener
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Start server

```bash
node server.js
```

Server will run on:

```
http://localhost:888
```

---

# ⚡ Usage

Paste a URL into the terminal input.

Example:

```
> https://google.com
```

Output:

```
PROCESSING...
SHORT LINK CREATED
http://localhost:888/a
```

Actions:

```
[ COPY ]   → Copy link to clipboard
[ OPEN ]   → Open shortened link
```

---

# 📡 API Endpoints

### Create Short URL

```
POST /api/shorten
```

Example request:

```json
{
  "url": "https://google.com"
}
```

Response:

```json
{
  "shortUrl": "http://localhost:888/a"
}
```

---

### Redirect

```
GET /:code
```

Example:

```
http://localhost:888/a
```

---

### Stats

```
GET /api/stats/:code
```

Response example:

```json
{
  "click_count": 15,
  "created_at": "2026-03-12T08:00:00.000Z"
}
```

---

# 🐳 Docker (Optional)

Run with Docker:

```bash
docker compose up -d
```

Then open:

```
http://localhost:888
```

---

# 🎨 UI Highlights

- Retro **8-bit pixel font**
- Interactive **matrix background**
- Mouse reactive animation
- **CRT scanline** monitor effect
- Pixel-style buttons

---

# 🔮 Future Improvements

Planned features:

- 📊 Link analytics dashboard
- ⏱ Expiring links
- 🔑 Private links
- 🌍 Custom domain support
- 👥 User accounts
- 📈 Click statistics
- 🎮 More pixel UI effects

---

# 📜 License

MIT License