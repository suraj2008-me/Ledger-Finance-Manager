import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import ReportsCharts from "../components/reports/ReportsCharts";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../context/AuthContext";
import { formatMoney, monthLabel } from "../lib/formatters";
import { transactionsToCSV, downloadCSV } from "../lib/csv";

function monthsAgoISO(n) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setDate(1);
  return d.toISOString().slice(0, 10);
}

export default function Reports() {
  const { profile } = useAuth();
  const currency = profile?.base_currency ?? "INR";
  const [range, setRange] = useState(6);
  const { transactions, loading } = useTransactions({
    from: monthsAgoISO(range - 1),
  });

  const monthly = useMemo(() => {
    const buckets = {};
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      buckets[key] = { label: monthLabel(d), income: 0, expense: 0 };
    }
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!buckets[key]) return;
      if (t.type === "income") buckets[key].income += Number(t.amount);
      if (t.type === "expense") buckets[key].expense += Number(t.amount);
    });
    return Object.values(buckets);
  }, [transactions, range]);

  const categoryData = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const name = t.categories?.name ?? "Uncategorised";
        const color = t.categories?.color ?? "#6C766B";
        map[name] = map[name] || { name, color, value: 0 };
        map[name].value += Number(t.amount);
      });
    return Object.values(map).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalIncome = monthly.reduce((s, m) => s + m.income, 0);
  const totalExpense = monthly.reduce((s, m) => s + m.expense, 0);

  return (
    <AppShell title="Reports">
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {[3, 6, 12].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded border px-3 py-1.5 text-sm ${
                  range === r
                    ? "border-ledger-500 bg-ledger-50 text-ledger-700 dark:bg-ledger-900/40 dark:text-ledger-200"
                    : "border-hairline dark:border-hairline-dark text-ink-500 dark:text-ink-300"
                }`}
              >
                {r} months
              </button>
            ))}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              downloadCSV(
                "ledgerly-report.csv",
                transactionsToCSV(transactions),
              )
            }
          >
            <Download size={14} /> Export CSV
          </Button>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="rounded-md border border-hairline dark:border-hairline-dark p-6">
              <div className="mb-4 flex flex-wrap gap-8">
                <div>
                  <p className="text-xs text-ink-400">Total income</p>
                  <p className="tabular text-xl text-ledger-600 dark:text-ledger-300">
                    {formatMoney(totalIncome, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-400">Total expense</p>
                  <p className="tabular text-xl text-rust-600 dark:text-rust-300">
                    {formatMoney(totalExpense, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-400">Net</p>
                  <p className="tabular text-xl text-ink-900 dark:text-paper">
                    {formatMoney(totalIncome - totalExpense, currency, {
                      signed: true,
                    })}
                  </p>
                </div>
              </div>
              <ReportsCharts data={monthly} currency={currency} />
            </div>

            <div className="rounded-md border border-hairline dark:border-hairline-dark p-6">
              <h2 className="mb-4 font-display text-lg text-ink-900 dark:text-paper">
                Spending by category
              </h2>
              <CategoryBreakdown data={categoryData} currency={currency} />
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
