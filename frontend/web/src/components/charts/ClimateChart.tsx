import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface ClimateChartProps {
  data: Array<{ date: string; temperatureC: number; co2ppm?: number }>;
}

export const ClimateChart: React.FC<ClimateChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
          <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
            }}
            labelStyle={{ color: 'var(--text-secondary)' }}
          />
          <Area type="monotone" dataKey="temperatureC" name="Temp (°C)" stroke="var(--primary-light)" strokeWidth={2} fillOpacity={1} fill="url(#tempGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
