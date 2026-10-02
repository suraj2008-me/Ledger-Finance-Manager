import { CalendarDays } from "lucide-react";

const pad = (n) => String(n).padStart(2, "0");

// Local-time ISO date (YYYY-MM-DD). Avoids toISOString(), which shifts the
// date by timezone and can show "yesterday" early in the morning.
export const toISO = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseISO = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const PRESETS = [
  {
    key: "today",
    label: "Today",
    get: (n) => ({ from: toISO(n), to: toISO(n) }),
  },
  {
    key: "this-month",
    label: "This month",
    get: (n) => ({
      from: toISO(new Date(n.getFullYear(), n.getMonth(), 1)),
      to: toISO(new Date(n.getFullYear(), n.getMonth() + 1, 0)),
    }),
  },
  {
    key: "last-month",
    label: "Last month",
    get: (n) => ({
      from: toISO(new Date(n.getFullYear(), n.getMonth() - 1, 1)),
      to: toISO(new Date(n.getFullYear(), n.getMonth(), 0)),
    }),
  },
  {
    key: "3-months",
    label: "Last 3 months",
    get: (n) => ({
      from: toISO(new Date(n.getFullYear(), n.getMonth() - 2, 1)),
      to: toISO(n),
    }),
  },
  {
    key: "6-months",
    label: "Last 6 months",
    get: (n) => ({
      from: toISO(new Date(n.getFullYear(), n.getMonth() - 5, 1)),
      to: toISO(n),
    }),
  },
  {
    key: "this-year",
    label: "This year",
    get: (n) => ({
      from: toISO(new Date(n.getFullYear(), 0, 1)),
      to: toISO(n),
    }),
  },
];

export function getPresetRange(key, now = new Date()) {
  const preset = PRESETS.find((p) => p.key === key);
  return { ...preset.get(now), preset: key };
}

const dateInputClass =
  "rounded-xl border border-ink-200 bg-paper/60 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition focus:border-ledger-500 focus:bg-white focus:ring-4 focus:ring-ledger-500/10 dark:border-white/[.09] dark:bg-white/[.035] dark:text-white dark:[color-scheme:dark] dark:focus:border-ledger-400 dark:focus:bg-white/[.05]";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-[.08em] text-paper0 dark:text-ink-400";

/**
 * value: { from: "YYYY-MM-DD", to: "YYYY-MM-DD", preset: string }
 * onChange receives the same shape. Editing either date switches the
 * preset to "custom". Pick the same date in both boxes for a single day.
 */
export default function DateRangeFilter({ value, onChange }) {
  const { from, to, preset } = value;

  const setFrom = (v) => {
    if (!v) return;
    onChange({ from: v, to: v > to ? v : to, preset: "custom" });
  };
  const setTo = (v) => {
    if (!v) return;
    onChange({ from: v < from ? v : from, to: v, preset: "custom" });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => onChange(getPresetRange(p.key))}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              preset === p.key
                ? "border-ledger-500 bg-ledger-50 text-ledger-700 dark:border-ledger-400/40 dark:bg-ledger-500/15 dark:text-ledger-200"
                : "border-ink-200 text-ink-500 hover:bg-paper dark:border-white/[.09] dark:text-ink-300 dark:hover:bg-white/[.05]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className={labelClass}>From</span>
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => setFrom(e.target.value)}
            className={dateInputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>To</span>
          <input
            type="date"
            value={to}
            min={from}
            onChange={(e) => setTo(e.target.value)}
            className={dateInputClass}
          />
        </label>
        <p className="flex items-center gap-1.5 pb-3 text-xs text-ink-400">
          <CalendarDays size={14} />
          Choose the same date in both boxes to see a single day.
        </p>
      </div>
    </div>
  );
}
