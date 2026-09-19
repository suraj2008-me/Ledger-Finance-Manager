import {
  ArrowUpRight,
  Check,
  CircleDollarSign,
  LockKeyhole,
  WalletCards,
} from "lucide-react";

const miniRows = [
  { label: "Coffee & brunch", amount: "-₹480", tone: "text-rust-500" },
  {
    label: "Freelance payout",
    amount: "+₹18,500",
    tone: "text-ledger-600 dark:text-ledger-300",
  },
  { label: "Subscriptions", amount: "-₹899", tone: "text-rust-500" },
];

export default function AuthLayout({
  eyebrow,
  title,
  description,
  children,
  footer,
  mode = "login",
}) {
  const isSignup = mode === "signup";

  return (
    <div className="h-screen w-full overflow-hidden bg-paper text-ink-900 dark:bg-ink-950 dark:text-paper">
      <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col px-4 sm:px-6 lg:px-10">
        <header className="flex shrink-0 items-center justify-between py-4 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ledger-500 text-white shadow-sm shadow-ledger-500/20 sm:h-10 sm:w-10">
              <CircleDollarSign size={19} strokeWidth={2} />
            </div>
            <div>
              <div className="font-display text-lg font-semibold leading-none">
                Ledger
              </div>
              <div className="mt-1 text-[9px] font-semibold uppercase tracking-[.18em] text-ink-400 dark:text-ink-300">
                Finance Manager
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs text-ink-400 dark:text-ink-300 sm:flex">
            <LockKeyhole size={13} className="text-ledger-500" /> Private by
            default
          </div>
        </header>

        <main className="flex min-h-0 flex-1 items-center py-2 sm:py-4 lg:py-6">
          <div className="grid w-full min-h-0 items-center gap-8 lg:grid-cols-[1.05fr_.72fr] xl:gap-16">
            <section className="hidden max-w-2xl min-w-0 lg:block">
              <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-ledger-600 dark:text-ledger-300">
                <span className="h-1.5 w-1.5 rounded-full bg-ledger-500" />
                {isSignup ? "A simpler start" : "Welcome back"}
              </div>
              <h2 className="max-w-xl font-display text-5xl leading-[.98] tracking-[-.035em] xl:text-6xl">
                {isSignup ? (
                  <>
                    Make money{" "}
                    <span className="text-ledger-500">make sense.</span>
                  </>
                ) : (
                  <>
                    Your money,{" "}
                    <span className="text-ledger-500">at a glance.</span>
                  </>
                )}
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-6 text-ink-500 dark:text-ink-300">
                {isSignup
                  ? "One calm place for accounts, spending and budgets — without the spreadsheet feeling."
                  : "Pick up where you left off and keep your everyday finances clear, organized and easy to understand."}
              </p>
              <div className="mt-7 max-w-lg rounded-3xl border border-ink-200 bg-white/80 p-5 shadow-[0_18px_50px_rgba(18,24,27,.06)] dark:border-white/[.07] dark:bg-white/[.035] dark:shadow-none">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-ink-400 dark:text-ink-300">
                      Available balance
                    </div>
                    <div className="mt-1 font-display text-4xl tracking-tight">
                      ₹84,240
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ledger-50 text-ledger-600 dark:bg-ledger-900/40 dark:text-ledger-300">
                    <WalletCards size={18} />
                  </div>
                </div>
                <div className="mt-6 flex h-14 items-end gap-1.5">
                  {[28, 42, 34, 55, 48, 70, 63, 82, 76, 94, 86, 100].map(
                    (height, index) => (
                      <span
                        key={index}
                        className="flex-1 rounded-full bg-ledger-500/10"
                        style={{ height: `${height * 0.5}px` }}
                      >
                        <span
                          className="block h-full rounded-full bg-ledger-500"
                          style={{ opacity: 0.22 + index / 22 }}
                        />
                      </span>
                    ),
                  )}
                </div>
                <div className="mt-4 space-y-1">
                  {miniRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between border-t border-ink-100 py-2.5 first:border-t-0 dark:border-white/[.06]"
                    >
                      <span className="text-xs text-ink-500 dark:text-ink-300">
                        {row.label}
                      </span>
                      <span
                        className={`tabular text-xs font-medium ${row.tone}`}
                      >
                        {row.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mx-auto w-full max-w-[420px] min-w-0 lg:ml-auto">
              <div className="rounded-3xl border border-ink-200 bg-white p-5 shadow-[0_18px_60px_rgba(18,24,27,.07)] dark:border-white/[.07] dark:bg-ink-900 dark:shadow-none sm:p-7">
                <div className="mb-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[.16em] text-ink-400 dark:text-ink-300">
                    {eyebrow}
                  </div>
                  <h1 className="mt-2 font-display text-3xl leading-none tracking-[-.025em] sm:text-4xl">
                    {title}
                  </h1>
                  {description && (
                    <p className="mt-3 text-xs leading-5 text-ink-500 dark:text-ink-300">
                      {description}
                    </p>
                  )}
                </div>
                {children}
                <div className="mt-5 border-t border-ink-100 pt-4 text-center text-xs leading-5 text-ink-500 dark:border-white/[.06] dark:text-ink-300">
                  {footer}
                </div>
              </div>
            </section>
          </div>
        </main>

        <footer className="shrink-0 py-3 text-center text-[9px] font-medium uppercase tracking-[.16em] text-ink-400 dark:text-ink-500">
          Ledger Finance Manager · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
