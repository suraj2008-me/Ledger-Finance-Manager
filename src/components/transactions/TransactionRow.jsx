import { Pencil, Trash2, Repeat, ArrowRight } from "lucide-react";
import IconBadge from "../ui/IconBadge";
import { formatDate, formatMoney } from "../../lib/formatters";

export default function TransactionRow({ tx, onEdit, onDelete }) {
  const isIncome = tx.type === "income";
  const isTransfer = tx.type === "transfer";
  const amountColor = isTransfer
    ? "text-ink-500 dark:text-ink-300"
    : isIncome
      ? "text-ledger-600 dark:text-ledger-300"
      : "text-rust-600 dark:text-rust-300";

  return (
    <div className="group flex items-center gap-3 py-3">
      <IconBadge
        color={tx.categories?.color ?? "#6C766B"}
        label={tx.categories?.name ?? tx.type}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-ink-900 dark:text-paper">
          {tx.note ||
            tx.categories?.name ||
            (isTransfer ? "Transfer" : "Uncategorised")}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-400">
          {formatDate(tx.date)} ·{" "}
          {isTransfer && tx.to_account ? (
            <span className="inline-flex items-center gap-1">
              {tx.accounts?.name}
              <ArrowRight size={10} />
              {tx.to_account.name}
            </span>
          ) : (
            tx.accounts?.name
          )}
          {tx.recurrence && tx.recurrence !== "none" && <Repeat size={11} />}
        </p>
      </div>
      <span className={`tabular shrink-0 text-sm ${amountColor}`}>
        {formatMoney(tx.amount, tx.accounts?.currency, { signed: !isTransfer })}
      </span>
      <div className="ml-2 shrink-0 items-center gap-2 flex">
        <button
          onClick={() => onEdit(tx)}
          className="rounded p-1.5 text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-800"
          aria-label="Edit entry"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(tx)}
          className="rounded p-1.5 text-ink-400 hover:bg-rust-50 hover:text-rust-500 dark:hover:bg-rust-900/30"
          aria-label="Delete entry"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
