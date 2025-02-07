import React from 'react';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';
import type { BloodPressureReading } from '../types/bloodPressure';
import { getBPCategory } from '../utils/bloodPressure';

interface Props {
  readings: BloodPressureReading[];
}

export function ReadingStats({ readings }: Props) {
  if (readings.length === 0) return null;

  const latest = readings[readings.length - 1];
  const category = getBPCategory(latest.systolic, latest.diastolic);

  // Calculate averages
  const avgSystolic = Math.round(
    readings.reduce((sum, r) => sum + r.systolic, 0) / readings.length
  );
  const avgDiastolic = Math.round(
    readings.reduce((sum, r) => sum + r.diastolic, 0) / readings.length
  );
  
  const readingsWithPulse = readings.filter(r => r.pulse !== undefined);
  const avgPulse = readingsWithPulse.length > 0
    ? Math.round(
    readingsWithPulse.reduce((sum, r) => sum + (r.pulse ?? 0), 0) / readingsWithPulse.length
  )
    : undefined;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
        <Activity className="w-6 h-6 text-blue-500" />
        <span className="text-gray-900 dark:text-white">Latest Reading Analysis</span>
      </h2>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Current Status</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-red-500 mt-1" />
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{latest.systolic}/{latest.diastolic}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">mmHg</div>
              </div>
            </div>
            {latest.pulse && (
              <div className="flex items-start gap-3">
                <TrendingDown className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{latest.pulse}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">BPM</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Averages</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Systolic</span>
              <span className="font-semibold text-gray-900 dark:text-white">{avgSystolic} mmHg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Diastolic</span>
              <span className="font-semibold text-gray-900 dark:text-white">{avgDiastolic} mmHg</span>
            </div>
            {avgPulse !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pulse</span>
                <span className="font-semibold text-gray-900 dark:text-white">{avgPulse} BPM</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}