import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getPasswordStrength } from "../../lib/password";

/**
 * Password field with a show/hide toggle, styled to match Input.jsx exactly.
 * Pass `showStrength` to render a live strength meter under the field
 * (used on signup / change-password forms, not on login).
 */
export default function PasswordInput({
  label,
  error,
  className = "",
  id,
  showStrength = false,
  value = "",
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const inputId = id || props.name;
  const strength = showStrength ? getPasswordStrength(value) : null;

  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[.08em] text-paper0 dark:text-ink-400">
          {label}
        </span>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          value={value}
          autoComplete={props.autoComplete ?? "current-password"}
          className={`w-full rounded-xl border border-ink-200 bg-paper/60 px-3.5 py-3 pr-11 text-sm text-ink-900 outline-none transition focus:border-ledger-500 focus:bg-white focus:ring-4 focus:ring-ledger-500/10 dark:border-white/[.09] dark:bg-white/[.035] dark:text-white dark:placeholder:text-ink-600 dark:focus:border-ledger-400 dark:focus:bg-white/[.05] ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex items-center px-3.5 text-ink-400 transition hover:text-ledger-600 dark:text-ink-500 dark:hover:text-ledger-300"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {showStrength && value && (
        <div className="mt-2">
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= strength.score
                    ? strength.color
                    : "bg-ink-100 dark:bg-white/[.08]"
                }`}
              />
            ))}
          </div>
          <p className="mt-1 text-[11px] text-ink-400 dark:text-ink-500">
            {strength.label}
          </p>
        </div>
      )}

      {error && (
        <span className="mt-1 block text-xs text-rust-500">{error}</span>
      )}
    </label>
  );
}
