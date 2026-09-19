const variants = {
  primary:
    "bg-ledger-500 text-white hover:bg-ledger-600 active:bg-ledger-700 shadow-sm shadow-ledger-500/20",
  secondary:
    "bg-white border border-ink-200 text-ink-800 hover:bg-paper dark:bg-white/[0.04] dark:border-white/[0.09] dark:text-ink-100 dark:hover:bg-white/[0.07]",
  danger: "bg-rose-500 text-white hover:bg-rose-600",
  ghost:
    "bg-transparent text-paper0 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-white/[0.06]",
};
const sizes = {
  sm: "text-sm px-3.5 py-2",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-5 py-3",
};
export default function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
