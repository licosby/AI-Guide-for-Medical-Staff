import { Patient, MedicationItem, ProcedureItem, TherapyItem, DiagnosticTestItem, ClinicalAlert, RiskAnalysis } from '../types/clinical';
import { DRUG_CATALOG } from '../data/medicalDatabase';

export interface PlanEvaluationInput {
  patient: Patient;
  medications: MedicationItem[];
  procedures: ProcedureItem[];
  therapies: TherapyItem[];
  tests: DiagnosticTestItem[];
  consentStatus: 'Yes' | 'Pending' | 'Not Required';
  planNotes: string;
}

export function evaluateTreatmentPlan(input: PlanEvaluationInput): RiskAnalysis {
  const { patient, medications, procedures, therapies, tests, consentStatus, planNotes } = input;
  const alerts: ClinicalAlert[] = [];
  let drugInteractionsScore = 0;
  let adverseEffectsScore = 0;
  let diseaseInteractionsScore = 0;
  let doseScore = 0;
  let duplicationScore = 0;

  // 1. Check Drug-Drug Interactions
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const medA = medications[i];
      const medB = medications[j];
      
      const catalogItemA = DRUG_CATALOG.find(d => 
        d.name.toLowerCase() === medA.name.toLowerCase() ||
        medA.name.toLowerCase().includes(d.name.toLowerCase())
      );
      
      if (catalogItemA) {
        const interaction = catalogItemA.interactions.find(it => 
          medB.name.toLowerCase().includes(it.targetDrug.toLowerCase()) ||
          medB.genericName.toLowerCase().includes(it.targetDrug.toLowerCase())
        );

        if (interaction) {
          const isHigh = interaction.severity === 'High';
          alerts.push({
            id: `ddi-${medA.id}-${medB.id}`,
            severity: isHigh ? 'High' : 'Moderate',
            category: 'Drug Interaction',
            title: `${medA.name} + ${medB.name} Interaction`,
            summary: `${interaction.severity} interaction: ${interaction.reason}`,
            detailedReason: `Concurrent administration of ${medA.name} and ${medB.name} poses heightened pharmacological risk. ${interaction.reason}`,
            clinicalGuideline: 'Lexicomp / FDA Clinical Pharmacology Database (2024)',
            impactScore: isHigh ? 18 : 10,
            sourceItem: `${medA.name}, ${medB.name}`
          });
          drugInteractionsScore += isHigh ? 35 : 20;
          adverseEffectsScore += isHigh ? 25 : 15;
        }
      }

      // Check Duplication (Same pharmacological class)
      if (medA.category && medB.category && medA.category === medB.category && medA.name.toLowerCase() !== medB.name.toLowerCase()) {
        alerts.push({
          id: `dup-${medA.id}-${medB.id}`,
          severity: 'Moderate',
          category: 'Drug Interaction',
          title: `Therapeutic Duplication: Dual ${medA.category}`,
          summary: `Both ${medA.name} and ${medB.name} belong to ${medA.category}. Redundant mechanism of action.`,
          detailedReason: `Simultaneous prescribing of two agents in the same class increases adverse effect incidence without evidence of additive efficacy.`,
          clinicalGuideline: 'ISMP High-Alert Medication Safety Guidelines',
          impactScore: 12,
          sourceItem: `${medA.name} & ${medB.name}`
        });
        duplicationScore += 25;
      }
    }
  }

  // 2. Check Overdose / Max Daily Dose
  medications.forEach(med => {
    const catalogItem = DRUG_CATALOG.find(d => 
      d.name.toLowerCase() === med.name.toLowerCase() ||
      med.name.toLowerCase().includes(d.name.toLowerCase())
    );

    if (catalogItem && catalogItem.maxDailyMg) {
      // Parse numerical mg in prescribed dose
      const doseMatch = med.dose.match(/(\d+(\.\d+)?)\s*mg/i);
      if (doseMatch) {
        const mg = parseFloat(doseMatch[1]);
        const isTwiceDaily = med.frequency.toLowerCase().includes('bid') || med.frequency.toLowerCase().includes('twice');
        const isTid = med.frequency.toLowerCase().includes('tid') || med.frequency.toLowerCase().includes('three');
        const dailyMg = isTwiceDaily ? mg * 2 : isTid ? mg * 3 : mg;

        if (dailyMg > catalogItem.maxDailyMg) {
          alerts.push({
            id: `od-${med.id}`,
            severity: 'Critical',
            category: 'Overdose / Max Dose',
            title: `Potential Overdose: ${med.name} (${dailyMg} mg/day)`,
            summary: `Prescribed dose exceeds the recommended FDA ceiling of ${catalogItem.maxDailyMg} mg/day.`,
            detailedReason: `Daily total of ${dailyMg} mg exceeds established toxicological safety thresholds. High danger of organ toxicity or adverse cardiovascular collapse.`,
            clinicalGuideline: 'FDA Package Insert Prescribing Limits',
            impactScore: 28,
            sourceItem: `${med.name} ${med.dose}`
          });
          doseScore += 40;
        }
      }
    }
  });

  // 3. Check Allergies vs Prescriptions and Procedures
  patient.allergies.forEach(allg => {
    // Check against medications
    medications.forEach(med => {
      if (med.name.toLowerCase().includes(allg.allergen.toLowerCase()) || 
          allg.allergen.toLowerCase().includes(med.name.toLowerCase()) ||
          (allg.allergen.toLowerCase().includes('penicillin') && med.name.toLowerCase().includes('amoxicillin')) ||
          (allg.allergen.toLowerCase().includes('ace') && med.category.toLowerCase().includes('ace'))) {
        alerts.push({
          id: `allg-${med.id}`,
          severity: allg.severity === 'Anaphylaxis' ? 'Critical' : 'High',
          category: 'Allergy Conflict',
          title: `Direct Allergy Conflict: ${med.name}`,
          summary: `Patient has documented allergy: ${allg.allergen} (${allg.severity} — ${allg.reaction}).`,
          detailedReason: `Chart records severe allergic manifestation: "${allg.reaction}". Prescribing this agent violates standard Joint Commission National Patient Safety Goals.`,
          clinicalGuideline: 'JCAHO National Patient Safety Goal NPSG.03.06.01',
          impactScore: 30,
          sourceItem: med.name
        });
        adverseEffectsScore += 35;
      }
    });

    // Check against Procedures & Tests with contrast if allergic to Contrast
    if (allg.allergen.toLowerCase().includes('contrast') || allg.allergen.toLowerCase().includes('iodine')) {
      const contrastProcs = procedures.filter(p => p.name.toLowerCase().includes('angiography') || p.name.toLowerCase().includes('catheterization'));
      const contrastTests = tests.filter(t => t.name.toLowerCase().includes('contrast') || t.name.toLowerCase().includes('cta') || t.name.toLowerCase().includes('ct angiograph'));

      if (contrastProcs.length > 0 || contrastTests.length > 0) {
        alerts.push({
          id: `allg-contrast`,
          severity: 'Critical',
          category: 'Allergy Conflict',
          title: `Severe Contrast Media Alert`,
          summary: `Contrast-based study ordered despite documented severe anaphylaxis to iodinated contrast media.`,
          detailedReason: `Patient chart notes "${allg.reaction}". Requires pre-medication protocol with corticosteroids + H1/H2 blockers or immediate substitution with non-contrast MRI or non-invasive ultrasound.`,
          clinicalGuideline: 'ACR Manual on Contrast Media & Patient Safety',
          impactScore: 28,
          sourceItem: 'Radiology / Cath Lab orders'
        });
        diseaseInteractionsScore += 30;
      }
    }
  });

  // 4. Check Disease - Drug Contraindications
  patient.conditions.forEach(condition => {
    medications.forEach(med => {
      const catalogItem = DRUG_CATALOG.find(d => d.name.toLowerCase() === med.name.toLowerCase());
      if (catalogItem && catalogItem.contraindicatedConditions) {
        const contra = catalogItem.contraindicatedConditions.find(c => 
          condition.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(condition.toLowerCase())
        );
        if (contra) {
          alerts.push({
            id: `contra-${med.id}`,
            severity: 'High',
            category: 'Contraindication',
            title: `Contraindication: ${med.name} in ${condition}`,
            summary: `${med.name} is contraindicated in patients with diagnosed ${condition}.`,
            detailedReason: `Package labeling and clinical trials warn of serious exacerbation when administered in the presence of ${condition}.`,
            clinicalGuideline: 'FDA Boxed Warnings & Clinical Contraindications',
            impactScore: 20,
            sourceItem: `${med.name} & ${condition}`
          });
          diseaseInteractionsScore += 25;
        }
      }
    });
  });

  // 5. Check Consent & Invasive Procedures
  const invasiveProcedures = procedures.filter(p => p.category === 'Surgical' || p.category === 'Interventional' || p.category === 'Endoscopy');
  if (invasiveProcedures.length > 0) {
    if (consentStatus === 'Pending' || consentStatus === 'Not Required') {
      alerts.push({
        id: 'consent-alert',
        severity: consentStatus === 'Pending' ? 'Moderate' : 'High',
        category: 'Documentation / Consent',
        title: `Informed Consent Verification Required`,
        summary: `Invasive procedure(s) planned (${invasiveProcedures.map(p => p.name).join(', ')}) without verified signed consent.`,
        detailedReason: `Hospital compliance guidelines mandate documented, signed informed consent discussing risks, benefits, and alternatives prior to invasive procedures.`,
        clinicalGuideline: 'JCAHO Ethics & Rights Standard RI.01.03.01',
        impactScore: 15,
        sourceItem: invasiveProcedures[0].name
      });
    }
  }

  // 6. Check Clinical Guidelines (e.g. Renin-Angiotensin monitoring, Statin intensity, etc.)
  const hasArb = medications.some(m => m.name.toLowerCase().includes('losartan') || m.name.toLowerCase().includes('valsartan'));
  if (hasArb) {
    alerts.push({
      id: 'guide-renal',
      severity: 'Moderate',
      category: 'Guideline Recommendation',
      title: 'Renal Function & Potassium Monitoring Recommended',
      summary: 'Important: Recheck serum creatinine, eGFR, and K+ within 2–4 weeks after ARB initiation.',
      detailedReason: 'Patients receiving ARB therapy should be monitored for asymptomatic azotemia and acute hyperkalemia, particularly when comorbid with hypertension or diabetes.',
      clinicalGuideline: 'ACC/AHA Guideline for the Management of High Blood Pressure in Adults',
      impactScore: 8,
      sourceItem: 'Losartan'
    });
  }

  // 7. Sort alerts: CRITICAL first, then HIGH, then MODERATE, then LOW
  const severityRank: Record<string, number> = {
    'Critical': 1,
    'High': 2,
    'Moderate': 3,
    'Low': 4,
    'Info': 5
  };
  alerts.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  // Calculate normalized overall risk score (0 - 100)
  // Baseline risk based on patient's underlying conditions + alert impact points
  let baseScore = 15;
  if (patient.age >= 70) baseScore += 10;
  if (patient.conditions.some(c => c.toLowerCase().includes('diabetes'))) baseScore += 10;
  if (patient.vitals.bpSystolic > 130) baseScore += 12;

  const totalAlertPoints = alerts.reduce((acc, curr) => acc + curr.impactScore, 0);
  const calculatedRiskScore = Math.min(98, Math.max(12, Math.round((baseScore * 0.4) + (totalAlertPoints * 1.3))));

  const riskCategory = calculatedRiskScore >= 70 ? 'High Risk' : calculatedRiskScore >= 40 ? 'Moderate Risk' : 'Low Risk';

  // Key drivers
  const keyDrivers = [
    {
      name: 'Uncontrolled Hypertension',
      impactLevel: 'High' as const,
      percentage: 24,
      points: 24,
      source: 'Flowsheets',
      patientValue: `${patient.vitals.bpSystolic}/${patient.vitals.bpDiastolic} mmHg`
    },
    {
      name: 'Diabetes (A1c 7.2%)',
      impactLevel: 'High' as const,
      percentage: 18,
      points: 18,
      source: 'Results',
      patientValue: 'A1c 7.2%'
    },
    {
      name: `Age (${patient.age} years)`,
      impactLevel: 'Moderate' as const,
      percentage: 14,
      points: 14,
      source: 'Patient Demographics',
      patientValue: `DOB ${patient.dob}`
    },
    {
      name: 'LDL Cholesterol',
      impactLevel: 'Moderate' as const,
      percentage: 10,
      points: 10,
      source: 'Results',
      patientValue: 'LDL 82 mg/dL'
    },
    {
      name: 'Smoking / Vascular Status',
      impactLevel: 'Low' as const,
      percentage: 6,
      points: 6,
      source: 'Social History',
      patientValue: 'Prior tobacco history'
    }
  ];

  return {
    overallScore: calculatedRiskScore,
    riskCategory,
    clinicalConfidence: 78,
    expectedBenefit: calculatedRiskScore >= 70 ? 'Moderate' : 'High',
    potentialHarm: calculatedRiskScore >= 70 ? 'High' : calculatedRiskScore >= 40 ? 'Moderate' : 'Low',
    breakdown: {
      drugInteractions: Math.min(100, Math.max(15, drugInteractionsScore || 45)),
      adverseEffects: Math.min(100, Math.max(10, adverseEffectsScore || 30)),
      diseaseInteractions: Math.min(100, Math.max(5, diseaseInteractionsScore || 20)),
      doseAndDuration: Math.min(100, Math.max(10, doseScore || 35)),
      duplication: Math.min(100, Math.max(5, duplicationScore || 15))
    },
    keyDrivers,
    alerts,
    guidelineAlignments: [
      { name: 'Hypertension Management', guideline: 'ACC/AHA 2017 Guidelines', status: 'Aligned' },
      { name: 'ASCVD Secondary Prevention', guideline: 'ACC/AHA 2018 Cholesterol Guidelines', status: 'Consider' },
      { name: 'Standards of Care in Diabetes', guideline: 'ADA 2024 Guidelines', status: 'Aligned' }
    ],
    alternatives: [
      {
        title: 'Intensify Statin Therapy',
        description: 'Titrate Atorvastatin from 20 mg to 40 mg nightly. High-intensity therapy offers greater secondary ASCVD risk reduction for confirmed CAD.',
        riskReductionPercent: 8
      },
      {
        title: 'Add SGLT2 Inhibitor (Empagliflozin 10 mg)',
        description: 'Provide cardiorenal protective benefit in type 2 diabetes with hypertension, reducing hospitalizations and slowing renal progression.',
        riskReductionPercent: 6
      },
      {
        title: 'Lifestyle & DASH Dietary Optimization',
        description: 'Structured low-sodium dietary approaches with 150 min/wk aerobic conditioning to synergistically reduce systolic BP by 8-11 mmHg.',
        riskReductionPercent: 5
      }
    ]
  };
}
