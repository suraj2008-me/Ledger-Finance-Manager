import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarRange,
  Download,
  PiggyBank,
} from "lucide-react";
import AppShell from "../components/layout/AppShell";
import ReportsCharts from "../components/reports/ReportsCharts";
import DateRangeFilter, {
  getPresetRange,
  parseISO,
  toISO,
} from "../components/reports/DateRangeFilter";
import BreakdownList from "../components/reports/BreakdownList";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../context/AuthContext";
import { formatMoney } from "../lib/formatters";
import { transactionsToCSV, downloadCSV } from "../lib/csv";

const ACCOUNT_COLORS = [
  "#1F5F4F",
  "#B4502A",
  "#C98A2C",
  "#3F8B71",
  "#6C766B",
  "#8F3F21",
  "#6DAB95",
];

const diffDays = (a, b) =>
  Math.round((parseISO(b) - parseISO(a)) / 86400000);

const fmtLong = (iso) =>
  parseISO(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const fmtShort = (iso) =>
  parseISO(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

function SectionCard({ eyebrow, title, children, className = "" }) {
  return (
    <section className={`app-card p-5 sm:p-6 ${className}`}>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[.15em] text-ink-400">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function Reports() {
  const { profile } = useAuth();
  const currency = profile?.base_currency ?? "INR";
  const [range, setRange] = useState(() => getPresetRange("this-month"));
  const { from, to } = range;

  const { transactions, loading } = useTransactions({ from, to });

  const report = useMemo(() => {
    const dayCount = diffDays(from, to) + 1;
    const daily = dayCount <= 31;
    const keyOf = (iso) => (daily ? iso : iso.slice(0, 7));

    // Seed every day (or month) in the range so empty ones still show up.
    const buckets = new Map();
    if (daily) {
      for (let i = 0; i < dayCount; i++) {
        const d = parseISO(from);
        d.setDate(d.getDate() + i);
        buckets.set(toISO(d), {
          label: d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
          income: 0,
          expense: 0,
        });
      }
    } else {
      const end = parseISO(to);
      const start = parseISO(from);
      const cur = new Date(start.getFullYear(), start.getMonth(), 1);
      while (cur <= end) {
        buckets.set(toISO(cur).slice(0, 7), {
          label: cur.toLocaleDateString("en-IN", {
            month: "short",
            year: "2-digit",
          }),
          income: 0,
          expense: 0,
        });
        cur.setMonth(cur.getMonth() + 1);
      }
    }

    const expenseByCategory = new Map();
    const incomeByCategory = new Map();
    const expenseByAccount = new Map();
    const bump = (map, name, color, amount) => {
      const entry = map.get(name) ?? { name, color, value: 0, count: 0 };
      entry.value += amount;
      entry.count += 1;
      map.set(name, entry);
    };

    let income = 0;
    let expense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    transactions.forEach((t) => {
      const amount = Number(t.amount) || 0;
      const bucket = buckets.get(keyOf(t.date));

      if (t.type === "income") {
        income += amount;
        incomeCount += 1;
        if (bucket) bucket.income += amount;
        bump(
          incomeByCategory,
          t.categories?.name ?? "Uncategorised",
          t.categories?.color ?? "#1F5F4F",
          amount,
        );
      } else if (t.type === "expense") {
        expense += amount;
        expenseCount += 1;
        if (bucket) bucket.expense += amount;
        bump(
          expenseByCategory,
          t.categories?.name ?? "Uncategorised",
          t.categories?.color ?? "#6C766B",
          amount,
        );
        bump(expenseByAccount, t.accounts?.name ?? "No account", "", amount);
      }
    });

    const sorted = (map) =>
      [...map.values()].sort((a, b) => b.value - a.value);

    const byAccount = sorted(expenseByAccount).map((a, i) => ({
      ...a,
      color: ACCOUNT_COLORS[i % ACCOUNT_COLORS.length],
    }));

    const topExpenses = transactions
      .filter((t) => t.type === "expense")
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 8);

    // Average per day only counts days that have already happened, so a
    // half-finished month isn't diluted by future days.
    const today = toISO(new Date());
    const effectiveTo = from <= today && to > today ? today : to;
    const elapsedDays = Math.max(1, diffDays(from, effectiveTo) + 1);

    return {
      daily,
      chartData: [...buckets.values()],
      income,
      expense,
      incomeCount,
      expenseCount,
      net: income - expense,
      savingsRate: income > 0 ? ((income - expense) / income) * 100 : null,
      avgPerDay: expense / elapsedDays,
      expenseByCategory: sorted(expenseByCategory),
      incomeByCategory: sorted(incomeByCategory),
      expenseByAccount: byAccount,
      topExpenses,
    };
  }, [transactions, from, to]);

  const periodLabel =
    from === to ? fmtLong(from) : `${fmtLong(from)} – ${fmtLong(to)}`;

  const stats = [
    {
      label: "Total earned",
      value: formatMoney(report.income, currency),
      sub: `${report.incomeCount} income ${report.incomeCount === 1 ? "entry" : "entries"}`,
      icon: ArrowUpRight,
      tone: "text-emerald-600 dark:text-emerald-300",
      iconTone:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
    },
    {
      label: "Total spent",
      value: formatMoney(report.expense, currency),
      sub: `${report.expenseCount} ${report.expenseCount === 1 ? "expense" : "expenses"}`,
      icon: ArrowDownRight,
      tone: "text-rose-600 dark:text-rose-300",
      iconTone:
        "bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300",
    },
    {
      label: "Net saved",
      value: formatMoney(report.net, currency, { signed: true }),
      sub:
        report.savingsRate == null
          ? "No income in this period"
          : `${Math.round(report.savingsRate)}% of income saved`,
      icon: PiggyBank,
      tone:
        report.net >= 0
          ? "text-ink-900 dark:text-white"
          : "text-rose-600 dark:text-rose-300",
      iconTone: "bg-ink-100 text-ink-500 dark:bg-white/[0.06] dark:text-ink-300",
    },
    {
      label: "Average per day",
      value: formatMoney(report.avgPerDay, currency),
      sub: "Spending per day",
      icon: CalendarRange,
      tone: "text-ink-900 dark:text-white",
      iconTone: "bg-ink-100 text-ink-500 dark:bg-white/[0.06] dark:text-ink-300",
    },
  ];

  return (
    <AppShell title="Reports">
      <div className="space-y-6 lg:space-y-7">
        <section className="app-card p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.15em] text-ink-400">
                Report period
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">
                {periodLabel}
              </h2>
            </div>
            <Button
              variant="secondary"
              size="sm"
              disabled={loading || transactions.length === 0}
              onClick={() =>
                downloadCSV(
                  `ledgerly-report-${from}_to_${to}.csv`,
                  transactionsToCSV(transactions),
                )
              }
            >
              <Download size={14} /> Export CSV
            </Button>
          </div>
          <DateRangeFilter value={range} onChange={setRange} />
        </section>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(({ label, value, sub, icon: Icon, tone, iconTone }) => (
                <div key={label} className="app-card p-5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconTone}`}
                    >
                      <Icon size={18} />
                    </span>
                    <p className="text-xs font-medium text-ink-400">{label}</p>
                  </div>
                  <p
                    className={`tabular mt-4 text-2xl font-semibold tracking-tight ${tone}`}
                  >
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-ink-400">{sub}</p>
                </div>
              ))}
            </div>

            {transactions.length === 0 ? (
              <section className="app-card">
                <EmptyState
                  icon={BarChart3}
                  title="No transactions in this period"
                  description="Try a different date range to see your spending and income."
                />
              </section>
            ) : (
              <>
                <SectionCard
                  eyebrow="Trend"
                  title={`Earned vs spent, ${report.daily ? "day by day" : "month by month"}`}
                >
                  <ReportsCharts data={report.chartData} currency={currency} />
                </SectionCard>

                <div className="grid gap-6 lg:grid-cols-2">
                  <SectionCard eyebrow="Spending" title="Spent by category">
                    <BreakdownList
                      items={report.expenseByCategory}
                      currency={currency}
                      emptyText="No expenses in this period."
                    />
                  </SectionCard>
                  <SectionCard eyebrow="Spending" title="Spent from each account">
                    <BreakdownList
                      items={report.expenseByAccount}
                      currency={currency}
                      emptyText="No expenses in this period."
                    />
                  </SectionCard>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <SectionCard eyebrow="Income" title="Earned by category">
                    <BreakdownList
                      items={report.incomeByCategory}
                      currency={currency}
                      emptyText="No income in this period."
                    />
                  </SectionCard>
                  <SectionCard eyebrow="Spending" title="Biggest expenses">
                    {report.topExpenses.length === 0 ? (
                      <p className="py-8 text-center text-sm text-ink-400">
                        No expenses in this period.
                      </p>
                    ) : (
                      <ul className="hairline-y">
                        {report.topExpenses.map((t) => (
                          <li
                            key={t.id}
                            className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-ink-800 dark:text-ink-100">
                                {t.note?.trim() ||
                                  t.categories?.name ||
                                  "Expense"}
                              </p>
                              <p className="truncate text-xs text-ink-400">
                                {fmtShort(t.date)}
                                {t.categories?.name
                                  ? ` · ${t.categories.name}`
                                  : ""}
                                {t.accounts?.name
                                  ? ` · ${t.accounts.name}`
                                  : ""}
                              </p>
                            </div>
                            <span className="tabular shrink-0 text-sm font-semibold text-rose-600 dark:text-rose-300">
                              {formatMoney(t.amount, currency)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </SectionCard>
                </div>

                <section className="app-card overflow-hidden">
                  <div className="px-5 py-5 sm:px-6">
                    <p className="text-xs font-semibold uppercase tracking-[.15em] text-ink-400">
                      Details
                    </p>
                    <h2 className="mt-1 text-lg font-semibold tracking-tight">
                      All transactions in this period
                    </h2>
                    <p className="mt-1 text-xs text-ink-400">
                      Transfers between your own accounts are listed here but
                      not counted as earned or spent.
                    </p>
                  </div>
                  <ul className="hairline-y scrollbar-thin max-h-[28rem] overflow-y-auto px-5 sm:px-6">
                    {transactions.map((t) => {
                      const isIncome = t.type === "income";
                      const isExpense = t.type === "expense";
                      const title =
                        t.note?.trim() ||
                        (t.type === "transfer"
                          ? "Transfer"
                          : t.categories?.name || "Transaction");
                      const detail = [
                        fmtShort(t.date),
                        t.type === "transfer"
                          ? `${t.accounts?.name ?? "—"} → ${t.to_account?.name ?? "—"}`
                          : t.accounts?.name,
                        t.categories?.name,
                      ]
                        .filter(Boolean)
                        .join(" · ");
                      return (
                        <li
                          key={t.id}
                          className="flex items-center justify-between gap-3 py-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{
                                backgroundColor:
                                  t.categories?.color ?? "#9FA89A",
                              }}
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-ink-800 dark:text-ink-100">
                                {title}
                              </p>
                              <p className="truncate text-xs text-ink-400">
                                {detail}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`tabular shrink-0 text-sm font-semibold ${
                              isIncome
                                ? "text-emerald-600 dark:text-emerald-300"
                                : isExpense
                                  ? "text-rose-600 dark:text-rose-300"
                                  : "text-ink-400"
                            }`}
                          >
                            {isIncome ? "+" : isExpense ? "-" : ""}
                            {formatMoney(t.amount, currency)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
