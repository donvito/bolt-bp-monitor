import { parse } from 'date-fns';
import type { BloodPressureReading } from '../types/bloodPressure';

interface CSVRow {
  date?: string;
  time?: string;
  systolic?: string;
  diastolic?: string;
  pulse?: string;
}

export async function importFromCSV(file: File): Promise<{ readings: BloodPressureReading[]; errors: string[] }> {
  const text = await file.text();
  const lines = text.split('\n');
  
  if (lines.length === 0 || (lines.length === 1 && !lines[0].trim())) {
    return { readings: [], errors: ['The CSV file is empty'] };
  }
  
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
  
  if (headers.length === 0 || (headers.length === 1 && !headers[0])) {
    return { readings: [], errors: ['The CSV file contains no headers'] };
  }
  
  // Validate required headers
  const requiredHeaders = ['systolic', 'diastolic'];
  const missingHeaders = requiredHeaders.filter(required => 
    !headers.some(h => h.includes(required))
  );
  
  if (missingHeaders.length > 0) {
    return { 
      readings: [], 
      errors: [`Missing required headers: ${missingHeaders.join(', ')}`] 
    };
  }
  
  const readings: BloodPressureReading[] = [];
  const errors: string[] = [];
  
  // Process each line (skip header)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      const values = line.split(',').map(v => v.trim());
      const row: CSVRow = {};
      
      // Map values to their headers
      headers.forEach((header, index) => {
        if (values[index]) {
          if (header.includes('date')) row.date = values[index];
          else if (header.includes('time')) row.time = values[index];
          else if (header.includes('systolic')) row.systolic = values[index];
          else if (header.includes('diastolic')) row.diastolic = values[index];
          else if (header.includes('pulse') || header.includes('bpm')) row.pulse = values[index];
        }
      });
      
      // Validate required fields
      if (!row.systolic || !row.diastolic) {
        errors.push(`Line ${i + 1}: Missing systolic or diastolic values`);
        continue;
      }
      
      // Parse values
      const systolic = parseInt(row.systolic);
      const diastolic = parseInt(row.diastolic);
      const pulse = row.pulse ? parseInt(row.pulse) : undefined;
      
      // Validate ranges
      if (isNaN(systolic) || systolic < 70 || systolic > 200) {
        errors.push(`Line ${i + 1}: Invalid systolic value (${row.systolic})`);
        continue;
      }
      if (isNaN(diastolic) || diastolic < 40 || diastolic > 130) {
        errors.push(`Line ${i + 1}: Invalid diastolic value (${row.diastolic})`);
        continue;
      }
      if (pulse !== undefined && (isNaN(pulse) || pulse < 40 || pulse > 200)) {
        errors.push(`Line ${i + 1}: Invalid pulse value (${row.pulse})`);
        continue;
      }
      
      // Parse timestamp
      let timestamp: Date;
      if (row.date && row.time) {
        // Try common date formats
        try {
          const dateStr = `${row.date} ${row.time}`;
          timestamp = parse(dateStr, 'yyyy-MM-dd HH:mm:ss', new Date());
          if (isNaN(timestamp.getTime())) {
            timestamp = parse(dateStr, 'MM/dd/yyyy HH:mm:ss', new Date());
          }
        } catch {
          timestamp = new Date();
          errors.push(`Line ${i + 1}: Could not parse date/time, using current timestamp`);
        }
      } else {
        timestamp = new Date();
        errors.push(`Line ${i + 1}: Missing date/time, using current timestamp`);
      }
      
      readings.push({
        id: crypto.randomUUID(),
        systolic,
        diastolic,
        pulse,
        timestamp,
      });
      
    } catch (error) {
      errors.push(`Line ${i + 1}: Failed to process row - ${error}`);
    }
  }
  
  return { readings, errors };
}