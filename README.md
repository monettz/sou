# SOU — Tullab al-Ummah website

Stage 01 one-page website (Home, About, Our Approach, What’s On, Reviews, Packages, Contact, Teach with SOU, Checkout, Login stub). Built with plain HTML, CSS and JavaScript, bundled by [Vite](https://vitejs.dev).

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build:

```bash
npm run build      # outputs to dist/
npm run preview    # http://localhost:4173
```

## Project layout

```
index.html          all pages (hash routes: #about, #packages, …)
src/main.js         router, forms, calendar, sliders, animations
src/styles.css      design tokens, layout, responsive rules
public/assets/      photos and logo (served at /assets/…)
vercel.json         Vercel build + cache headers
```

## Deploy to Vercel

**Option A — GitHub (recommended)**
1. Push this `website` folder to a GitHub repository.
2. In Vercel: *Add New → Project → Import* the repository.
3. If the repository root is not this folder, set **Root Directory** to `website`.
4. Vercel reads `vercel.json` (framework: Vite, build: `npm run build`, output: `dist`). Click **Deploy**.

**Option B — Vercel CLI**

```bash
npm i -g vercel
vercel          # first deploy (preview URL)
vercel --prod   # production URL
```

## Demo content

Prices, teachers, reviews, email/phone and stats are sample data. Forms are front-end only (no backend yet); connect them to an email/API service before launch.
