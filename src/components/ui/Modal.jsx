import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  width = "max-w-md",
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-900/40 p-4 pt-16 animate-fade-in sm:pt-24">
      <div
        className={`w-full ${width} rounded-md border border-hairline dark:border-hairline-dark bg-paper dark:bg-ink-800 shadow-subtle`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-hairline dark:border-hairline-dark px-5 py-4">
          <h2 className="font-display text-lg text-ink-900 dark:text-paper">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded p-1 text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
