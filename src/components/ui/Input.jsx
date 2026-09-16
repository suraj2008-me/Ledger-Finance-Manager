export default function Input({ label, error, className = '', id, ...props }) {
  const inputId = id || props.name
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm text-ink-500 dark:text-ink-300">{label}</span>
      )}
      <input
        id={inputId}
        className={`w-full rounded border border-hairline dark:border-hairline-dark bg-transparent px-3 py-2 text-sm text-ink-900 dark:text-paper placeholder:text-ink-300 focus:border-ledger-500 focus:ring-1 focus:ring-ledger-500 ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-rust-500">{error}</span>}
    </label>
  )
}
