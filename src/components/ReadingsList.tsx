import React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { getBPCategory } from '../utils/bloodPressure';
import type { BloodPressureReading } from '../types/bloodPressure';

interface Props {
  readings: BloodPressureReading[];
  onDelete: (id: string) => void;
  onEdit: (reading: BloodPressureReading) => void;
}

export function ReadingsList({ readings, onDelete, onEdit }: Props) {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {readings.map((reading) => {
        const category = getBPCategory(reading.systolic, reading.diastolic);

        return (
          <div
            key={reading.id}
            className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors p-3"
          >
            {/* Header: Time, Category, Actions */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {format(reading.timestamp, 'h:mm a')}
              </span>
              <CategoryBadge category={category} />
            </div>
            
            {/* Readings */}
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {reading.systolic}/{reading.diastolic}
                <span className="text-xs font-normal text-gray-500 ml-1">mmHg</span>
              </span>
              {reading.pulse && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {reading.pulse}
                    <span className="text-xs font-normal text-gray-500 ml-1">BPM</span>
                  </span>
                </>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => onEdit(reading)}
                className="p-1.5 rounded text-xs font-medium
                  text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300
                  hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(reading.id)}
                className="p-1.5 rounded text-xs font-medium
                  text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300
                  hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
    );
}