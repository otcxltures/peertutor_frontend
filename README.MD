# PeerTutor Connect — Frontend

A React + Vite frontend for **PeerTutor Connect**, a platform that matches students who need help with peers who can teach it — by subject, and by schedule.

**Live app:** [peertutor-frontend.onrender.com](https://peertutor-frontend.onrender.com)
**Backend repo:** [peertutor_backend](https://github.com/otcxltures/peertutor_backend)

---

## Features

- Landing page introducing the platform, with real sample requests pulled from the app
- Register and log in as a student, a tutor, or both
- Browse tutors by subject and availability
- Send session requests with a proposed time and notes
- Dashboard to track upcoming and past sessions, with accept / decline / complete actions for tutors
- Tutor profile editor (bio and subjects taught)
- JWT-based authentication with automatic token refresh
- Fully responsive, mobile-first layout

## Tech Stack

- **React 19** + **Vite** — UI and build tooling
- **Tailwind CSS v4** — styling, configured via CSS `@theme`
- **React Router v7** — client-side routing
- **Axios** — API client with request/response interceptors for auth
- **Docker** (multi-stage build) + **Nginx** — containerized production serving
- Deployed on **Render** as a Static Site

## Project Structure

```
src/
├── api/
│   └── client.js          # Axios instance, attaches JWT, handles token refresh
├── context/
│   └── AuthContext.jsx    # Auth state: login, register, logout
├── components/
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── TutorBrowse.jsx
│   ├── Dashboard.jsx
│   └── TutorProfileEdit.jsx
├── App.jsx                # Route definitions
├── main.jsx                # App entry point
└── index.css                # Tailwind theme + design tokens
```

## Getting Started (Local Development)

### Prerequisites

- Node.js 20+
- The [backend](https://github.com/otcxltures/peertutor_backend) running locally (or a deployed backend URL to point at)

### Setup

```bash
git clone https://github.com/otcxltures/peertutor_frontend.git
cd peertutor_frontend
npm install
```

Create a `.env` file in the project root (see `.env.example`):

```
VITE_API_URL=http://127.0.0.1:8000/api
```

Run the dev server:

```bash
npm run dev
```

App runs at `http://localhost:5173`.

### Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API. Baked into the build at **build time** — changing it requires a rebuild, not just a restart. | `https://peertutor-backend-iwk3.onrender.com/api` |

## Running with Docker

The included `Dockerfile` builds the app with Node, then serves the static output with Nginx.

```bash
docker compose up --build
```

App is served at `http://localhost:5173` (mapped to port 80 inside the container). `VITE_API_URL` is passed in as a build argument — see `docker-compose.yml`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run oxlint |

## Deployment

Deployed on [Render](https://render.com) as a Static Site:

- **Build command:** `npm install && npm run build`
- **Publish directory:** `dist`
- **Environment variable:** `VITE_API_URL` set to the live backend URL

The backend's `CORS_ALLOWED_ORIGINS` must include this frontend's deployed URL for API requests to succeed.

## Related

- [Backend repository](https://github.com/otcxltures/peertutor_backend) — Django REST API, PostgreSQL, JWT auth
- [Database schema diagram](https://github.com/otcxltures/peertutor_backend/blob/main/docs/db_diagram.png)
