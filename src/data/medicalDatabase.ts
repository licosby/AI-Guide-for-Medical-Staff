export interface DrugCatalogItem {
  name: string;
  generic: string;
  category: string;
  commonDoses: string[];
  routes: string[];
  frequencies: string[];
  maxDailyMg: number;
  blackBox?: string;
  contraindicatedConditions: string[];
  interactions: { targetDrug: string; severity: 'High' | 'Moderate'; reason: string }[];
}

export const DRUG_CATALOG: DrugCatalogItem[] = [
  {
    name: 'Amlodipine',
    generic: 'amlodipine besylate',
    category: 'Calcium Channel Blocker',
    commonDoses: ['2.5 mg', '5 mg', '10 mg'],
    routes: ['PO (Oral)'],
    frequencies: ['Daily', 'BID (Twice Daily)'],
    maxDailyMg: 10,
    contraindicatedConditions: ['Severe aortic stenosis', 'Cardiogenic shock'],
    interactions: [
      { targetDrug: 'Atorvastatin', severity: 'Moderate', reason: 'Amlodipine may increase Atorvastatin serum concentration. Limit Atorvastatin to 20mg or monitor for myopathy.' },
      { targetDrug: 'Simvastatin', severity: 'High', reason: 'Amlodipine increases Simvastatin exposure. Do not exceed Simvastatin 20mg daily.' }
    ]
  },
  {
    name: 'Atorvastatin',
    generic: 'atorvastatin calcium',
    category: 'HMG-CoA Reductase Inhibitor (Statin)',
    commonDoses: ['10 mg', '20 mg', '40 mg', '80 mg'],
    routes: ['PO (Oral)'],
    frequencies: ['Nightly', 'Daily'],
    maxDailyMg: 80,
    contraindicatedConditions: ['Active liver disease', 'Unexplained persistent transaminase elevations', 'Pregnancy'],
    interactions: [
      { targetDrug: 'Clarithromycin', severity: 'High', reason: 'Strong CYP3A4 inhibition drastically increases rhabdomyolysis risk.' },
      { targetDrug: 'Gemfibrozil', severity: 'High', reason: 'Marked increase in risk of myopathy and acute rhabdomyolysis.' },
      { targetDrug: 'Amlodipine', severity: 'Moderate', reason: 'Mild-to-moderate CYP3A4 competition; monitor liver enzymes and muscle soreness.' }
    ]
  },
  {
    name: 'Losartan',
    generic: 'losartan potassium',
    category: 'Angiotensin II Receptor Blocker (ARB)',
    commonDoses: ['25 mg', '50 mg', '100 mg'],
    routes: ['PO (Oral)'],
    frequencies: ['Daily', 'BID (Twice Daily)'],
    maxDailyMg: 100,
    contraindicatedConditions: ['Pregnancy', 'Bilateral renal artery stenosis', 'Concurrent Aliskiren in diabetes'],
    interactions: [
      { targetDrug: 'Lisinopril', severity: 'High', reason: 'Dual renin-angiotensin-aldosterone blockade increases hyperkalemia, acute kidney injury (AKI), and hypotension.' },
      { targetDrug: 'Potassium Chloride', severity: 'High', reason: 'Substantially increased danger of severe hyperkalemia and cardiac arrest.' },
      { targetDrug: 'Ibuprofen', severity: 'Moderate', reason: 'NSAIDs attenuate antihypertensive effect and worsen renal perfusion.' }
    ]
  },
  {
    name: 'Lisinopril',
    generic: 'lisinopril',
    category: 'ACE Inhibitor',
    commonDoses: ['5 mg', '10 mg', '20 mg', '40 mg'],
    routes: ['PO (Oral)'],
    frequencies: ['Daily'],
    maxDailyMg: 80,
    blackBox: 'Fetal toxicity. Discontinue immediately when pregnancy is detected.',
    contraindicatedConditions: ['History of ACEi angioedema', 'Hereditary angioedema', 'Pregnancy'],
    interactions: [
      { targetDrug: 'Losartan', severity: 'High', reason: 'Dual RAAS blockade causes renal failure and hyperkalemia without added cardiovascular benefit.' },
      { targetDrug: 'Spironolactone', severity: 'Moderate', reason: 'Risk of hyperkalemia; requires strict potassium and creatinine monitoring.' }
    ]
  },
  {
    name: 'Metformin',
    generic: 'metformin hydrochloride',
    category: 'Biguanide',
    commonDoses: ['500 mg', '850 mg', '1000 mg'],
    routes: ['PO with meals'],
    frequencies: ['BID (Twice Daily)', 'TID (Three times daily)', 'Daily (ER)'],
    maxDailyMg: 2550,
    blackBox: 'Lactic acidosis risk, particularly with severe renal impairment (eGFR < 30 mL/min).',
    contraindicatedConditions: ['Severe renal impairment (eGFR < 30)', 'Acute metabolic acidosis', 'Acute decompensated heart failure'],
    interactions: [
      { targetDrug: 'Iodinated Contrast', severity: 'High', reason: 'Contrast-induced nephropathy can trigger life-threatening Metformin-induced lactic acidosis. Hold Metformin 48h before/after procedure.' }
    ]
  },
  {
    name: 'Aspirin',
    generic: 'acetylsalicylic acid',
    category: 'Antiplatelet / Salicylate',
    commonDoses: ['81 mg (chewable)', '325 mg'],
    routes: ['PO (Oral)'],
    frequencies: ['Daily'],
    maxDailyMg: 4000,
    contraindicatedConditions: ['Active GI bleeding', 'Severe thrombocytopenia', 'Aspirin-induced asthma / nasal polyps'],
    interactions: [
      { targetDrug: 'Warfarin', severity: 'High', reason: 'Dual anticoagulation/antiplatelet markedly escalates major gastrointestinal and intracranial hemorrhage risk.' },
      { targetDrug: 'Ibuprofen', severity: 'Moderate', reason: 'Ibuprofen competitively blocks Aspirin’s antiplatelet COX-1 cardioprotective binding site.' }
    ]
  },
  {
    name: 'Warfarin',
    generic: 'warfarin sodium',
    category: 'Anticoagulant (Vitamin K Antagonist)',
    commonDoses: ['2 mg', '2.5 mg', '5 mg', '7.5 mg', '10 mg'],
    routes: ['PO (Oral)'],
    frequencies: ['Daily in evening'],
    maxDailyMg: 15,
    blackBox: 'Major or fatal bleeding. Requires regular INR monitoring.',
    contraindicatedConditions: ['Active hemorrhage', 'Pregnancy (except mechanical valves)', 'Severe hepatic insufficiency'],
    interactions: [
      { targetDrug: 'Aspirin', severity: 'High', reason: 'Compounded bleeding risk. Requires explicit clinical indication and gastroprotection.' },
      { targetDrug: 'Ibuprofen', severity: 'High', reason: 'NSAIDs displace warfarin from albumin and inhibit platelet aggregation, doubling GI bleed risk.' },
      { targetDrug: 'Ciprofloxacin', severity: 'High', reason: 'Inhibits CYP1A2/CYP3A4, causing sudden INR surge and bleeding.' }
    ]
  },
  {
    name: 'Ibuprofen',
    generic: 'ibuprofen',
    category: 'Nonsteroidal Anti-inflammatory Drug (NSAID)',
    commonDoses: ['200 mg', '400 mg', '600 mg', '800 mg'],
    routes: ['PO (Oral)'],
    frequencies: ['Q6H PRN', 'TID PRN'],
    maxDailyMg: 3200,
    blackBox: 'Cardiovascular thrombotic events & Gastrointestinal bleeding/perforation.',
    contraindicatedConditions: ['Active peptic ulcer', 'CABG surgery perioperative period', 'Severe chronic kidney disease', 'Uncontrolled heart failure'],
    interactions: [
      { targetDrug: 'Lisinopril', severity: 'Moderate', reason: 'Blunts antihypertensive efficacy and reduces glomerular filtration rate.' },
      { targetDrug: 'Warfarin', severity: 'High', reason: 'High incidence of severe upper GI hemorrhage.' }
    ]
  },
  {
    name: 'Empagliflozin (Jardiance)',
    generic: 'empagliflozin',
    category: 'SGLT2 Inhibitor',
    commonDoses: ['10 mg', '25 mg'],
    routes: ['PO (Oral)'],
    frequencies: ['Daily in morning'],
    maxDailyMg: 25,
    contraindicatedConditions: ['Dialysis', 'End-stage kidney disease'],
    interactions: [
      { targetDrug: 'Insulin', severity: 'Moderate', reason: 'May potentiate hypoglycemia; consider dose reduction of insulin.' }
    ]
  },
  {
    name: 'Semaglutide (Ozempic)',
    generic: 'semaglutide',
    category: 'GLP-1 Receptor Agonist',
    commonDoses: ['0.25 mg SC weekly', '0.5 mg SC weekly', '1 mg SC weekly', '2 mg SC weekly'],
    routes: ['Subcutaneous'],
    frequencies: ['Weekly'],
    maxDailyMg: 2,
    blackBox: 'Thyroid C-cell tumor risk observed in rodent studies.',
    contraindicatedConditions: ['Personal or family history of medullary thyroid carcinoma (MTC)', 'Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)'],
    interactions: []
  },
  {
    name: 'Acetaminophen (Tylenol)',
    generic: 'acetaminophen',
    category: 'Analgesic / Antipyretic',
    commonDoses: ['325 mg', '500 mg', '650 mg', '1000 mg'],
    routes: ['PO (Oral)', 'IV'],
    frequencies: ['Q4-6H PRN'],
    maxDailyMg: 4000,
    blackBox: 'Hepatotoxicity associated with excessive dosages (> 4000 mg/day).',
    contraindicatedConditions: ['Severe active liver disease'],
    interactions: [
      { targetDrug: 'Warfarin', severity: 'Moderate', reason: 'Chronic acetaminophen (>2g/day for multiple days) may elevate INR.' }
    ]
  }
];

