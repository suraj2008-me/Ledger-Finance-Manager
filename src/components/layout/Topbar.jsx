import { useState } from 'react'
import { Menu, Moon, Sun, Plus, LogOut } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'

export default function Topbar({ title, onMenuClick, onQuickAdd }) {
  const { theme, toggleTheme } = useTheme()
  const { signOut, user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-hairline dark:border-hairline-dark bg-paper/90 dark:bg-ink-900/90 backdrop-blur px-4 py-3 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded p-1.5 text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-800 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display text-xl text-ink-900 dark:text-paper">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {onQuickAdd && (
          <Button size="sm" onClick={onQuickAdd}>
            <Plus size={15} /> Add entry
          </Button>
        )}
        <button
          onClick={toggleTheme}
          className="rounded p-2 text-ink-500 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-100 text-xs font-medium text-ink-600 dark:bg-ink-700 dark:text-ink-200"
          >
            {(user?.email || '?').slice(0, 1).toUpperCase()}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border border-hairline dark:border-hairline-dark bg-paper dark:bg-ink-800 shadow-subtle">
              <div className="truncate border-b border-hairline dark:border-hairline-dark px-3 py-2 text-xs text-ink-400">
                {user?.email}
              </div>
              <button
                onClick={signOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rust-500 hover:bg-ink-50 dark:hover:bg-ink-700"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
