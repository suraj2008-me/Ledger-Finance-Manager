import { useState } from "react";
import { formatMoney } from "../../lib/formatters";

/**
 * Ranked list with a share-of-total bar for each row.
 * items: [{ name, color, value, count }] sorted high -> low.
 */
export default function BreakdownList({
  items,
  currency,
  emptyText = "Nothing to show for this period.",
  initial = 8,
}) {
  const [showAll, setShowAll] = useState(false);

  if (!items.length) {
    return <p className="py-8 text-center text-sm text-ink-400">{emptyText}</p>;
  }

  const total = items.reduce((s, i) => s + i.value, 0);
  const visible = showAll ? items : items.slice(0, initial);

  return (
    <div>
      <ul className="space-y-4">
        {visible.map((item) => {
          const pct = total ? (item.value / total) * 100 : 0;
          return (
            <li key={item.name}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate font-medium text-ink-800 dark:text-ink-100">
                    {item.name}
                  </span>
                  <span className="shrink-0 text-xs text-ink-400">
                    {item.count} {item.count === 1 ? "txn" : "txns"}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="tabular font-semibold text-ink-900 dark:text-white">
                    {formatMoney(item.value, currency)}
                  </span>
                  <span className="w-10 text-right text-xs text-ink-400">
                    {pct > 0 && pct < 1 ? "<1%" : `${Math.round(pct)}%`}
                  </span>
                </div>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-white/[0.06]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(pct, 2)}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      {items.length > initial && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-4 text-xs font-semibold text-ledger-600 hover:underline dark:text-ledger-300"
        >
          {showAll ? "Show less" : `Show all ${items.length}`}
        </button>
      )}
    </div>
  );
}
