import { Wallet } from 'lucide-react'

export default function AuthLayout({ eyebrow, title, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink-900 px-12 py-12 text-paper lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-ledger-500">
            <Wallet size={16} />
          </span>
          <span className="font-display text-lg">Ledger - Finance Manager</span>
        </div>
        <div className="max-w-sm">
          <p className="font-display text-3xl leading-snug">
            Know where every rupee goes, every month.
          </p>
          <p className="mt-4 text-sm text-ink-300">
            Accounts, budgets and spending in one quiet ledger — built for people who'd rather
            glance than dig.
          </p>
        </div>
        <p className="text-xs text-ink-400">© {new Date().getFullYear()} Ledger - Finance Manager</p>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {eyebrow && <p className="text-sm text-ink-400">{eyebrow}</p>}
          <h1 className="mt-1 font-display text-2xl text-ink-900 dark:text-paper">{title}</h1>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-ink-400">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
