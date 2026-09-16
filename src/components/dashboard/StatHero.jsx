import { formatMoney } from '../../lib/formatters'

export default function StatHero({ label, amount, currency, trend }) {
  const positive = Number(amount) >= 0
  return (
    <div className="animate-countup">
      <p className="text-sm text-ink-400">{label}</p>
      <p
        className={`font-display text-5xl leading-tight ${
          positive ? 'text-ink-900 dark:text-paper' : 'text-rust-500'
        }`}
      >
        {formatMoney(amount, currency)}
      </p>
      {trend != null && (
        <p className={`mt-1 text-sm ${trend >= 0 ? 'text-ledger-600' : 'text-rust-500'}`}>
          {trend >= 0 ? '+' : ''}
          {trend.toFixed(1)}% vs last month
        </p>
      )}
    </div>
  )
}
