# Farewell 2026 (React on Vercel)

A simple farewell invitation website built with:

- **React (Vite)** frontend

## Pages/Sections

- **Invitation**: main invite + date/time/venue
- **About**: a short note about your seniors and the event
- **Programs**: list of programs/events hosted by your seniors during college

## Local setup

1) Install Node.js (LTS) so `node` / `npm` are available.

2) Install dependencies:

```bash
cd farewell_2026
npm install
```

3) Run the dev server:

```bash
npm run dev:client
```

Frontend: `http://localhost:5173`  

## Add programs / photos / videos

- **Programs**: edit `client/public/programs.json`
- **Photos/videos**: put files inside `client/public/` (example: `client/public/media/photo1.jpg`)
  - Then use them in React as `/media/photo1.jpg`

## Deploy to Vercel

1) Push this folder to GitHub.
2) Import the repo in Vercel.
3) Deploy.

