import { useState } from "react";
import { Menu, X, Moon, Sun, LogOut, Bell } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

export default function Topbar({ title, onMenuClick, onQuickAdd }) {
  const { theme, toggleTheme } = useTheme();
  const { signOut, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = (user?.email || "?").slice(0, 1).toUpperCase();
  return (
    <header className="sticky top-0 z-30 border-b border-ink-200/80 bg-paper/85 backdrop-blur-xl dark:border-white/[0.06] dark:bg-ink-950/80">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="group rounded-xl p-2 text-paper0 transition-all duration-200 hover:bg-ledger-50 hover:text-ledger-700 active:scale-95 dark:hover:bg-ledger-500/10 dark:hover:text-ledger-300 lg:hidden"
            aria-label="Open menu"
          >
            <span className="block transition-transform duration-200 group-active:scale-90">
              <Menu size={20} />
            </span>
          </button>
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight text-ink-950 dark:text-white">
              {title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {onQuickAdd && (
            <Button
              size="sm"
              onClick={onQuickAdd}
              className="hidden rounded-xl bg-ink-950 px-4 shadow-md sm:inline-flex dark:bg-ledger-600 dark:hover:bg-ledger-500"
            >
              Add transaction
            </Button>
          )}
          <button
            className="hidden rounded-xl p-2.5 text-paper0 hover:bg-white dark:hover:bg-white/[0.06] sm:block"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2.5 text-paper0 hover:bg-white dark:hover:bg-white/[0.06]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-ledger-500 to-ledger-600 text-sm font-bold text-white"
            >
              {initial}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#12151D]">
                <div className="border-b border-ink-100 px-4 py-3 text-xs text-paper0 dark:border-white/[0.06]">
                  {user?.email}
                </div>
                <button
                  onClick={signOut}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-500 hover:bg-paper dark:hover:bg-white/[0.04]"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
