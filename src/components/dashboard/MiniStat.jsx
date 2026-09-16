export default function MiniStat({ label, value, tone = 'default' }) {
  const toneClass =
    tone === 'income'
      ? 'text-ledger-600 dark:text-ledger-300'
      : tone === 'expense'
      ? 'text-rust-600 dark:text-rust-300'
      : 'text-ink-900 dark:text-paper'

  return (
    <div>
      <p className="text-xs text-ink-400">{label}</p>
      <p className={`tabular mt-1 text-xl ${toneClass}`}>{value}</p>
    </div>
  )
}
