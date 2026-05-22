'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {useEffect, useState} from 'react';
import {revenueSeries} from '@/lib/mock-data';

export function RevenueChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[330px] w-full rounded-xl bg-gray-50" />;
  }

  return (
    <div className="h-[330px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueSeries} margin={{top: 12, right: 10, left: 0, bottom: 0}}>
          <defs>
            <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#6D28D9" stopOpacity={0.24} />
              <stop offset="95%" stopColor="#6D28D9" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#EEF0F4" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{fill: '#6B7280', fontSize: 12}}
            tickFormatter={(value) => `₹${Number(value) / 1000}k`}
          />
          <Tooltip
            cursor={{stroke: '#DDD6FE', strokeWidth: 2}}
            contentStyle={{
              borderRadius: 14,
              borderColor: '#E5E7EB',
              boxShadow: '0 14px 30px rgba(17, 24, 39, 0.10)',
            }}
            formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6D28D9"
            strokeWidth={3}
            fill="url(#revenueFill)"
            activeDot={{r: 5, strokeWidth: 2, stroke: '#FFFFFF'}}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
