import { NavLink } from 'react-router-dom'
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
} from 'lucide-react'

const links = [
  { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/accounts', label: 'Accounts', icon: Wallet },
  { to: '/loans', label: 'Loans & Credits', icon: HandCoins },
  { to: '/categories', label: 'Categories', icon: Tags },
  { to: '/budgets', label: 'Budgets', icon: PiggyBank },
  { to: '/recurring', label: 'Recurring', icon: Repeat },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-6">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-ledger-500 text-paper">
          <Wallet size={16} />
        </span>
        <span className="font-display text-lg text-ink-900 dark:text-paper">Ledger</span>
      </div>
      <nav className="flex-1 space-y-0.5 px-3">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-ledger-50 text-ledger-700 dark:bg-ledger-900/40 dark:text-ledger-200'
                  : 'text-ink-500 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-hairline dark:border-hairline-dark px-5 py-4 text-xs text-ink-300">
        Ledger - Finance Manager
      </div>
    </div>
  )
}
