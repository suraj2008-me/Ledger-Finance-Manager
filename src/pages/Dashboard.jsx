import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowDownRight,
  WalletCards,
  PiggyBank,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import AppShell from "../components/layout/AppShell";
import StatHero from "../components/dashboard/StatHero";
import BalanceTrendChart from "../components/dashboard/BalanceTrendChart";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import BudgetSummary from "../components/dashboard/BudgetSummary";
import TransactionRow from "../components/transactions/TransactionRow";
import TransactionModal from "../components/transactions/TransactionModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";
import { useAccounts } from "../hooks/useAccounts";
import { useCategories } from "../hooks/useCategories";
import { useTransactions } from "../hooks/useTransactions";
import { useBudgets } from "../hooks/useBudgets";
import {
  formatMoney,
  monthLabel,
  startOfMonthISO,
  endOfMonthISO,
} from "../lib/formatters";

const compact = (value, currency) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function Dashboard() {
  const { profile } = useAuth();
  const currency = profile?.base_currency ?? "INR";
  const { accounts, loading: accountsLoading } = useAccounts();
  const { categories } = useCategories();
  const { budgets, spendByCategory } = useBudgets();
  const thisMonth = { from: startOfMonthISO(), to: endOfMonthISO() };
  const { transactions: monthTx, loading: txLoading } =
    useTransactions(thisMonth);
  const {
    transactions: recent,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions({ limit: 6 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);
  const bankBalance = accounts
    .filter((a) => a.type === "bank")
    .reduce((s, a) => s + Number(a.balance), 0);
  const cashBalance = accounts
    .filter((a) => a.type === "cash")
    .reduce((s, a) => s + Number(a.balance), 0);
  const income = monthTx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);
  const expense = monthTx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);
  const net = income - expense;

  const trendData = useMemo(() => {
    const months = [];
    const now = new Date();
    const priorBalance = totalBalance - net;
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: monthLabel(d),
        balance: i === 0 ? totalBalance : priorBalance,
      });
    }
    return months;
  }, [totalBalance, net]);

  const categoryData = useMemo(() => {
    const map = {};
    monthTx
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const name = t.categories?.name ?? "Uncategorised";
        const color = t.categories?.color ?? "#1F5F4F";
        map[name] = map[name] || { name, color, value: 0 };
        map[name].value += Number(t.amount);
      });
    return Object.values(map).sort((a, b) => b.value - a.value);
  }, [monthTx]);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const loading = accountsLoading || txLoading;
  const monthName = new Intl.DateTimeFormat(undefined, {
    month: "long",
  }).format(new Date());

  return (
    <AppShell title="Overview" onQuickAdd={openNew}>
      {loading ? (
        <Spinner />
      ) : (
        <div className="space-y-6 lg:space-y-7">
          <section className="relative overflow-hidden rounded-3xl bg-ink-950 p-6 text-white shadow-2xl shadow-ink-950/10 sm:p-8 dark:bg-gradient-to-br dark:from-[#102F28] dark:via-ink-900 dark:to-ink-950">
            <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-ledger-600/25 blur-3xl" />
            <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-ink-300">
                  <Sparkles size={13} className="text-ledger-300" /> Your money,
                  in one place
                </div>
                <p className="text-sm text-ink-400">Total balance</p>
                <div className="mt-1 flex flex-wrap items-end gap-3">
                  <p className="tabular text-4xl font-semibold tracking-tight sm:text-5xl">
                    {formatMoney(totalBalance, currency)}
                  </p>
                  <span
                    className={`mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${net >= 0 ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300"}`}
                  >
                    {net >= 0 ? (
                      <ArrowUpRight size={13} />
                    ) : (
                      <ArrowDownRight size={13} />
                    )}{" "}
                    {compact(Math.abs(net), currency)} this month
                  </span>
                </div>
                <p className="mt-3 max-w-lg text-sm leading-6 text-ink-400">
                  A quick view of what you own, what you spent, and how your
                  month is moving.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-xs text-ink-400">Income</p>
                  <p className="tabular mt-2 text-lg font-semibold text-emerald-300">
                    {formatMoney(income, currency)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-xs text-ink-400">Spent</p>
                  <p className="tabular mt-2 text-lg font-semibold text-rose-300">
                    {formatMoney(expense, currency)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Bank balance",
                value: bankBalance,
                icon: WalletCards,
                tone: "text-ledger-600 dark:text-ledger-300",
                href: "/accounts",
              },
              {
                label: "Cash in hand",
                value: cashBalance,
                icon: WalletCards,
                tone: "text-amber-600 dark:text-amber-300",
                href: "/accounts",
              },
              {
                label: "Active accounts",
                value: accounts.length,
                icon: PiggyBank,
                tone: "text-emerald-600 dark:text-emerald-300",
                href: "/accounts",
                plain: true,
              },
            ].map(({ label, value, icon: Icon, tone, href, plain }) => (
              <Link
                key={label}
                to={href}
                className="app-card group flex items-center justify-between p-5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100 dark:bg-white/[0.06] ${tone}`}
                  >
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-ink-400">{label}</p>
                    <p className="tabular mt-1 text-lg font-semibold text-ink-900 dark:text-white">
                      {plain ? value : formatMoney(value, currency)}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={17}
                  className="text-ink-300 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.6fr_.8fr]">
            <section className="app-card p-5 sm:p-6">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[.15em] text-ink-400">
                    Balance trend
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-tight">
                    Your balance over time
                  </h2>
                </div>
                <Link
                  to="/reports"
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-ledger-600 hover:bg-ledger-50 dark:text-ledger-300 dark:hover:bg-ledger-500/10"
                >
                  View report
                </Link>
              </div>
              <BalanceTrendChart data={trendData} currency={currency} />
            </section>
            <section className="app-card p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[.15em] text-ink-400">
                  This month
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight">
                  {monthName} snapshot
                </h2>
              </div>
              <div className="space-y-4">
                <StatHero label="Net saved" amount={net} currency={currency} />
                <div className="h-px bg-ink-100 dark:bg-white/[0.06]" />
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Income</span>
                  <span className="tabular font-semibold text-emerald-600 dark:text-emerald-300">
                    {formatMoney(income, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Expenses</span>
                  <span className="tabular font-semibold text-rose-600 dark:text-rose-300">
                    {formatMoney(expense, currency)}
                  </span>
                </div>
              </div>
            </section>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="app-card p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[.15em] text-ink-400">
                    Spending
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-tight">
                    Where it went
                  </h2>
                </div>
                <Link
                  to="/reports"
                  className="text-xs font-semibold text-ledger-600 dark:text-ledger-300"
                >
                  Full report →
                </Link>
              </div>
              <CategoryBreakdown data={categoryData} currency={currency} />
            </section>
            <section className="app-card p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[.15em] text-ink-400">
                    Plan
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-tight">
                    Budget pulse
                  </h2>
                </div>
                <Link
                  to="/budgets"
                  className="text-xs font-semibold text-ledger-600 dark:text-ledger-300"
                >
                  Manage →
                </Link>
              </div>
              <BudgetSummary
                budgets={budgets}
                spendByCategory={spendByCategory}
                currency={currency}
              />
            </section>
          </div>

          <section className="app-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.15em] text-ink-400">
                  Activity
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight">
                  Recent transactions
                </h2>
              </div>
              <Link
                to="/transactions"
                className="text-xs font-semibold text-ledger-600 dark:text-ledger-300"
              >
                View all →
              </Link>
            </div>
            <div className="hairline-y px-5 sm:px-6">
              {recent.length === 0 && (
                <p className="py-8 text-sm text-ink-400">
                  No transactions yet — add your first one.
                </p>
              )}
              {recent.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  tx={tx}
                  onEdit={(t) => {
                    setEditing(t);
                    setModalOpen(true);
                  }}
                  onDelete={setToDelete}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(payload) =>
          editing
            ? updateTransaction(editing.id, payload)
            : addTransaction(payload)
        }
        categories={categories}
        accounts={accounts}
        initial={editing}
      />
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => deleteTransaction(toDelete.id)}
        title="Delete transaction"
        description="This transaction will be permanently removed from your ledger."
      />
    </AppShell>
  );
}
