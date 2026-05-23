# React Registration Form

A registration form built with React, Vite, Express, and SQLite.

## Setup

```bash
git clone https://github.com/sadabnepal/react-register-user.git
cd react-register-user
npm install
cp .env.example .env   # optional — defaults work for local dev
```

## Project structure

```
src/
├── api/auth.js              # Signup API client
├── main.jsx
├── App.jsx
├── components/
│   ├── Field/
│   ├── RegistrationForm/
│   └── SuccessScreen/
├── constants/
├── styles/
└── utils/

server/
├── index.js                 # Express API entry
├── db.js                    # SQLite setup
├── validation.js
├── routes/auth.js           # POST /api/auth/signup
└── data/users.db            # Created on first run (gitignored)
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:all` | Frontend (5173) + API (3001) together |
| `npm run dev` | Vite only — proxies `/api` to the API server |
| `npm run dev:server` | API only |
| `npm run build` | Production frontend build |
| `npm run start` | Run API server |

### Local development

Run both apps (recommended):

```bash
npm run dev:all
```

Open http://localhost:5173. Form submissions call `POST /api/auth/signup`, which stores users in SQLite (`server/data/users.db`). Passwords are hashed with bcrypt; confirm password is never sent to the API.

### API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/signup` | Create account |

Example:

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fname":"Jane","lname":"Doe","email":"jane@example.com","phone":"+1 555 000 0000","pwd":"password123","gender":"Female","dob":"1990-01-15"}'
```

Duplicate email returns `409` with `{ "field": "email", ... }`.

## Deploy notes

- **Frontend:** deploy `dist/` (Vercel, Netlify, etc.). Set `VITE_API_URL` to your API origin.
- **API:** deploy `server/` on any Node host (Render, Railway, Fly.io). Set `PORT` and optionally `DATABASE_PATH` to a persistent volume path so SQLite survives restarts.
