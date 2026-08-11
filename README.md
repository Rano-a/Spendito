# Spendito

A personal budget tracker built with Nuxt 3, Vue 3, Tailwind CSS, and MongoDB. Mobile-first, multi-user — everyone has their own account and data.

## Features

- Start a new month with your salary and recurring bills to confirm
- Track expenses, income, and savings, grouped by day
- Recurring bills with a checkbox to mark them paid
- Savings projects with a goal and progress tracking
- Dashboard with spending overview, budget gauge, and spending trend
- Multi-user accounts with fully isolated data

## Installation

Requirements: Node.js 18+ and a MongoDB database (Atlas or local).

```bash
npm install
cp .env.example .env
```

Fill in `.env` with:

| Variable | Description |
|---|---|
| `MONGODB_URI` | Your MongoDB connection string |
| `SESSION_SECRET` | A random secret used to sign session cookies, e.g. `openssl rand -hex 32` |

Then start the dev server:

```bash
npm run dev
```

The app runs at http://localhost:3000. Create an account at `/register`.
