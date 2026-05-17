import { useThemeStore } from '../store/theme.store';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface LeadChartProps {
  data: {
    new: number;
    contacted: number;
    qualified: number;
    proposal: number;
    won: number;
    lost: number;
  };
}

const COLORS = {
  new: '#3b82f6',
  contacted: '#f59e0b',
  qualified: '#10b981',
  proposal: '#8b5cf6',
  won: '#22c55e',
  lost: '#ef4444',
};

const LeadChart = ({ data }: LeadChartProps) => {
  const isDark = useThemeStore((state) => state.isDark);

  const chartData = [
    { name: 'New', value: data.new, color: COLORS.new },
    { name: 'Contacted', value: data.contacted, color: COLORS.contacted },
    { name: 'Qualified', value: data.qualified, color: COLORS.qualified },
    { name: 'Proposal', value: data.proposal, color: COLORS.proposal },
    { name: 'Won', value: data.won, color: COLORS.won },
    { name: 'Lost', value: data.lost, color: COLORS.lost },
  ].filter((item) => item.value > 0);

  if (chartData.length === 0) return null;

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Lead Distribution</h3>
      <div className="flex items-center gap-6">
        <div className="w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={48}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1a1d27' : '#fff',
                  border: `1px solid ${isDark ? '#2a2d3a' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: isDark ? '#e5e7eb' : '#111827',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadChart;
