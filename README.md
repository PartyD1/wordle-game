# WordPlay: A Daily Word Puzzle Game

A web-based daily word puzzle game inspired by Wordle. Guess the 5-letter word in 6 tries using color-coded feedback. Built with **Next.js 15**, **React 19**, and **Tailwind CSS**, with a daily puzzle that resets once per day (UTC).

## Features

- **Daily puzzle** — One solution per day for everyone (UTC). Same word globally for a given calendar day; epoch aligned Wordle-style (June 19, 2021).
- **6×5 grid** — Up to 6 guesses, each a 5-letter word. Tiles flip with staggered animation on submit.
- **Tile feedback** — Green (correct spot), yellow (in word, wrong spot), gray (not in word).
- **Input** — On-screen keyboard plus physical keyboard support (letters, Enter, Backspace).
- **Validation** — Only valid 5-letter words from the combined answer and guess lists are accepted; invalid guesses trigger a shake animation and toast.
- **Persistence** — Game state (guesses, current guess, win/loss) is saved in `localStorage` so you can resume the same day across sessions.
- **Statistics** — Games played, win count, win percentage, and guess distribution (wins by 1–6 tries) stored in `localStorage` and shown in a stats modal.
- **Rules modal** — “How to play” dialog explaining the game and tile colors.
- **Deployment** — Configured for Firebase App Hosting via `apphosting.yaml`.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS, tailwindcss-animate
- **UI:** ShadCN-style components (Radix UI primitives: AlertDialog, Toast, Button), Lucide React icons
- **Charts:** Recharts (stats distribution)
- **Utilities:** date-fns, clsx, tailwind-merge, class-variance-authority
- **Deployment:** Firebase App Hosting (standalone Next.js build)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser. The dev server uses Turbopack and is bound to `0.0.0.0` so you can access it from other devices on your network.

### Other scripts

- `npm run build` — Production build (standalone output for deployment).
- `npm start` — Run production server (used by Firebase App Hosting).
- `npm run lint` — Run Next.js ESLint.
- `npm run typecheck` — Run TypeScript compiler check (`tsc --noEmit`).

## Project Structure

### Root

| File / directory      | Description |
|------------------------|-------------|
| `apphosting.yaml`      | Firebase App Hosting config (e.g. `command: npm start`, `maxInstances`). |
| `next.config.ts`       | Next.js config: standalone output, TypeScript/ESLint ignore during builds, remote image patterns. |
| `package.json`         | Dependencies and scripts (dev on port 9002 with Turbopack). |
| `tailwind.config.ts`   | Tailwind CSS configuration. |
| `tsconfig.json`        | TypeScript configuration. |
| `allowed_answers.txt`  | List of possible daily solutions (~2,315 words). One word per line; the daily solution is chosen from this list by a deterministic index derived from the current UTC day. |
| `allowed_guesses.txt`  | Extended list of valid guess words (~10,657 words). Combined with `allowed_answers.txt` to form the full set of accepted guesses. |

### `app/`

- **`globals.css`** — Global styles and CSS variables (e.g. theme colors in HSL) using Tailwind `@layer`.
- **`layout.tsx`** — Root layout: `<html>`, `<body>`, global fonts.
- **`page.tsx`** — Home page: reads `allowed_answers.txt` and `allowed_guesses.txt` at build time, deduplicates into `solutions` and `validGuesses`, and renders the main `Game` component.

### `components/`

- **`ui/`** — Reusable UI built with Radix/shadcn-style components:
  - `alert-dialog.tsx` — Modal dialog (used for Rules, Stats, Game End).
  - `button.tsx` — Button component.
  - `toast.tsx` / `toaster.tsx` — Toast notifications (e.g. “Not in word list”, “Not enough letters”).

- **`wordle/`** — Game-specific components:
  - **`Game.tsx`** — Main game controller: daily solution (via `lib/daily`), state (guesses, current guess, key statuses, win/loss, modals), persistence to `localStorage`, keyboard handler, and orchestration of grid, keyboard, and modals. Triggers flip animation and records stats on game end via `lib/stats`.
  - **`Grid.tsx`** — Renders the 6×5 grid: completed rows, current row (with optional shake), empty rows.
  - **`Row.tsx`** — Row variants: `CompletedRow`, `CurrentRow`, `EmptyRow`.
  - **`Tile.tsx`** — Single letter tile; appearance by status (correct / present / absent) and flip animation.
  - **`Keyboard.tsx`** — On-screen keyboard; key colors reflect letter status.
  - **`GameEndModal.tsx`** — End-of-game dialog: win/loss, solution word, close action.
  - **`RulesModal.tsx`** — “How to play” dialog: rules and tile color legend.
  - **`StatsModal.tsx`** — Statistics dialog: games played, win %, wins, and guess distribution bar chart (Recharts).

### `hooks/`

- **`use-toast.ts`** — Hook for showing and managing toast notifications.

### `lib/`

- **`helpers.ts`** — Core game logic: `WORD_LENGTH` (5), `LetterStatus` type, `getGuessStatuses(guess, solution)` for correct/present/absent per letter.
- **`daily.ts`** — Daily puzzle index: `getDayIndex()` (UTC days since epoch), `getDailySolution(solutions)` to pick the day’s word from the solutions array.
- **`stats.ts`** — Statistics: `getStats()` / `addGameResult(dayIndex, won, guessCount)`, stored in `localStorage` under `wordplay-stats`; tracks games played, wins, wins-by-guess-count, and last completed day to avoid double-counting.
- **`utils.ts`** — Utilities such as `cn()` for conditional Tailwind class names.

## Word Lists

- **Solutions:** `allowed_answers.txt` — one 5-letter word per line, uppercase when loaded. Used as the pool for the daily solution.
- **Guesses:** Union of `allowed_answers.txt` and `allowed_guesses.txt`, deduplicated. Only words in this set are accepted as guesses.

## Deployment

The app is set up for **Firebase App Hosting**. Build produces a standalone Next.js app; `apphosting.yaml` specifies `npm start` and instance limits. Deploy via your Firebase project’s App Hosting workflow.

## License

Private project; see repository or author for terms.
