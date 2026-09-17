-- Ledgerly database schema for Supabase (Postgres)
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query).
-- Safe to re-run: guarded with IF NOT EXISTS / DROP ... IF EXISTS where sensible.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user, holds app-level preferences
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text default '',
  base_currency text not null default 'INR',
  theme text not null default 'light',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- accounts: bank accounts, cash, cards, savings, investments
-- ---------------------------------------------------------------------------
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type text not null default 'bank'
    check (type in ('bank','cash','credit_card','savings','investment','other')),
  currency text not null default 'INR',
  opening_balance numeric(14,2) not null default 0,
  balance numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists accounts_user_id_idx on public.accounts (user_id);

-- ---------------------------------------------------------------------------
-- categories: user-defined income/expense categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type text not null default 'expense' check (type in ('income','expense')),
  color text not null default '#1F5F4F',
  created_at timestamptz not null default now()
);

create index if not exists categories_user_id_idx on public.categories (user_id);

-- ---------------------------------------------------------------------------
-- transactions: the ledger itself
-- ---------------------------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid references public.accounts (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  type text not null check (type in ('income','expense','transfer')),
  amount numeric(14,2) not null check (amount >= 0),
  date date not null default current_date,
  note text default '',
  recurrence text not null default 'none'
    check (recurrence in ('none','daily','weekly','monthly','yearly')),
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_date_idx on public.transactions (date);
create index if not exists transactions_account_id_idx on public.transactions (account_id);
create index if not exists transactions_category_id_idx on public.transactions (category_id);

-- ---------------------------------------------------------------------------
-- budgets: one monthly limit per category
-- ---------------------------------------------------------------------------
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  monthly_limit numeric(14,2) not null check (monthly_limit >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, category_id)
);

create index if not exists budgets_user_id_idx on public.budgets (user_id);

-- ---------------------------------------------------------------------------
-- Row Level Security: every user only ever sees their own rows
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;

drop policy if exists "profiles are self" on public.profiles;
create policy "profiles are self" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "accounts are own" on public.accounts;
create policy "accounts are own" on public.accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "categories are own" on public.categories;
create policy "categories are own" on public.categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "transactions are own" on public.transactions;
create policy "transactions are own" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "budgets are own" on public.budgets;
create policy "budgets are own" on public.budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Seed an account's balance from its opening balance on creation
-- ---------------------------------------------------------------------------
create or replace function public.seed_account_balance()
returns trigger as $$
begin
  new.balance := coalesce(new.opening_balance, 0);
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_seed_account_balance on public.accounts;
create trigger trg_seed_account_balance
  before insert on public.accounts
  for each row execute function public.seed_account_balance();

-- ---------------------------------------------------------------------------
-- Keep account balances in sync with transactions automatically.
-- Income adds to the account, expense subtracts. Transfers are recorded for
-- history/reporting but don't move money between accounts in this version —
-- log a transfer as an expense on the source account and an income on the
-- destination account if you want both balances to reflect it.
-- ---------------------------------------------------------------------------
create or replace function public.apply_transaction_delta(
  p_account_id uuid, p_type text, p_amount numeric, p_sign int
) returns void as $$
begin
  if p_account_id is null then
    return;
  end if;
  if p_type = 'income' then
    update public.accounts set balance = balance + (p_sign * p_amount) where id = p_account_id;
  elsif p_type = 'expense' then
    update public.accounts set balance = balance - (p_sign * p_amount) where id = p_account_id;
  end if;
end;
$$ language plpgsql security definer;

create or replace function public.transactions_balance_trigger()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    perform public.apply_transaction_delta(new.account_id, new.type, new.amount, 1);
    return new;
  elsif tg_op = 'UPDATE' then
    perform public.apply_transaction_delta(old.account_id, old.type, old.amount, -1);
    perform public.apply_transaction_delta(new.account_id, new.type, new.amount, 1);
    return new;
  elsif tg_op = 'DELETE' then
    perform public.apply_transaction_delta(old.account_id, old.type, old.amount, -1);
    return old;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists trg_transactions_balance on public.transactions;
create trigger trg_transactions_balance
  after insert or update or delete on public.transactions
  for each row execute function public.transactions_balance_trigger();

