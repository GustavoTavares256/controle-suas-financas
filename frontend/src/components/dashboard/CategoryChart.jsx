import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../utils/format';
import { CORES_CATEGORIAS } from '../../utils/constants';

const tooltipStyle = {
  borderRadius: 10,
  border: '1px solid #e5e7eb',
  boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
  fontSize: 13,
};

export default function CategoryChart({ data, animations = true }) {
  const colored = data.map((item, index) => ({
    ...item,
    fill: CORES_CATEGORIAS[index % CORES_CATEGORIAS.length],
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={colored}
          dataKey="value"
          nameKey="name"
          innerRadius="58%"
          outerRadius="82%"
          paddingAngle={3}
          strokeWidth={0}
          isAnimationActive={animations}
        >
          {colored.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [formatCurrency(value), name]}
          contentStyle={tooltipStyle}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12 }}
          formatter={(value) => value}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
