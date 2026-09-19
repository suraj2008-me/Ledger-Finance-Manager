import {
  Pencil,
  Trash2,
  Landmark,
  Wallet,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Circle,
} from "lucide-react";
import { formatMoney } from "../../lib/formatters";

const ICONS = {
  bank: Landmark,
  cash: Wallet,
  credit_card: CreditCard,
  savings: PiggyBank,
  investment: TrendingUp,
  other: Circle,
};

export default function AccountCard({ account, onEdit, onDelete }) {
  const Icon = ICONS[account.type] ?? Circle;
  const negative = Number(account.balance) < 0;

  return (
    <div className="group flex items-center justify-between border-b border-hairline dark:border-hairline-dark py-4 last:border-b-0">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-50 text-ink-500 dark:bg-ink-800 dark:text-ink-300">
          <Icon size={16} />
        </span>
        <div>
          <p className="text-sm text-ink-900 dark:text-paper">{account.name}</p>
          <p className="text-xs text-ink-400 capitalize">
            {account.type.replace("_", " ")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`tabular text-sm ${negative ? "text-rust-500" : "text-ink-900 dark:text-paper"}`}
        >
          {formatMoney(account.balance, account.currency)}
        </span>
        <div className="items-center gap-2 flex">
          <button
            onClick={() => onEdit(account)}
            className="rounded p-1.5 text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(account)}
            className="rounded p-1.5 text-ink-400 hover:bg-rust-50 hover:text-rust-500 dark:hover:bg-rust-900/30"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
