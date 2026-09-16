import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { formatCompact, formatMoney } from '../../lib/formatters'

export default function ReportsCharts({ data, currency }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barGap={4}>
          <CartesianGrid vertical={false} stroke="#D9D5C9" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6C766B' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: '#6C766B' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCompact(v, currency)}
            width={56}
          />
          <Tooltip
            formatter={(value) => formatMoney(value, currency)}
            contentStyle={{
              borderRadius: 6,
              border: '1px solid #D9D5C9',
              fontSize: 12,
              background: '#F1F3EE',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="income" name="Income" fill="#1F5F4F" radius={[3, 3, 0, 0]} />
          <Bar dataKey="expense" name="Expense" fill="#B4502A" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
