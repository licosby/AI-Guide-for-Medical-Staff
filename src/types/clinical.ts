export interface MedicationItem {
  id: string;
  name: string;
  genericName: string;
  dose: string;
  route: string;
  frequency: string;
  duration?: string;
  category: string;
  maxDailyDoseMg?: number;
  blackBoxWarning?: string;
}

export interface ProcedureItem {
  id: string;
  name: string;
  category: 'Surgical' | 'Interventional' | 'Endoscopy' | 'Diagnostic' | 'Bedside';
  cptCode?: string;
  urgency: 'Elective' | 'Urgent' | 'Emergent';
  department: 'Operating Room' | 'Cath Lab' | 'Endoscopy Suite' | 'Interventional Radiology' | 'Bedside';
}

export interface TherapyItem {
  id: string;
  name: string;
  discipline: 'Physical Therapy (PT)' | 'Occupational Therapy (OT)' | 'Respiratory Therapy (RT)' | 'Speech-Language (SLP)' | 'Wound Care' | 'Infusion/Dialysis' | 'Behavioral Health (CBT)';
  frequency: string;
  goal: string;
}

export interface DiagnosticTestItem {
  id: string;
  name: string;
  type: 'Imaging' | 'Laboratory' | 'Diagnostic / ECG';
  urgency: 'Routine' | 'Priority' | 'STAT';
  department: 'Radiology' | 'Laboratory' | 'Cardiology';
}

export interface Allergy {
  allergen: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Anaphylaxis';
  reaction: string;
}

export interface VitalSigns {
  bpSystolic: number;
  bpDiastolic: number;
  pulse: number;
  tempF: number;
  respirations: number;
  spo2: number;
  heightInches: number;
  weightLbs: number;
  bmi: number;
  recordedTime: string;
}

export interface LabResult {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  date: string;
  isAbnormal?: boolean;
}

export interface Encounter {
  date: string;
  type: string;
  provider: string;
  notes?: string;
}

export interface CareGap {
  title: string;
  status: 'Overdue' | 'Due Soon' | 'Completed' | 'Due Fall 2025';
  action: string;
}

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  dob: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  pcp: string;
  phone: string;
  email: string;
  address: string;
  allergies: Allergy[];
  conditions: string[];
  vitals: VitalSigns;
  medications: MedicationItem[];
  procedures: ProcedureItem[];
  therapies: TherapyItem[];
  tests: DiagnosticTestItem[];
  recentLabs: LabResult[];
  encounters: Encounter[];
  careGaps: CareGap[];
  careTeam: { name: string; role: string; specialty: string }[];
  activeProblems: string[];
  planSummary: string;
}

export interface ClinicalAlert {
  id: string;
  severity: 'Critical' | 'High' | 'Moderate' | 'Low' | 'Info';
  title: string;
  category: 'Drug Interaction' | 'Contraindication' | 'Overdose / Max Dose' | 'Allergy Conflict' | 'Guideline Recommendation' | 'Documentation / Consent';
  summary: string;
  detailedReason: string;
  clinicalGuideline: string;
  impactScore: number;
  sourceItem?: string;
}

export interface RiskAnalysis {
  overallScore: number; // 0-100
  riskCategory: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  clinicalConfidence: number; // e.g. 78%
  expectedBenefit: 'Low' | 'Moderate' | 'High';
  potentialHarm: 'Low' | 'Moderate' | 'High';
  breakdown: {
    drugInteractions: number;
    adverseEffects: number;
    diseaseInteractions: number;
    doseAndDuration: number;
    duplication: number;
  };
  keyDrivers: {
    name: string;
    impactLevel: 'High' | 'Moderate' | 'Low';
    percentage: number;
    points: number;
    source: string;
    patientValue: string;
  }[];
  alerts: ClinicalAlert[];
  guidelineAlignments: {
    name: string;
    guideline: string;
    status: 'Aligned' | 'Consider' | 'Non-Aligned';
  }[];
  alternatives: {
    title: string;
    description: string;
    riskReductionPercent: number;
  }[];
}
