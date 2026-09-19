import { Pencil, Trash2 } from "lucide-react";
import { formatMoney } from "../../lib/formatters";

export default function BudgetRow({
  budget,
  spent,
  currency,
  onEdit,
  onDelete,
}) {
  const pct =
    budget.monthly_limit > 0
      ? Math.min(100, (spent / budget.monthly_limit) * 100)
      : 0;
  const over = spent > budget.monthly_limit;
  const near = !over && pct >= 80;

  return (
    <div className="group py-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: budget.categories?.color }}
          />
          <span className="text-sm text-ink-900 dark:text-paper">
            {budget.categories?.name}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="tabular text-sm text-ink-500 dark:text-ink-300">
            {formatMoney(spent, currency)} /{" "}
            {formatMoney(budget.monthly_limit, currency)}
          </span>
          <div className="items-center gap-2 flex">
            <button
              onClick={() => onEdit(budget)}
              className="rounded p-1.5 text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(budget)}
              className="rounded p-1.5 text-ink-400 hover:bg-rust-50 hover:text-rust-500 dark:hover:bg-rust-900/30"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
        <div
          className={`h-full rounded-full transition-all ${
            over ? "bg-rust-500" : near ? "bg-amber" : "bg-ledger-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {over && (
        <p className="mt-1 text-xs text-rust-500">
          {formatMoney(spent - budget.monthly_limit, currency)} over budget
        </p>
      )}
    </div>
  );
}
