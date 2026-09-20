<div align="center">

# 📒 Ledger — Personal Finance Manager

A calm, ledger-inspired personal finance app for tracking accounts, income, expenses,
budgets, loans and recurring bills — built with **React**, **Tailwind CSS** and
**Supabase**, ready to deploy on **Vercel**.

[![React](https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/new)

</div>

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
  - [1. Create the Supabase project](#1-create-the-supabase-project)
  - [2. Configure the app](#2-configure-the-app)
  - [3. Run locally](#3-run-locally)
- [Deploy to Vercel](#deploy-to-vercel)
- [Project structure](#project-structure)
- [How balances stay in sync](#how-balances-stay-in-sync)
- [Security notes](#security-notes)
- [Known limitations](#known-limitations)
- [Roadmap ideas](#roadmap-ideas)
- [License](#license)

---

## Features

**Accounts & transactions**
- Bank, cash, card, savings and investment accounts with live balances kept in sync automatically.
- Income, expense and **transfer** entries — transfers move money out of a source account and into a destination account in the same transaction, with both balances updating together.
- Search and filter by type, account, category and date range.
- Import transactions in bulk from a CSV file, with a per-row preview that flags invalid dates, amounts or unrecognized accounts/categories before anything is saved.
- Export any filtered view (or your entire history) to CSV.

**Planning**
- Custom, colour-coded income and expense categories.
- Monthly budgets per category with progress bars and over-budget warnings.
- Recurring entries — mark any entry as daily/weekly/monthly/yearly and generate the next occurrence with one click.
- Track loans given to others, with independent source and repayment accounts.

**Dashboard & reports**
- Total balance, this month's income/expense/net, a balance trend chart, a spending-by-category breakdown, a budget summary and your most recent entries.
- Income vs. expense over 3/6/12 months with category breakdowns.

**Account & security**
- Supabase email/password authentication; every table is protected with row-level security so each person only ever sees their own data.
- Show/hide toggle on every password field, plus a live strength meter on signup and password changes.
- Self-serve **forgot password** flow (emailed reset link) and an in-app **change password** form that re-verifies your current password first.
- Profile settings: display name, base currency, light/dark theme, full data export.

**Design**
- A quiet, ledger-inspired interface: hairline rules instead of card shadows, tabular figures for numbers, and a restrained emerald/rust colour language where green always means income and rust always means expense.
- Bricolage Grotesque throughout, including headings — no serif display face.

---

## Tech stack

| Layer          | Choice                                              |
| -------------- | ---------------------------------------------------- |
| Frontend       | React 18, React Router 6, Vite 5                     |
| Styling        | Tailwind CSS 3, `lucide-react` icons                 |
| Charts         | Recharts                                             |
| Backend        | Supabase (Postgres, Auth, Row Level Security)        |
| Notifications  | `react-hot-toast`                                    |
| Hosting        | Vercel                                               |

---

## Getting started

### 1. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates every table, row-level security policy, and the triggers that keep account balances up to date — including the transfer logic described [below](#how-balances-stay-in-sync). The file is additive and safe to re-run if you pull a newer version later.
3. Under **Authentication → Providers**, email/password is enabled by default — that's all this app needs. Turn off "Confirm email" under **Authentication → Settings** if you want to sign in immediately after signing up during development.
4. Under **Authentication → URL Configuration**, add your app's URL (e.g. `http://localhost:5173` for local dev, and your production URL) to **Redirect URLs** — this is required for the "forgot password" email link to work.
5. Under **Project Settings → API**, copy the **Project URL** and **anon public** key.

### 2. Configure the app

```bash
cp .env.example .env
```

Fill in `.env`:

| Variable                  | Required | Description                                                                 |
| -------------------------- | -------- | ---------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`        | Yes      | Your Supabase project URL.                                                   |
| `VITE_SUPABASE_ANON_KEY`   | Yes      | Your Supabase anon/public API key.                                          |
| `VITE_APP_URL`             | No       | The app's public URL, used to build email links (signup confirmation and password reset). Defaults to the current browser origin if unset — set it explicitly in production. |

### 3. Run locally

```bash
npm install
npm run dev
```

Visit the printed local URL, create an account, and start logging entries.

---

## Deploy to Vercel

1. Push this project to a Git repository.
2. Import it in [Vercel](https://vercel.com/new).
3. Framework preset: **Vite**. Build command `npm run build`, output directory `dist` (Vercel detects these automatically).
4. Add the environment variables from `.env` in the Vercel project settings (`VITE_APP_URL` should be your deployed domain).
5. Deploy. `vercel.json` is already set up to rewrite all routes to `index.html` so client-side routing works.
6. Don't forget step 4 from [Create the Supabase project](#1-create-the-supabase-project) — add your deployed domain to Supabase's **Redirect URLs**, or password reset links from production will fail.

---

## Project structure

```
src/
  lib/                Supabase client, formatters, constants, CSV import/export, password strength
  context/             Auth and theme providers
  hooks/               Data hooks: accounts, categories, transactions, budgets, loans
  components/
    ui/                Shared primitives — Button, Input, PasswordInput, Modal, Select, ...
    auth/               Auth screen layout
    transactions/       Transaction row/modal/filters and the CSV import modal
    accounts/           Account card/modal
    budgets/            Budget row/modal
    categories/         Category row/modal
    loans/              Loan modal
    dashboard/          Dashboard widgets (charts, stats, summaries)
    reports/            Report charts
    layout/             App shell, sidebar, topbar
  pages/                One file per route (Login, Signup, ForgotPassword, ResetPassword, Dashboard, ...)
  routes/               Auth guard
supabase/
  schema.sql            Tables, RLS policies, and balance-sync triggers (accounts, transactions, loans)
```

---

## How balances stay in sync

Account balances are never computed on the fly in the frontend — they're maintained by
Postgres triggers in `supabase/schema.sql`, so they stay correct however a row is
changed (insert, update, or delete, from the app or directly in the SQL editor):

- **Income** adds to the account's balance; **expense** subtracts from it.
- **Transfer** subtracts the amount from the source account (`account_id`) and adds it
  to the destination account (`to_account_id`) in the same trigger — a transfer always
  requires two different accounts, enforced by a database check constraint.
- **Loans** reduce the source account when given, and increase the (optionally
  different) repayment account as they're paid back.

---

## Security notes

- Every table has row-level security scoped to `auth.uid()`, so one user's data is
  never visible to another, even via the API.
- Changing your password from **Settings** re-verifies your current password with
  Supabase before applying the new one, so a device left signed in can't be used to
  lock out the account's real owner.
- The "forgot password" flow only ever confirms that an email *was sent*, never
  whether an account exists for that address.

---

## Known limitations

- **Recurring entries**: the "Run due entries" button on the Recurring page creates any occurrences that are due. To automate this without opening the app, you can call the same insert logic from a [Supabase scheduled Edge Function](https://supabase.com/docs/guides/functions/schedule-functions) running daily.
- **Currency**: each account has its own currency for display, and your profile has a base currency; amounts are not converted between currencies — this is a single-currency-per-account ledger, not a multi-currency converter.
- **CSV import**: matches accounts and categories by exact name, and doesn't yet support importing transfers (which need two accounts per row) — import those manually.

---

## Roadmap ideas

- [ ] Multi-currency conversion on the dashboard.
- [ ] Transfer support in CSV import.
- [ ] Shared/household accounts with multiple users.
- [ ] Push/email budget alerts when a category goes over its monthly limit.

Contributions and issues are welcome — open a PR or an issue describing what you'd
like to change.

---

## License

No license file is currently included in this repository. If you plan to share or
open-source this project, add a `LICENSE` file (the [MIT License](https://choosealicense.com/licenses/mit/)
is a common, permissive choice) and reference it here.
