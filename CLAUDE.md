# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (ESLint is intentionally disabled during builds)
npm run start    # Run the production build locally
npm run lint     # Run Next.js ESLint
```

There is no test suite.

## Architecture

Mental Guide is a Next.js 14 App Router app (TypeScript + Tailwind CSS). All pages are `"use client"` components — there are no server components or API routes.

### Context provider stack

The root layout (`app/layout.tsx`) wraps the app in three nested providers:

```
LanguageProvider → AuthProvider → PlanProvider → Header + page
```

- **`LanguageProvider`** (`components/LanguageProvider.tsx`) — holds the active `Lang` (`"de" | "en"`), persisted to `localStorage`. Exposes `t(key, params?)` for translations and `setLang`.
- **`AuthProvider`** (`components/AuthProvider.tsx`) — wraps Supabase Auth. Exposes `user`, `session`, `signInWithGoogle`, `signInWithEmail`, `signOut`. When Supabase env vars are absent, `configured` is `false` and all auth calls are no-ops.
- **`PlanProvider`** (`components/PlanProvider.tsx`) — the central state manager. Loads plan data on mount (remote if signed in, local otherwise), persists changes immediately to `localStorage` and debounces cloud upserts (600 ms). On first sign-in it migrates a guest's local plan to Supabase. Exposes `settings`, `entries`, `updateSettings`, `setEntry`, `reset`.

### Core data model (`lib/plan.ts`)

```ts
Settings  = { wakeTime, mostUsedFor, stopWorkTime, customHabits[] }
Entries   = Record<weekStartISO, Record<habitId, Record<dayIndex 0-4, string|boolean>>>
```

- Four built-in `Habit` kinds: `firstUse` (type `"time"`), `stopActivity`, `noNightPhone`, `analogAlarm` (all `"check"`), plus optional `custom` habits.
- `buildHabits(settings)` produces the ordered habit list for a given settings object.
- `localStorage` keys are namespaced under `mg.*` (`STORAGE_KEYS` constant).

### i18n (`lib/i18n.ts`)

All UI text lives in flat key→string dictionaries for `"de"` and `"en"` in `lib/i18n.ts`. Use the `t()` helper from `useLang()` in components; never hardcode user-visible strings. String interpolation uses `{paramName}` placeholders — pass them as the second argument to `t()`.

### Supabase (`lib/supabase.ts`, `lib/remoteStore.ts`)

`getSupabase()` returns `null` when `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are unset; all call sites check for `null` so the app works in local-only (guest) mode without Supabase configured.

Remote persistence uses a single `user_plans` table with columns `user_id`, `settings` (jsonb), `entries` (jsonb), unique on `user_id`.

### PDF export (`lib/pdf.ts`)

`generatePlanPdf(plan, filename)` builds an A4-landscape PDF using `jspdf` + `jspdf-autotable`. It draws a grid with check-box squares (via `didDrawCell`) for `"check"` habits and leaves time cells editable. Called directly from `app/plan/page.tsx` — no server involvement.

### Styling conventions

- Tailwind with a custom `brand` green palette (defined in `tailwind.config.ts`).
- Reusable component classes defined in `app/globals.css` via `@layer components`: `.input`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`.
- `print:hidden` hides toolbar/header; `.print-area` removes decorative chrome for print/PDF output.

## Environment variables

Copy `.env.example` to `.env.local` for local dev. Both vars are optional — omitting them runs the app in guest mode:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## User flow

1. `/questionnaire` — 4-step wizard collects `Settings` and calls `updateSettings()`, then navigates to `/plan`.
2. `/plan` — renders the Mon–Fri habit grid for the selected week. Week navigation shifts `weekStart` (ISO date of Monday). Entries are written via `setEntry(weekStart, habitId, dayIndex, value)`.
3. `/login` — Google OAuth or email magic-link; redirects to `/plan` on success.
