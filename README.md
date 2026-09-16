# Ledgerly

A personal income & expense ledger built with Vite + React + Tailwind CSS + Supabase, ready to deploy on Vercel.

## Features

- **Accounts** — bank, cash, card, savings and investment accounts with live balances kept in sync automatically as you log transactions.
- **Transactions** — income, expense and transfer entries with category, account, date, note and repeat frequency; searchable and filterable by type, account, category and date range.
- **Categories** — custom, colour-coded income and expense categories.
- **Budgets** — monthly limits per category with progress bars and over-budget warnings.
- **Recurring entries** — mark any entry as daily/weekly/monthly/yearly and generate the next occurrence with one click from the Recurring page.
- **Dashboard** — total balance, this month's income/expense/net, a balance trend chart, a spending-by-category donut, a budget summary and your most recent entries.
- **Reports** — income vs expense over 3/6/12 months, category breakdown, CSV export.
- **Settings** — profile, base currency, light/dark theme, full data export.
- **Auth** — Supabase email/password auth; every table is protected with row-level security so each person only ever sees their own data.
- **Design** — a quiet, ledger-inspired interface: hairline rules instead of card shadows, a serif display face for numbers and headings, and a restrained emerald/rust colour language where green always means income and rust always means expense.

## 1. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and run it. This creates all tables, row-level security policies, and the triggers that keep account balances up to date.
3. Under **Authentication → Providers**, email/password is enabled by default — that's all this app needs. Turn off "Confirm email" under **Authentication → Settings** if you want to sign in immediately after signing up during development.
4. Under **Project Settings → API**, copy the **Project URL** and **anon public** key.

## 2. Configure the app

```bash
cp .env.example .env
```

Fill in `.env`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Run locally

```bash
npm install
npm run dev
```

Visit the printed local URL, create an account, and start logging entries.

## 4. Deploy to Vercel

1. Push this project to a Git repository.
2. Import it in [Vercel](https://vercel.com/new).
3. Framework preset: **Vite**. Build command `npm run build`, output directory `dist` (Vercel detects these automatically).
4. Add the two environment variables from `.env` in the Vercel project settings.
5. Deploy. `vercel.json` is already set up to rewrite all routes to `index.html` so client-side routing works.

## Project structure

```
src/
  lib/            Supabase client, formatters, constants, CSV helpers
  context/        Auth and theme providers
  hooks/          Data hooks: accounts, categories, transactions, budgets
  components/     UI primitives + feature components, grouped by domain
  pages/          One file per route
  routes/         Auth guard
supabase/
  schema.sql      Tables, RLS policies, balance-sync triggers
```

## Notes and known limitations

- **Transfers**: a `transfer` entry is recorded for history but does not move money between two of your own accounts automatically in this version — log it as an expense on the source account and an income on the destination account if you want both balances to reflect it.
- **Recurring entries**: the "Run due entries" button on the Recurring page creates any occurrences that are due. To automate this without opening the app, you can call the same insert logic from a [Supabase scheduled Edge Function](https://supabase.com/docs/guides/functions/schedule-functions) running daily.
- **Currency**: each account has its own currency for display, and your profile has a base currency; amounts are not converted between currencies — this is a single-currency-per-account ledger, not a multi-currency converter.
