import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import type { BloodPressureReading } from '../types/bloodPressure';

interface Props {
  data: BloodPressureReading[];
}

export function BPChart({ data }: Props) {
  const chartData = [...data].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()).map(reading => ({
    ...reading,
    datetime: format(reading.timestamp, 'MM/dd HH:mm'),
  }));

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Blood Pressure Trends</h2>
      <div className="h-[300px] sm:h-[400px] -mx-4 sm:mx-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            className="text-gray-600 dark:text-gray-400"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="datetime"
              tick={{ fontSize: 12 }}
              stroke="currentColor"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="currentColor"
            />
            <Tooltip
              labelFormatter={(value) => `Date/Time: ${value}`}
              formatter={(value, name) => [value, name === 'pulse' ? 'BPM' : 'mmHg']}
              contentStyle={{
                backgroundColor: 'rgb(31, 41, 55)',
                border: 'none',
                borderRadius: '0.375rem',
                color: 'rgb(209, 213, 219)',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="systolic"
              stroke="#ef4444"
              name="Systolic"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="diastolic"
              stroke="#3b82f6"
              name="Diastolic"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="pulse"
              stroke="#10b981"
              name="Pulse"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-red-500" /> Systolic (mmHg)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-blue-500" /> Diastolic (mmHg)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-green-500" /> Pulse (BPM)
        </div>
      </div>
    </div>
  );
}