-- ---------------------------------------------------------------------------
-- Create a profile row automatically whenever a new auth user signs up.
-- The app also does this defensively on first login, so this is a convenience.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, base_currency, theme)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'INR', 'light')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_handle_new_user on auth.users;
create trigger trg_handle_new_user
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- ---------------------------------------------------------------------------
-- loans: money given to another person and still owed back
-- ---------------------------------------------------------------------------
create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid references public.accounts (id) on delete set null,
  repayment_account_id uuid,
  person_name text not null,
  amount numeric(14,2) not null check (amount > 0),
  repaid_amount numeric(14,2) not null default 0 check (repaid_amount >= 0),
  date date not null default current_date,
  due_date date,
  note text default '',
  status text not null default 'pending' check (status in ('pending','paid')),
  created_at timestamptz not null default now(),
  check (repaid_amount <= amount),
  constraint loans_repayment_account_id_fkey foreign key (repayment_account_id) references public.accounts (id) on delete set null
);

-- Safe migration for databases that already have the loans table.
alter table public.loans add column if not exists repayment_account_id uuid;

-- Preserve the accounting of existing repayments: before this feature,
-- repayments were credited back to the original account.
update public.loans
set repayment_account_id = account_id
where repaid_amount > 0 and repayment_account_id is null;

create index if not exists loans_user_id_idx on public.loans (user_id);
create index if not exists loans_account_id_idx on public.loans (account_id);
create index if not exists loans_repayment_account_id_idx on public.loans (repayment_account_id);
create index if not exists loans_status_idx on public.loans (status);

alter table public.loans enable row level security;
drop policy if exists "loans are own" on public.loans;
create policy "loans are own" on public.loans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Giving a loan reduces the selected source account.
-- Repayments increase the selected receiving account. They do NOT have to be
-- the same account (e.g. give from Cash, receive back in HDFC Bank).
create or replace function public.apply_loan_delta(p_account_id uuid, p_amount numeric)
returns void as $$
begin
  if p_account_id is not null and p_amount <> 0 then
    update public.accounts set balance = balance + p_amount where id = p_account_id;
  end if;
end;
$$ language plpgsql security definer;

create or replace function public.loans_balance_trigger()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    perform public.apply_loan_delta(new.account_id, -new.amount);
    perform public.apply_loan_delta(new.repayment_account_id, new.repaid_amount);
    new.status := case when new.repaid_amount >= new.amount then 'paid' else 'pending' end;
    return new;
  elsif tg_op = 'UPDATE' then
    -- Reverse the old transaction first.
    perform public.apply_loan_delta(old.account_id, old.amount);
    perform public.apply_loan_delta(old.repayment_account_id, -old.repaid_amount);
    -- Then apply the new transaction. This safely supports changing either
    -- the source account or the repayment account.
    perform public.apply_loan_delta(new.account_id, -new.amount);
    perform public.apply_loan_delta(new.repayment_account_id, new.repaid_amount);
    new.status := case when new.repaid_amount >= new.amount then 'paid' else 'pending' end;
    return new;
  elsif tg_op = 'DELETE' then
    perform public.apply_loan_delta(old.account_id, old.amount);
    perform public.apply_loan_delta(old.repayment_account_id, -old.repaid_amount);
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_loans_balance on public.loans;
create trigger trg_loans_balance
  before insert or update or delete on public.loans
  for each row execute function public.loans_balance_trigger();

-- ============================================================
-- FIX LOANS -> ACCOUNTS RELATIONSHIPS
-- ============================================================

-- 1. Make sure account_id exists
alter table public.loans
add column if not exists account_id uuid;

-- 2. Make sure repayment_account_id exists
alter table public.loans
add column if not exists repayment_account_id uuid;

-- 3. Remove old/conflicting foreign keys if they exist
alter table public.loans
drop constraint if exists loans_account_id_fkey;

alter table public.loans
drop constraint if exists loans_repayment_account_id_fkey;

-- 4. Add explicit foreign-key relationships
alter table public.loans
add constraint loans_account_id_fkey
foreign key (account_id)
references public.accounts(id)
on delete set null;

alter table public.loans
add constraint loans_repayment_account_id_fkey
foreign key (repayment_account_id)
references public.accounts(id)
on delete set null;

-- 5. Indexes
create index if not exists loans_account_id_idx
on public.loans(account_id);

create index if not exists loans_repayment_account_id_idx
on public.loans(repayment_account_id);

-- 6. Refresh Supabase/PostgREST schema cache
notify pgrst, 'reload schema';