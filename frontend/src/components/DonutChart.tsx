'use client';

import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {useEffect, useState} from 'react';

const COLORS = ['#6D28D9', '#10B981', '#F59E0B', '#111827'];

export function DonutChart({data}: {data: Array<{name: string; value: number}>}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 rounded-xl bg-gray-50" />;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={4}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 14,
              borderColor: '#E5E7EB',
              boxShadow: '0 14px 30px rgba(17, 24, 39, 0.10)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
