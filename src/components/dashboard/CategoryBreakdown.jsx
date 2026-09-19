import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatMoney } from "../../lib/formatters";

export default function CategoryBreakdown({ data, currency }) {
  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-400">
        No expenses recorded yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={48}
              outerRadius={70}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatMoney(value, currency)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full flex-1 space-y-2">
        {data.slice(0, 6).map((d) => (
          <div
            key={d.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-ink-700 dark:text-ink-200">{d.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="tabular text-ink-500 dark:text-ink-300">
                {formatMoney(d.value, currency)}
              </span>
              <span className="w-10 text-right text-xs text-ink-300">
                {total ? Math.round((d.value / total) * 100) : 0}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
