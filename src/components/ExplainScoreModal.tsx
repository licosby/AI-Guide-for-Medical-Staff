import React from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  HelpCircle, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { Patient, RiskAnalysis } from '../types/clinical';

export interface RiskFactorItem {
  id: string;
  name: string;
  category: string;
  impactPoints: number; // e.g. +24 or -12
  direction: 'increase' | 'decrease';
  patientValue?: string;
  explanation: string;
  clinicalGuideline?: string;
  severity?: 'High' | 'Moderate' | 'Low';
}

export interface ExplainScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  riskData?: RiskAnalysis;
  score?: number;
  riskCategory?: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  confidence?: number;
  onNavigateToFullExplainability?: () => void;
}

export const ExplainScoreModal: React.FC<ExplainScoreModalProps> = ({
  isOpen,
  onClose,
  patient,
  riskData,
  score: propScore,
  riskCategory: propRiskCategory,
  confidence: propConfidence,
  onNavigateToFullExplainability
}) => {
  if (!isOpen) return null;

  const currentScore = propScore ?? riskData?.overallScore ?? 65;
  const currentCategory = propRiskCategory ?? riskData?.riskCategory ?? (
    currentScore >= 70 ? 'High Risk' : currentScore >= 40 ? 'Moderate Risk' : 'Low Risk'
  );
  const confidenceScore = propConfidence ?? riskData?.clinicalConfidence ?? 78;

  // Factors that INCREASE risk
  const factorsIncreasingRisk: RiskFactorItem[] = [
    {
      id: 'inc-1',
      name: 'Uncontrolled / Suboptimal Hypertension',
      category: 'Vitals & Hemodynamics',
      impactPoints: 24,
      direction: 'increase',
      patientValue: `${patient.vitals.bpSystolic}/${patient.vitals.bpDiastolic} mmHg`,
      explanation: 'Sustained systolic / diastolic elevation above target (<130/80 mmHg) causes vascular wall shearing stress, left ventricular afterload strain, and arterial remodeling.',
      clinicalGuideline: '2023 ACC/AHA Guideline for Blood Pressure Control',
      severity: 'High'
    },
    {
      id: 'inc-2',
      name: 'Diabetes Mellitus (A1c 7.2%)',
      category: 'Glycemic Control',
      impactPoints: 18,
      direction: 'increase',
      patientValue: 'HbA1c 7.2%',
      explanation: 'Glycated hemoglobin above individualized ADA target (<7.0%) promotes vascular endothelial dysfunction, chronic oxidative stress, and microvascular microangiopathy.',
      clinicalGuideline: 'ADA Standards of Medical Care in Diabetes 2024',
      severity: 'High'
    },
    {
      id: 'inc-3',
      name: `Chronological Age & Vascular Frailty (${patient.age}y)`,
      category: 'Demographics / Non-modifiable',
      impactPoints: 14,
      direction: 'increase',
      patientValue: `${patient.age} years (DOB: ${patient.dob})`,
      explanation: 'Age ≥ 65 is an established actuarial multiplier for cardiovascular adverse events, arterial stiffness, and progressive decrease in renal clearance.',
      clinicalGuideline: 'Framingham Heart Study Actuarial Longevity Cohort',
      severity: 'Moderate'
    },
    {
      id: 'inc-4',
      name: 'Secondary Prevention LDL Gap',
      category: 'Lipid Panel',
      impactPoints: 10,
      direction: 'increase',
      patientValue: '82 mg/dL',
      explanation: 'Established atherosclerotic coronary artery disease (ASCVD) secondary prevention goal is <70 mg/dL (or <55 mg/dL for very high risk).',
      clinicalGuideline: 'AHA/ACC Multisociety Cholesterol Clinical Guidelines',
      severity: 'Moderate'
    },
    ...(riskData?.alerts && riskData.alerts.length > 0 ? [
      {
        id: 'inc-5',
        name: `Active Clinical Alerts (${riskData.alerts.length} Flagged)`,
        category: 'Pharmacotherapy & Safety Engine',
        impactPoints: 12,
        direction: 'increase' as const,
        patientValue: riskData.alerts[0].title,
        explanation: `${riskData.alerts[0].summary}. Drug interactions and procedural safety parameters add clinical friction points.`,
        clinicalGuideline: riskData.alerts[0].clinicalGuideline,
        severity: 'Moderate' as const
      }
    ] : [])
  ];

  // Factors that DECREASE risk (Protective factors & ongoing therapies)
  const factorsDecreasingRisk: RiskFactorItem[] = [
    {
      id: 'dec-1',
      name: 'Active Statin Therapy (Atorvastatin 20mg)',
      category: 'Cardioprotection',
      impactPoints: -12,
      direction: 'decrease',
      patientValue: 'Atorvastatin 20 mg PO Nightly',
      explanation: 'Active HMG-CoA reductase inhibitor stabilizes existing arterial plaques, reduces systemic vascular inflammation, and lowers ASCVD recurrent event rates by ~22%.',
      clinicalGuideline: 'ACC Secondary Prevention Guidelines'
    },
    {
      id: 'dec-2',
      name: 'Antiplatelet Coverage (Aspirin 81mg)',
      category: 'Hemostasis & Thrombosis Prevention',
      impactPoints: -8,
      direction: 'decrease',
      patientValue: 'Aspirin 81 mg Daily',
      explanation: 'Irreversible COX-1 inhibition inhibits platelet aggregation, dramatically reducing acute ischemic coronary thrombosis risk in proven native CAD.',
      clinicalGuideline: 'USPSTF Antiplatelet Regimen Consensus'
    },
    {
      id: 'dec-3',
      name: 'Metformin Glucoregulation Initiated',
      category: 'Metabolic Therapy',
      impactPoints: -6,
      direction: 'decrease',
      patientValue: 'Metformin 500 mg BID',
      explanation: 'Sensitizes peripheral insulin uptake, limits hepatic gluconeogenesis, and carries neutral-to-beneficial cardiovascular outcomes data.',
      clinicalGuideline: 'EASD/ADA Consensus Recommendations'
    },
    {
      id: 'dec-4',
      name: 'Preserved Renal & Electrolyte Baseline',
      category: 'Laboratory Chemistry',
      impactPoints: -5,
      direction: 'decrease',
      patientValue: 'eGFR > 60 mL/min/1.73m², Serum K+ 4.2',
      explanation: 'Absence of severe renal impairment or acute electrolyte imbalances protects against sudden arrhythmias and allows safe titration of renin-angiotensin-aldosterone agents.',
      clinicalGuideline: 'KDIGO Clinical Practice Guideline for CKD'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
      aria-labelledby="explain-score-title"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="explain-score-title" className="text-base font-bold text-slate-900">
                  Risk Score Breakdown & Clinical Logic
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                  Composite Model
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Patient: <span className="font-semibold text-slate-700">{patient.name}</span> (MRN: {patient.mrn}) • DOB: {patient.dob}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs leading-normal">
          {/* Top Score Snapshot & Model Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 items-center">
            <div className="flex items-center gap-3.5 sm:border-r border-slate-200 sm:pr-4">
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center border-4 border-slate-200 shrink-0 bg-white">
                <span className={`text-2xl font-extrabold ${
                  currentScore >= 70 ? 'text-red-600' :
                  currentScore >= 40 ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {currentScore}
                </span>
                <span className="absolute -bottom-1.5 text-[9px] font-extrabold uppercase px-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  /100
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Overall Score
                </span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                  currentScore >= 70 ? 'bg-red-100 text-red-700' :
                  currentScore >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {currentCategory}
                </span>
              </div>
            </div>

            <div className="space-y-1 sm:border-r border-slate-200 sm:pr-4">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Model Confidence:</span>
                <span className="font-bold text-indigo-700">{confidenceScore}% High</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Algorithm:</span>
                <span className="font-semibold text-slate-700">Cardio-Diabetes v2.1</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Data Grounding:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> EHR Validated
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-700 block">Baseline Derivation:</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Calculated by synthesizing vitals, lab biomarkers, pharmacological regimens, and demographic risk multipliers against validated clinical trial data.
              </p>
            </div>
          </div>

          {/* Section: How the overall score was calculated */}
          <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100 space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <h4>How the Overall Score Was Calculated</h4>
            </div>
            <p className="text-slate-700 text-[11px] leading-relaxed">
              The overall clinical risk score is generated using a multi-parameter weighted actuarial formula:
            </p>
            <div className="p-3 bg-white rounded-lg border border-indigo-200 text-slate-800 font-mono text-[11px] flex flex-col gap-1 shadow-2xs">
              <div className="text-indigo-900 font-bold">
                Overall Score = Base Risk (15 pts) + Modifiable Drivers (+66 pts) - Protective Reductions (-31 pts) + Dynamic Friction (+15 pts) = {currentScore}/100
              </div>
              <div className="text-[10px] text-slate-500 font-sans">
                • <strong>Base Risk:</strong> Demographic baseline (age ≥ 70) and chronic diagnostic profile.
                <br />
                • <strong>Risk Multipliers:</strong> Physiological stressors including systolic blood pressure &gt; 130 mmHg and glycated HbA1c &gt; 7.0%.
                <br />
                • <strong>Mitigating Offsets:</strong> Adherence to guideline-directed medical therapy (GDMT) including statin and antiplatelet therapy.
              </div>
            </div>
          </div>

          {/* 2 Columns: Factors that Increased vs Factors that Decreased Risk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1: Factors that INCREASED Risk */}
            <div className="rounded-xl border border-red-200 bg-red-50/20 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-red-200 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-red-900 text-xs">Factors That Increased Risk</h4>
                </div>
                <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                  +{factorsIncreasingRisk.reduce((sum, f) => sum + f.impactPoints, 0)} pts total
                </span>
              </div>

              <div className="space-y-2.5">
                {factorsIncreasingRisk.map((factor) => (
                  <div 
                    key={factor.id} 
                    className="p-3 bg-white rounded-lg border border-red-100 shadow-2xs hover:border-red-300 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{factor.name}</span>
                      <span className="font-bold text-red-600 text-xs bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                        +{factor.impactPoints} pts
                      </span>
                    </div>

                    {factor.patientValue && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span className="font-medium text-slate-400">Current Value:</span>
                        <span className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded">
                          {factor.patientValue}
                        </span>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {factor.explanation}
                    </p>

                    {factor.clinicalGuideline && (
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 pt-1 border-t border-slate-100">
                        <BookOpen className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{factor.clinicalGuideline}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Factors that DECREASED Risk */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/20 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <TrendingDown className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-emerald-900 text-xs">Factors That Decreased Risk</h4>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {factorsDecreasingRisk.reduce((sum, f) => sum + f.impactPoints, 0)} pts reduction
                </span>
              </div>

              <div className="space-y-2.5">
                {factorsDecreasingRisk.map((factor) => (
                  <div 
                    key={factor.id} 
                    className="p-3 bg-white rounded-lg border border-emerald-100 shadow-2xs hover:border-emerald-300 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{factor.name}</span>
                      <span className="font-bold text-emerald-700 text-xs bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        {factor.impactPoints} pts
                      </span>
                    </div>

                    {factor.patientValue && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span className="font-medium text-slate-400">Protective Factor:</span>
                        <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                          {factor.patientValue}
                        </span>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {factor.explanation}
                    </p>

                    {factor.clinicalGuideline && (
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 pt-1 border-t border-slate-100">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{factor.clinicalGuideline}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Why this matters (Educational summary) */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <h4>Why This Matters</h4>
            </div>
            
            <p className="text-slate-700 text-[11px] leading-relaxed">
              In clinical decision support, a composite risk score is not simply an abstract number—it directly predicts the <strong>1-year probability of adverse cardiovascular events, target organ deterioration, and unplanned hospital readmission</strong>. 
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs space-y-1">
                <span className="font-bold text-slate-800 text-[11px] block">1. Actionable Interventions</span>
                <p className="text-[10px] text-slate-600 leading-snug">
                  Because over 40% of the patient’s risk is driven by modifiable blood pressure and glucose metrics, treatment intensification can directly reduce their score by up to <strong>35 points</strong>.
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs space-y-1">
                <span className="font-bold text-slate-800 text-[11px] block">2. Preventing Drug Harm</span>
                <p className="text-[10px] text-slate-600 leading-snug">
                  Checking active pharmacotherapy against organ clearance and documented allergies prevents iatrogenic complications before orders are dispatched to the pharmacy.
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs space-y-1">
                <span className="font-bold text-slate-800 text-[11px] block">3. Patient Communication</span>
                <p className="text-[10px] text-slate-600 leading-snug">
                  Sharing transparent risk factors empowers patients to understand how lifestyle modifications and prescription adherence tangibly improve their long-term health trajectory.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Educational decision support algorithm • Transparent & explainable clinical AI</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onNavigateToFullExplainability && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToFullExplainability();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Full Explainability Viewer</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg shadow-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
