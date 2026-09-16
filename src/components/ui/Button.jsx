const variants = {
  primary: 'bg-ledger-500 text-paper hover:bg-ledger-600 active:bg-ledger-700',
  secondary:
    'bg-transparent border border-hairline dark:border-hairline-dark text-ink-900 dark:text-paper hover:bg-ink-50 dark:hover:bg-ink-800',
  danger: 'bg-rust-500 text-paper hover:bg-rust-600',
  ghost: 'bg-transparent text-ink-500 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800',
}

const sizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
}

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
