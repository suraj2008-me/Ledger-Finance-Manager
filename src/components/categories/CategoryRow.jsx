import { Pencil, Trash2 } from 'lucide-react'
import IconBadge from '../ui/IconBadge'

export default function CategoryRow({ category, onEdit, onDelete }) {
  return (
    <div className="group flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <IconBadge color={category.color} label={category.name} />
        <span className="text-sm text-ink-900 dark:text-paper">{category.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs capitalize text-ink-400">{category.type}</span>
        <div className="items-center gap-2 flex">
          <button
            onClick={() => onEdit(category)}
            className="rounded p-1.5 text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="rounded p-1.5 text-ink-400 hover:bg-rust-50 hover:text-rust-500 dark:hover:bg-rust-900/30"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