export const PROCEDURES_CATALOG = [
  { name: 'Coronary Angiography with Cardiac Catheterization', category: 'Interventional' as const, department: 'Cath Lab' as const, urgency: 'Urgent' as const, requiresContrast: true },
  { name: 'Percutaneous Coronary Intervention (PCI) with Drug-Eluting Stent', category: 'Interventional' as const, department: 'Cath Lab' as const, urgency: 'Urgent' as const, requiresContrast: true },
  { name: 'Upper Endoscopy (EGD) with Biopsy', category: 'Endoscopy' as const, department: 'Endoscopy Suite' as const, urgency: 'Elective' as const, requiresNpo: true },
  { name: 'Diagnostic Colonoscopy', category: 'Endoscopy' as const, department: 'Endoscopy Suite' as const, urgency: 'Elective' as const, requiresBowelPrep: true },
  { name: 'Total Knee Arthroplasty (TKA)', category: 'Surgical' as const, department: 'Operating Room' as const, urgency: 'Elective' as const },
  { name: 'Laparoscopic Cholecystectomy', category: 'Surgical' as const, department: 'Operating Room' as const, urgency: 'Elective' as const },
  { name: 'Lumbar Puncture (Spinal Tap)', category: 'Bedside' as const, department: 'Bedside' as const, urgency: 'Urgent' as const },
  { name: 'Bronchoscopy with Bronchoalveolar Lavage', category: 'Endoscopy' as const, department: 'Operating Room' as const, urgency: 'Urgent' as const },
  { name: 'Arteriovenous (AV) Fistula Creation for Hemodialysis', category: 'Surgical' as const, department: 'Operating Room' as const, urgency: 'Elective' as const }
];

