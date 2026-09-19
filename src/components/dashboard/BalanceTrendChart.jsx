import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCompact } from "../../lib/formatters";

export default function BalanceTrendChart({ data, currency }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
        >
          <defs>
            <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1F5F4F" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#1F5F4F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="#D9D5C9"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#6C766B" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6C766B" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCompact(v, currency)}
            width={56}
          />
          <Tooltip
            formatter={(value) => formatCompact(value, currency)}
            contentStyle={{
              borderRadius: 6,
              border: "1px solid #D9D5C9",
              fontSize: 12,
              background: "#F1F3EE",
            }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#1F5F4F"
            strokeWidth={2}
            fill="url(#balanceFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
