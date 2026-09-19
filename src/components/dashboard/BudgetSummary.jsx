import { Link } from "react-router-dom";
import { formatMoney } from "../../lib/formatters";

export default function BudgetSummary({ budgets, spendByCategory, currency }) {
  if (budgets.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm text-ink-400">No budgets set yet.</p>
        <Link to="/budgets" className="text-sm text-ledger-600 hover:underline">
          Set your first budget
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {budgets.slice(0, 4).map((b) => {
        const spent = spendByCategory[b.category_id] ?? 0;
        const pct =
          b.monthly_limit > 0
            ? Math.min(100, (spent / b.monthly_limit) * 100)
            : 0;
        const over = spent > b.monthly_limit;
        return (
          <div key={b.id}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-ink-700 dark:text-ink-200">
                {b.categories?.name}
              </span>
              <span className="tabular text-ink-400">
                {formatMoney(spent, currency)} /{" "}
                {formatMoney(b.monthly_limit, currency)}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
              <div
                className={`h-full rounded-full ${over ? "bg-rust-500" : "bg-ledger-500"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