export const THERAPIES_CATALOG = [
  { name: 'Physical Therapy (PT) — Gait Training & Lower Extremity Strengthening', discipline: 'Physical Therapy (PT)' as const, defaultFreq: '3x weekly for 6 weeks', goal: 'Restore ambulation distance and reduce fall risk.' },
  { name: 'Physical Therapy (PT) — Post-Op Joint Mobilization & Active ROM', discipline: 'Physical Therapy (PT)' as const, defaultFreq: '2x weekly for 8 weeks', goal: 'Regain 110 degrees flexion and full extension.' },
  { name: 'Occupational Therapy (OT) — Activities of Daily Living (ADL) Training', discipline: 'Occupational Therapy (OT)' as const, defaultFreq: '2x weekly for 4 weeks', goal: 'Independent dressing, bathing, and kitchen meal prep.' },
  { name: 'Respiratory Therapy (RT) — CPAP / BiPAP Titration & Education', discipline: 'Respiratory Therapy (RT)' as const, defaultFreq: 'Nightly with weekly telemetry review', goal: 'Obstructive sleep apnea control and AHI reduction.' },
  { name: 'Speech-Language Pathology (SLP) — Modified Barium Swallow & Dysphagia Therapy', discipline: 'Speech-Language (SLP)' as const, defaultFreq: 'Weekly evaluations', goal: 'Prevent pulmonary aspiration and advance diet safety.' },
  { name: 'Wound Care — Sharp Debridement & Negative Pressure Wound Therapy (Wound VAC)', discipline: 'Wound Care' as const, defaultFreq: 'Dressings changed 3x weekly', goal: 'Stimulate granulation tissue and close chronic ulceration.' },
  { name: 'Outpatient Infusion Therapy — IV Iron / Biologics / Antibiotic Course', discipline: 'Infusion/Dialysis' as const, defaultFreq: 'Bi-weekly infusions', goal: 'Normalize hemoglobin and resolve systemic bacteremia.' },
  { name: 'Cognitive Behavioral Therapy (CBT) for Chronic Pain & Disease Adaptation', discipline: 'Behavioral Health (CBT)' as const, defaultFreq: 'Weekly sessions for 10 weeks', goal: 'Develop adaptive coping strategies and reduce analgesic reliance.' }
];

