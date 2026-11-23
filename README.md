# SOU — Tullab al-Ummah website

Stage 01 one-page website (Home, About, Our Approach, What’s On, Reviews, Packages, Contact, Teach with SOU, Checkout). Built with plain HTML, CSS and JavaScript, bundled by [Vite](https://vitejs.dev).

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

portal/index.html   Student portal  → /portal  (website "Log in" button)
admin/index.html    Staff portal    → /admin   (teachers, Light admin, Super admin;
                                                not linked from the website)
src/portal/
  views/            one file per portal screen (template + small logic class)
  runtime.js        renders screens, hash routing, demo sign-in, role checks
  student.js        student routes  (#/dashboard, #/calendar, #/library, …)
  staff.js          staff routes    (#/teacher…, #/support…, #/super…) + who may open what
  base.css          shared portal rules (phone layout, demo bar)
```

### Portals (Stage 2 preview)

The portals currently run on **sample data** with a demo sign-in:

- `/portal`: any email + password signs in (SOU staff emails are refused here).
- `/admin`: a teacher email signs straight in; `support@…` and `admin@…` emails
  also need a 6-digit code (any 6 digits in the demo). The "Demo · open a role"
  buttons open each dashboard directly.

Real accounts, passwords, two-step codes and data arrive in Phase 2A (Supabase).

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
