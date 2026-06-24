# Mental Guide

A web app that guides users toward a healthier life by generating a personal
**weekly plan**. Users can download the plan as a PDF and print it to mark off
habits by hand, or fill it in online (one plan per week).

The first area is **mobile phone usage**. More areas (nutrition, movement,
sleep) and accounts (incl. Google sign-up) are planned.

## How it works

1. **Questionnaire** (`/questionnaire`) asks a few questions:
   - When do you get up? → first phone use is suggested **1 hour later**.
   - What do you use your phone most for?
   - When do you stop working? → take a break from that activity afterwards.
   - Optional custom habits (e.g. running, boxing).
2. A **weekly plan** (`/plan`) is generated as a Mon–Fri grid with these rows:
   - **1. Phone use (target: …)** — writable time per day.
   - **No {activity} after {stop-work time}** — tick per day.
   - **No phone at night before sleeping** — tick per day.
   - **Used analog alarm (no phone as alarm)** — tick per day.
   - Your custom habits — tick per day.
3. The plan is editable online (auto-saved to the browser via `localStorage`),
   navigable by week, and exportable to **PDF** or **print**.

The UI and PDF are **bilingual** (German / English) via the toggle in the header.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS
- `jspdf` + `jspdf-autotable` for client-side PDF export
- State persisted in `localStorage` (no backend yet)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deploy

Deploys to [Vercel](https://vercel.com/) out of the box — import the repo and
deploy; no environment variables are required yet.

## Roadmap

- User accounts and Google sign-up
- Server-side persistence (sync plans across devices)
- More health areas: nutrition, movement, sleep
