import { format } from 'date-fns';
import type { BloodPressureReading } from '../types/bloodPressure';
import { getBPCategory } from './bloodPressure';

export function exportToCSV(readings: BloodPressureReading[]): void {
  // Sort readings by date (newest first)
  const sortedReadings = [...readings].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  // Create CSV header
  const headers = ['Date', 'Time', 'Systolic (mmHg)', 'Diastolic (mmHg)', 'Pulse (BPM)', 'Category', 'Risk Level'];
  
  // Convert readings to CSV rows
  const rows = sortedReadings.map(reading => {
    const category = getBPCategory(reading.systolic, reading.diastolic);
    return [
      format(reading.timestamp, 'yyyy-MM-dd'),
      format(reading.timestamp, 'HH:mm:ss'),
      reading.systolic,
      reading.diastolic,
      reading.pulse || '',
      category.name,
      category.riskLevel,
    ].join(',');
  });
  
  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `blood-pressure-readings-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}