export const TESTS_CATALOG = [
  { name: 'Comprehensive Metabolic Panel (CMP)', type: 'Laboratory' as const, department: 'Laboratory' as const, urgency: 'Routine' as const },
  { name: 'Complete Blood Count (CBC) with Differential', type: 'Laboratory' as const, department: 'Laboratory' as const, urgency: 'Routine' as const },
  { name: 'Hemoglobin A1c (Glycated Hb)', type: 'Laboratory' as const, department: 'Laboratory' as const, urgency: 'Routine' as const },
  { name: 'Lipid Panel (Total, LDL, HDL, Triglycerides)', type: 'Laboratory' as const, department: 'Laboratory' as const, urgency: 'Routine' as const },
  { name: 'High-Sensitivity Troponin I (Serial x3)', type: 'Laboratory' as const, department: 'Laboratory' as const, urgency: 'STAT' as const },
  { name: 'Chest X-Ray (PA & Lateral Views)', type: 'Imaging' as const, department: 'Radiology' as const, urgency: 'Routine' as const },
  { name: 'CT Angiography of Chest (PE Protocol)', type: 'Imaging' as const, department: 'Radiology' as const, urgency: 'STAT' as const, usesContrast: true },
  { name: 'MRI Brain without and with IV Contrast', type: 'Imaging' as const, department: 'Radiology' as const, urgency: 'Priority' as const, usesContrast: true },
  { name: 'Transthoracic 2D Echocardiogram with Doppler', type: 'Diagnostic / ECG' as const, department: 'Cardiology' as const, urgency: 'Routine' as const },
  { name: '12-Lead Electrocardiogram (ECG)', type: 'Diagnostic / ECG' as const, department: 'Cardiology' as const, urgency: 'STAT' as const },
  { name: 'Urinalysis with Microscopic Examination', type: 'Laboratory' as const, department: 'Laboratory' as const, urgency: 'Routine' as const }
];
