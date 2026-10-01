# SOKCHEA // OS — Portfolio

Sci-fi AI-assistant style portfolio built with **React + Vite + Framer Motion**.

## Features
- AI boot screen with loading rings, system log and voice greeting
- Nano-tech suit transform + paint-brush reveal on the portrait
- Animated HUD background, targeting cursor, scroll progress bar
- About dossier, skill gauges, 3D project cards with "mission briefing" popups
- Learning timeline, achievements, hobby orbit, terminal contact form
- AI assistant chat (press `/`), with voice and page navigation
- Visitor achievements that unlock while exploring

## Run on your computer
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Edit your content
Everything (name, bio, skills, projects, timeline, achievements, hobbies, links)
is in **`src/data/profile.js`**. Images are in **`public/`** (`image1.png`, `image2.png`).

## Deploy
Push to GitHub → Vercel builds automatically (`vercel.json` sets Vite, `npm run build`, `dist`).
