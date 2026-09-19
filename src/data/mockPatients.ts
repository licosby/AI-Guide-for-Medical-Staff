import { Patient } from '../types/clinical';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-1000213',
    mrn: '1000213',
    name: 'Anderson, John M.',
    dob: '1954-05-17',
    age: 70,
    gender: 'Male',
    pcp: 'Gregory House, MD',
    phone: '555-555-1212',
    email: 'john.anderson@email.com',
    address: '123 Main St, Madison, WI 53703',
    allergies: [
      { allergen: 'Iodinated Contrast Media', severity: 'Anaphylaxis', reaction: 'Severe bronchospasm, facial edema' },
      { allergen: 'Penicillins', severity: 'Moderate', reaction: 'Diffuse urticarial rash' },
      { allergen: 'Shellfish Derived', severity: 'Mild', reaction: 'Nausea, vomiting' },
      { allergen: 'Lisinopril', severity: 'Moderate', reaction: 'Intractable dry cough, early throat tingling' }
    ],
    conditions: [
      'Hypertension',
      'Type 2 Diabetes Mellitus',
      'Coronary Artery Disease',
      'Hyperlipidemia'
    ],
    activeProblems: [
      'Hypertension (Sub-optimally controlled, SBP > 130 mmHg)',
      'Type 2 Diabetes Mellitus without acute complications (HbA1c 7.2%)',
      'Coronary Artery Disease, native vessel',
      'Hyperlipidemia (Mixed dyslipidemia, LDL 82 mg/dL on moderate statin)'
    ],
    vitals: {
      bpSystolic: 128,
      bpDiastolic: 76,
      pulse: 72,
      tempF: 98.2,
      respirations: 16,
      spo2: 96,
      heightInches: 70,
      weightLbs: 182,
      bmi: 26.1,
      recordedTime: '10:15 AM (Today)'
    },
    medications: [
      { id: 'm1', name: 'Amlodipine', genericName: 'amlodipine besylate', dose: '5 mg', route: 'PO (Oral)', frequency: 'Daily', category: 'Antihypertensive' },
      { id: 'm2', name: 'Losartan', genericName: 'losartan potassium', dose: '50 mg', route: 'PO (Oral)', frequency: 'Daily', category: 'Antihypertensive' },
      { id: 'm3', name: 'Atorvastatin', genericName: 'atorvastatin calcium', dose: '20 mg', route: 'PO (Oral)', frequency: 'Nightly', category: 'Lipid-lowering' },
      { id: 'm4', name: 'Metformin', genericName: 'metformin HCl', dose: '500 mg', route: 'PO with meals', frequency: 'BID (Twice Daily)', category: 'Antidiabetic' },
      { id: 'm5', name: 'Aspirin', genericName: 'aspirin', dose: '81 mg', route: 'PO (Oral)', frequency: 'Daily', category: 'Antiplatelet' }
    ],
    procedures: [
      { id: 'pr1', name: 'Diagnostic Colonoscopy', category: 'Endoscopy', urgency: 'Elective', department: 'Endoscopy Suite' }
    ],
    therapies: [
      { id: 'th1', name: 'Physical Therapy (PT) — Gait Training & Core Strengthening', discipline: 'Physical Therapy (PT)', frequency: '2x weekly for 6 weeks', goal: 'Cardiovascular endurance and lumbar stabilization' }
    ],
    tests: [
      { id: 't1', name: 'Comprehensive Metabolic Panel (CMP)', type: 'Laboratory', urgency: 'Routine', department: 'Laboratory' },
      { id: 't2', name: 'Hemoglobin A1c', type: 'Laboratory', urgency: 'Routine', department: 'Laboratory' }
    ],
    recentLabs: [
      { name: 'Hemoglobin A1c', value: '7.2', unit: '%', referenceRange: '< 5.7%', date: 'Apr 15, 2025', isAbnormal: true },
      { name: 'LDL Cholesterol', value: '82', unit: 'mg/dL', referenceRange: '< 100 mg/dL', date: 'Apr 15, 2025', isAbnormal: false },
      { name: 'Creatinine', value: '1.1', unit: 'mg/dL', referenceRange: '0.7 - 1.3 mg/dL', date: 'Apr 15, 2025', isAbnormal: false },
      { name: 'Potassium', value: '4.2', unit: 'mmol/L', referenceRange: '3.5 - 5.0 mmol/L', date: 'Apr 15, 2025', isAbnormal: false },
      { name: 'Hemoglobin', value: '13.6', unit: 'g/dL', referenceRange: '13.5 - 17.5 g/dL', date: 'Apr 15, 2025', isAbnormal: false }
    ],
    encounters: [
      { date: 'May 7, 2025', type: 'Office Visit', provider: 'Gregory House, MD', notes: 'Routine chronic care follow-up. Blood pressure monitored.' },
      { date: 'Apr 15, 2025', type: 'Cardiology Consult', provider: 'Lisa Cuddy, MD', notes: 'Stable CAD. Suggested statin titration if LDL persists above goal.' },
      { date: 'Mar 2, 2025', type: 'ED Visit', provider: 'Robert Chase, MD', notes: 'Atypical chest tightness, ruled out for ACS with serial troponins.' },
      { date: 'Jan 10, 2025', type: 'Office Visit', provider: 'Gregory House, MD', notes: 'Initiated Losartan after Lisinopril cough complaint.' }
    ],
    careGaps: [
      { title: 'Diabetes: Dilated Eye Exam', status: 'Overdue', action: 'Schedule Ophthalmology evaluation' },
      { title: 'Colorectal Cancer Screening', status: 'Due Soon', action: 'Order screening colonoscopy' },
      { title: 'Depression Screening (PHQ-9)', status: 'Due Soon', action: 'Administer intake questionnaire' },
      { title: 'Influenza Vaccine', status: 'Due Fall 2025', action: 'Queue for autumn vaccination clinic' }
    ],
    careTeam: [
      { name: 'Gregory House, MD', role: 'Primary Care Physician', specialty: 'Internal Medicine' },
      { name: 'Lisa Cuddy, MD', role: 'Consulting Cardiologist', specialty: 'Cardiology' },
      { name: 'Robert Chase, MD', role: 'Subspecialist', specialty: 'Endocrinology' }
    ],
    planSummary: 'Continue current medications with renal monitoring. Lifestyle modification: DASH diet, aerobic exercise 150 min/wk, smoking cessation. Recheck A1c in 3 months.'
  },
  {
    id: 'p-1000234',
    mrn: '1000234',
    name: 'Smith, Jane',
    dob: '1956-11-20',
    age: 68,
    gender: 'Female',
    pcp: 'Allison Cameron, MD',
    phone: '555-432-8899',
    email: 'jane.smith@email.com',
    address: '456 Elm St, Madison, WI 53704',
    allergies: [
      { allergen: 'Sulfamethoxazole / Trimethoprim (Bactrim)', severity: 'Severe', reaction: 'Extensive Stevens-Johnson type erythema' }
    ],
    conditions: [
      'Atrial Fibrillation',
      'Osteoarthritis (Bilateral Knees)',
      'Essential Hypertension'
    ],
    activeProblems: [
      'Atrial Fibrillation on chronic oral anticoagulation',
      'Osteoarthritis of knees with moderate mobility reduction',
      'Controlled hypertension'
    ],
    vitals: {
      bpSystolic: 122,
      bpDiastolic: 74,
      pulse: 78,
      tempF: 98.4,
      respirations: 15,
      spo2: 98,
      heightInches: 64,
      weightLbs: 154,
      bmi: 26.4,
      recordedTime: '09:00 AM (Today)'
    },
    medications: [
      { id: 'm21', name: 'Warfarin', genericName: 'warfarin sodium', dose: '5 mg', route: 'PO (Oral)', frequency: 'Daily in evening', category: 'Anticoagulant' },
      { id: 'm22', name: 'Amlodipine', genericName: 'amlodipine besylate', dose: '5 mg', route: 'PO (Oral)', frequency: 'Daily', category: 'Antihypertensive' },
      { id: 'm23', name: 'Acetaminophen (Tylenol)', genericName: 'acetaminophen', dose: '500 mg', route: 'PO (Oral)', frequency: 'Q6H PRN pain', category: 'Analgesic' }
    ],
    procedures: [],
    therapies: [
      { id: 'th21', name: 'Physical Therapy (PT) — Knee Osteoarthritis Functional Mobility', discipline: 'Physical Therapy (PT)', frequency: '2x weekly for 6 weeks', goal: 'Quadriceps strengthening and joint preservation' }
    ],
    tests: [
      { id: 't21', name: 'PT / INR Monitoring', type: 'Laboratory', urgency: 'Routine', department: 'Laboratory' }
    ],
    recentLabs: [
      { name: 'PT / INR', value: '2.4', unit: 'INR', referenceRange: '2.0 - 3.0', date: 'May 1, 2025', isAbnormal: false }
    ],
    encounters: [
      { date: 'May 1, 2025', type: 'Anticoagulation Clinic', provider: 'Pharmacy Team', notes: 'INR within therapeutic window (2.4).' }
    ],
    careGaps: [
      { title: 'Bone Density DEXA Scan', status: 'Due Soon', action: 'Evaluate osteopenia risk' }
    ],
    careTeam: [
      { name: 'Allison Cameron, MD', role: 'Attending Physician', specialty: 'Family Medicine' }
    ],
    planSummary: 'Maintain Warfarin 5mg daily with monthly INR. Conservative knee therapy with aquatic exercise.'
  },
  {
    id: 'p-1000456',
    mrn: '1000456',
    name: 'Brown, Robert',
    dob: '1952-08-14',
    age: 72,
    gender: 'Male',
    pcp: 'Eric Foreman, MD',
    phone: '555-881-2244',
    email: 'robert.brown@email.com',
    address: '789 Oak Ave, Madison, WI 53705',
    allergies: [],
    conditions: [
      'Heart Failure with reduced EF (HFrEF, EF 35%)',
      'Chronic Kidney Disease Stage 3b',
      'Type 2 Diabetes Mellitus'
    ],
    activeProblems: [
      'Decompensated Heart Failure risk',
      'eGFR 38 mL/min/1.73m²',
      'Volume overload sensitivity'
    ],
    vitals: {
      bpSystolic: 136,
      bpDiastolic: 82,
      pulse: 84,
      tempF: 97.9,
      respirations: 18,
      spo2: 95,
      heightInches: 68,
      weightLbs: 198,
      bmi: 30.1,
      recordedTime: '10:30 AM (Today)'
    },
    medications: [
      { id: 'm31', name: 'Losartan', genericName: 'losartan potassium', dose: '50 mg', route: 'PO (Oral)', frequency: 'Daily', category: 'Antihypertensive' },
      { id: 'm32', name: 'Empagliflozin (Jardiance)', genericName: 'empagliflozin', dose: '10 mg', route: 'PO (Oral)', frequency: 'Daily in morning', category: 'SGLT2 Inhibitor' },
      { id: 'm33', name: 'Atorvastatin', genericName: 'atorvastatin', dose: '40 mg', route: 'PO (Oral)', frequency: 'Nightly', category: 'Statin' }
    ],
    procedures: [],
    therapies: [
      { id: 'th31', name: 'Cardiac Rehabilitation Phase II', discipline: 'Physical Therapy (PT)', frequency: '3x weekly for 12 weeks', goal: 'Aerobic reconditioning under telemetry' }
    ],
    tests: [],
    recentLabs: [
      { name: 'eGFR', value: '38', unit: 'mL/min/1.73m²', referenceRange: '> 60', date: 'May 3, 2025', isAbnormal: true },
      { name: 'Serum Creatinine', value: '1.8', unit: 'mg/dL', referenceRange: '0.7 - 1.3', date: 'May 3, 2025', isAbnormal: true },
      { name: 'BNP', value: '420', unit: 'pg/mL', referenceRange: '< 100', date: 'May 3, 2025', isAbnormal: true }
    ],
    encounters: [
      { date: 'May 3, 2025', type: 'Heart Failure Clinic', provider: 'Eric Foreman, MD', notes: 'Assessed fluid status. Trace pedal edema noted.' }
    ],
    careGaps: [
      { title: 'Repeat Echocardiogram', status: 'Overdue', action: 'Assess left ventricular ejection fraction' }
    ],
    careTeam: [
      { name: 'Eric Foreman, MD', role: 'Attending Cardiologist', specialty: 'Heart Failure' }
    ],
    planSummary: 'Strict 2000mg sodium and 1.5L fluid restriction. Daily weight tracking. Monitor renal function.'
  }
];
