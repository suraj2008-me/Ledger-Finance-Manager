import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  ArrowLeftRight,
  Wallet,
  Tags,
  PiggyBank,
  Repeat,
  BarChart3,
  Settings,
  HandCoins,
  Plus,
} from "lucide-react";
import Button from "../ui/Button";

const links = [
  { to: "/", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/budgets", label: "Budgets", icon: PiggyBank },
  { to: "/loans", label: "Loans & Credits", icon: HandCoins },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/recurring", label: "Recurring", icon: Repeat },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

export default function Sidebar({ onNavigate, onQuickAdd }) {
  return (
    <div className="flex h-full flex-col bg-white/80 px-3 py-4 backdrop-blur-xl dark:bg-[#0C0F16]/90">
      <div className="flex items-center gap-3 px-3 py-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ledger-500 to-ledger-600 text-white">
          <Wallet size={18} strokeWidth={2.4} />
        </span>
        <div>
          <div className="font-display text-lg font-semibold tracking-tight">
            Ledger
          </div>
          <div className="text-[10px] font-semibold uppercase leading-none tracking-[.18em] text-ink-400">
            Finance OS
          </div>
        </div>
      </div>

      {onQuickAdd && (
        <Button
          onClick={onQuickAdd}
          className="mx-1 mt-5 w-[calc(100%-8px)] rounded-xl bg-ink-950 shadow-lg shadow-ink-950/10 hover:bg-ink-800 dark:bg-ledger-600 dark:hover:bg-ledger-500"
        >
          <Plus size={16} /> New transaction
        </Button>
      )}

      <div className="mt-7 px-3 pb-2 text-[10px] font-bold uppercase tracking-[.18em] text-ink-400">
        Workspace
      </div>
      <nav className="flex-1 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${isActive ? "bg-ledger-50 text-ledger-700 dark:bg-ledger-500/12 dark:text-ledger-300" : "text-paper0 hover:bg-paper hover:text-ink-900 dark:text-ink-400 dark:hover:bg-white/[0.045] dark:hover:text-ink-100"}`
            }
          >
            <Icon size={17} className="shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/settings"
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? "bg-ink-100 text-ink-950 dark:bg-white/[0.07] dark:text-white" : "text-paper0 hover:bg-paper dark:text-ink-400 dark:hover:bg-white/[0.045]"}`
        }
      >
        <Settings size={17} /> Settings
      </NavLink>
    </div>
  );
}
