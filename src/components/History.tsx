import React, { useMemo, useState, useRef } from 'react';
import { format } from 'date-fns';
import { History as HistoryIcon, Calendar, Download, Upload } from 'lucide-react';
import { ReadingsList } from './ReadingsList';
import { exportToCSV } from '../utils/export';
import { importFromCSV } from '../utils/import';
import type { BloodPressureReading } from '../types/bloodPressure';

interface Props {
  readings: BloodPressureReading[];
  onDelete: (id: string) => void;
  onEdit: (reading: BloodPressureReading) => void;
  onImport: (readings: BloodPressureReading[]) => void;
}

export function History({ readings, onDelete, onEdit, onImport }: Props) {
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { readings: importedReadings, errors } = await importFromCSV(file);
      
      if (errors.length > 0 && importedReadings.length === 0) {
        setImportError(errors[0]);
        return;
      }

      if (importedReadings.length > 0) {
        onImport(importedReadings);
      }
      
      if (errors.length > 0) {
        const message = importedReadings.length > 0
          ? `Imported ${importedReadings.length} readings with ${errors.length} warnings`
          : errors[0];
        setImportError(message);
      } else {
        setImportError(
          importedReadings.length > 0
            ? `Successfully imported ${importedReadings.length} readings`
            : 'No readings found in the CSV file'
        );
      }
    } catch (error) {
      setImportError('Failed to import CSV file');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const groupedReadings = useMemo(() => {
    const groups: Record<string, BloodPressureReading[]> = {};
    
    readings.forEach(reading => {
      const date = format(reading.timestamp, 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(reading);
    });

    return Object.entries(groups)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .map(([date, readings]) => ({
        date,
        readings: readings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      }));
  }, [readings]);

  if (readings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-full">
            <HistoryIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No readings yet</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Add your first blood pressure reading using the form above or import from a CSV file.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              ref={fileInputRef}
              className="hidden"
              id="csv-import"
            />
            <label
              htmlFor="csv-import"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                bg-blue-50 dark:bg-blue-500/10 text-blue-600 hover:text-blue-700 
                dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-100 
                dark:hover:bg-blue-500/20 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Import from CSV
            </label>
          </div>
          {importError && (
            <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 rounded-md">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">{importError}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <HistoryIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">History</h2>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 whitespace-nowrap">
              {readings.length} reading{readings.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              ref={fileInputRef}
              className="hidden"
              id="csv-import"
            />
            <label
              htmlFor="csv-import"
              className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium
                text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300
                hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Upload className="w-4 h-4" />
              Import
            </label>
            <button
              onClick={() => exportToCSV(readings)}
              className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium
                text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300
                hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        {importError && (
          <div className="mt-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">{importError}</p>
          </div>
        )}
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {groupedReadings.map(({ date, readings }) => (
          <div key={date}>
            <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-700/50 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {format(new Date(date), 'MMMM d, yyyy')}
              </h3>
            </div>
            <ReadingsList
              readings={readings}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
        ))}
      </div>
    </div>
  );
}