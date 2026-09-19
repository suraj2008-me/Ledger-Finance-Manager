import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ title, onQuickAdd, children }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
    const timer = setTimeout(() => setMounted(false), 260);
    return () => clearTimeout(timer);
  }, [open]);
  return (
    <div className="min-h-screen bg-paper dark:bg-ink-950 lg:flex">
      <aside className="hidden w-[248px] shrink-0 border-r border-ink-200/80 dark:border-white/[0.06] lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar onQuickAdd={onQuickAdd} />
        </div>
      </aside>
      {mounted && (
        <div
          className={`mobile-drawer fixed inset-0 z-50 lg:hidden ${open ? "is-open" : "is-closing"}`}
        >
          <button
            className="mobile-drawer__backdrop absolute inset-0 w-full cursor-default border-0 bg-ink-950/60 p-0 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <div className="mobile-drawer__panel absolute left-0 top-0 h-full w-[280px] border-r border-ledger-500/15 shadow-2xl">
            <Sidebar
              onNavigate={() => setOpen(false)}
              onQuickAdd={onQuickAdd}
            />
          </div>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <Topbar
          title={title}
          onMenuClick={() => setOpen(true)}
          onQuickAdd={onQuickAdd}
        />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
