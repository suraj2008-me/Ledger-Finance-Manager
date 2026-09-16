export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {Icon && (
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-50 dark:bg-ink-800 text-ink-400">
          <Icon size={20} />
        </div>
      )}
      <p className="font-display text-base text-ink-900 dark:text-paper">{title}</p>
      {description && (
        <p className="max-w-xs text-sm text-ink-400 dark:text-ink-300">{description}</p>
      )}
      {action}
    </div>
  )
}
