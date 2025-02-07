export interface BPCategory {
  name: string;
  description: string;
  systolicRange: string;
  diastolicRange: string;
  colorClass: string;
  riskLevel: string;
}

export function getBPCategory(systolic: number, diastolic: number): BPCategory {
  if (systolic < 120 && diastolic < 80) {
    return {
      name: 'Normal',
      description: 'Blood pressure is within the normal range. Maintaining or adopting a healthy lifestyle is recommended.',
      systolicRange: '< 120',
      diastolicRange: '< 80',
      colorClass: 'bg-green-100 text-green-800',
      riskLevel: 'low',
    };
  }
  if (systolic < 130 && diastolic < 80) {
    return {
      name: 'Elevated',
      description: 'Blood pressure is elevated. It\'s advisable to maintain or adopt a healthy lifestyle to prevent progression to hypertension.',
      systolicRange: '120-129',
      diastolicRange: '< 80',
      colorClass: 'bg-yellow-100 text-yellow-800',
      riskLevel: 'moderate',
    };
  }
  if (systolic < 140 || diastolic < 90) {
    return {
      name: 'Stage 1',
      description: 'High blood pressure. Lifestyle changes are recommended. Medication may be considered based on the risk of heart disease or stroke, especially if other conditions like diabetes, heart failure, or kidney disease are present.',
      systolicRange: '130-139',
      diastolicRange: '80-89',
      colorClass: 'bg-orange-100 text-orange-800',
      riskLevel: 'high',
    };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return {
      name: 'Stage 2',
      description: 'Blood pressure is in the high blood pressure Stage 2 range. Lifestyle changes and medication are typically prescribed to lower blood pressure. Multiple medications may be needed to achieve a healthy range.',
      systolicRange: '≥ 140',
      diastolicRange: '≥ 90',
      colorClass: 'bg-red-100 text-red-800',
      riskLevel: 'very-high',
    };
  }
  if (systolic > 180 || diastolic > 120) {
    return {
      name: 'Crisis',
      description: 'This is a hypertensive crisis. Wait five minutes and take your blood pressure again. If readings remain high, contact your healthcare professional immediately. Call 911 if experiencing symptoms like chest pain, shortness of breath, back pain, numbness, weakness, vision changes, or difficulty speaking.',
      systolicRange: '> 180',
      diastolicRange: '> 120',
      colorClass: 'bg-red-200 text-red-900',
      riskLevel: 'critical',
    };
  }
  return {
    name: 'Unknown',
    description: 'Unable to determine blood pressure category',
    systolicRange: '-',
    diastolicRange: '-',
    colorClass: 'bg-gray-100 text-gray-800',
    riskLevel: 'unknown',
  };
}