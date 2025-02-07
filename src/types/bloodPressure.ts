export interface BloodPressureReading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  timestamp: Date;
}

export interface ReadingFormData {
  systolic: string;
  diastolic: string;
  pulse: string;
  datetime?: string;
  id?: string;
}