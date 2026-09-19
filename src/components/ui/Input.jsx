export default function Input({ label, error, className = "", id, ...props }) {
  const inputId = id || props.name;
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[.08em] text-paper0 dark:text-ink-400">
          {label}
        </span>
      )}
      <input
        id={inputId}
        className={`w-full rounded-xl border border-ink-200 bg-paper/60 px-3.5 py-3 text-sm text-ink-900 outline-none transition focus:border-ledger-500 focus:bg-white focus:ring-4 focus:ring-ledger-500/10 dark:border-white/[.09] dark:bg-white/[.035] dark:text-white dark:placeholder:text-ink-600 dark:focus:border-ledger-400 dark:focus:bg-white/[.05] ${className}`}
        {...props}
      />
      {error && (
        <span className="mt-1 block text-xs text-rust-500">{error}</span>
      )}
    </label>
  );
}
