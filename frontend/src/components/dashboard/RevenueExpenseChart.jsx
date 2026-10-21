import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { formatCurrencyCompact } from '../../utils/format';

const tooltipStyle = {
  borderRadius: 10,
  border: '1px solid #e5e7eb',
  boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
  fontSize: 13,
};

export default function RevenueExpenseChart({ data, animations = true }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barGap={6} margin={{ top: 12, right: 8, left: -6, bottom: 0 }}>
        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="mesLabel"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCurrencyCompact}
        />
        <Tooltip
          formatter={(value, name) => [formatCurrencyCompact(value), name === 'receitas' ? 'Entradas' : 'Despesas']}
          contentStyle={tooltipStyle}
          cursor={{ fill: 'rgba(99,102,241,0.05)' }}
        />
        <Legend
          formatter={(value) => (value === 'receitas' ? 'Entradas' : 'Despesas')}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12.5 }}
        />
        <Bar dataKey="receitas" name="receitas" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={34} isAnimationActive={animations} />
        <Bar dataKey="despesas" name="despesas" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={34} isAnimationActive={animations} />
      </BarChart>
    </ResponsiveContainer>
  );
}
