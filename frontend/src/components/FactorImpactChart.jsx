import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from 'recharts';
import { Info } from 'lucide-react';

export default function FactorImpactChart({ factorImpacts }) {
  if (!factorImpacts || factorImpacts.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
        No factor impact data available.
      </div>
    );
  }

  // Format data for chart
  const chartData = factorImpacts.map(item => ({
    name: item.label.split(' ')[0], // Short name
    fullName: item.label,
    value: item.value,
    median: item.median,
    impact: item.impact_score,
    direction: item.direction
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPositive = data.impact > 0;
      return (
        <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-xs space-y-1">
          <p className="font-bold text-white">{data.fullName}</p>
          <p className="text-slate-300">Patient Value: <span className="font-semibold text-blue-400">{data.value}</span> (Median: {data.median})</p>
          <p className={isPositive ? 'text-red-400 font-medium' : 'text-emerald-400 font-medium'}>
            Impact Score: {data.impact > 0 ? `+${data.impact}` : data.impact} ({isPositive ? 'Increases Risk' : 'Lowers Risk'})
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full pt-2">
      <div className="flex items-center justify-between mb-3 px-2">
        <h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-1.5">
          <span>Patient Feature Impact Breakdown</span>
        </h4>
        <span className="text-[11px] text-slate-400 flex items-center space-x-1">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>Red = Increases Risk | Green = Reduces Risk</span>
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
          >
            <XAxis type="number" domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={0} stroke="#475569" strokeDasharray="3 3" />
            <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.impact > 0.05 ? '#ef4444' : (entry.impact < -0.05 ? '#10b981' : '#64748b')}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
