export default function Spinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center py-10 ${className}`}>
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-ink-200 border-t-ledger-500" />
    </div>
  )
}
