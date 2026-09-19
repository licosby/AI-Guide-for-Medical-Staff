import React, { useState } from 'react';
import { 
  Eye, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Clock, 
  Sliders, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  ChevronRight,
  TrendingUp,
  Info
} from 'lucide-react';
import { Patient } from '../types/clinical';

interface ExplainabilityViewerProps {
  patient: Patient;
  onSelectView: (view: string) => void;
}

export const ExplainabilityViewer: React.FC<ExplainabilityViewerProps> = ({ patient, onSelectView }) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'model' | 'evidence' | 'compliance' | 'audit'>('explanation');

  const triggeredFactors = [
    {
      id: 'f-htn',
      name: 'Uncontrolled Hypertension',
      impactPoints: 24,
      impactLevel: 'High',
      value: `${patient.vitals.bpSystolic}/${patient.vitals.bpDiastolic} mmHg`,
      source: 'Flowsheets',
      bulletReasons: [
        'Sustained diastolic elevation (98 mmHg) above guideline target (<80 mmHg).',
        'Accelerates hypertensive target-organ arteriolar thickening and LV strain.',
        'Synergistic risk multiplication when comorbid with Type 2 Diabetes and CAD.'
      ],
      ruleCitation: 'Rule: SBP > 130 mmHg or DBP > 80 mmHg (Stage 1/2 HTN criteria)',
      guidelineName: '2023 ACC/AHA Guideline for the Prevention, Detection, and Management of High Blood Pressure',
      potentialMitigation: 24,
      timelinePoints: [
        { date: 'Nov 2024', val: 132 },
        { date: 'Jan 2025', val: 128 },
        { date: 'Mar 2025', val: 134 },
        { date: 'May 2025', val: 128 }
      ],
      normalRangeLabel: 'Target < 130/80 mmHg'
    },
    {
      id: 'f-dm',
      name: 'Diabetes (Glycemic Control)',
      impactPoints: 18,
      impactLevel: 'High',
      value: 'HbA1c 7.2%',
      bulletReasons: [
        'Glycated hemoglobin above individual ADA personalized target (< 7.0%).',
        'Endothelial dysfunction promoting accelerated coronary atherogenesis.',
        'Heightened susceptibility to silent myocardial ischemia and microvascular renal damage.'
      ],
      ruleCitation: 'Rule: HbA1c >= 7.0% with documented Atherosclerotic CVD',
      guidelineName: 'ADA Standards of Care in Diabetes (2024)',
      potentialMitigation: 18,
      timelinePoints: [
        { date: 'Nov 2024', val: 7.4 },
        { date: 'Jan 2025', val: 7.1 },
        { date: 'Mar 2025', val: 7.3 },
        { date: 'May 2025', val: 7.2 }
      ],
      normalRangeLabel: 'Target < 7.0%'
    },
    {
      id: 'f-age',
      name: 'Chronological Age (70 years)',
      impactPoints: 14,
      impactLevel: 'Moderate',
      value: `DOB ${patient.dob} (70y)`,
      bulletReasons: [
        'Physiological arterial stiffening and diminished baroreceptor sensitivity.',
        'Progressive decline in baseline glomerular filtration and hepatic clearance.'
      ],
      ruleCitation: 'Rule: Age >= 65 years (Stratified cardiovascular actuarial tables)',
      guidelineName: 'Framingham Heart Study Actuarial Longevity Matrices',
      potentialMitigation: 0,
      timelinePoints: [
        { date: '2022', val: 68 },
        { date: '2023', val: 69 },
        { date: '2024', val: 70 },
        { date: '2025', val: 70 }
      ],
      normalRangeLabel: 'Non-modifiable baseline risk'
    },
    {
      id: 'f-ldl',
      name: 'LDL Cholesterol',
      impactPoints: 10,
      impactLevel: 'Moderate',
      value: '82 mg/dL',
      bulletReasons: [
        'Established native coronary artery disease dictates secondary prevention goal < 70 mg/dL.',
        'Atheroma lipid core progression if not suppressed with high-intensity statin therapy.'
      ],
      ruleCitation: 'Rule: Documented CAD with LDL > 70 mg/dL on non-maximal statin',
      guidelineName: '2018 AHA/ACC Multisociety Cholesterol Clinical Guidelines',
      potentialMitigation: 10,
      timelinePoints: [
        { date: 'Nov 2024', val: 94 },
        { date: 'Jan 2025', val: 88 },
        { date: 'Mar 2025', val: 84 },
        { date: 'May 2025', val: 82 }
      ],
      normalRangeLabel: 'CAD Target < 70 mg/dL'
    },
    {
      id: 'f-tob',
      name: 'Smoking / Vascular Status',
      impactPoints: 6,
      impactLevel: 'Low',
      value: 'Current Smoker',
      bulletReasons: [
        'Nicotine and particulate exposure induces endothelial oxidative stress.',
        'Increases platelet aggregability and arterial thrombotic risk.'
      ],
      ruleCitation: 'Rule: Active tobacco combustion exposure within previous 12 months',
      guidelineName: 'US Preventive Services Task Force (USPSTF) Behavioral Interventions',
      potentialMitigation: 6,
      timelinePoints: [
        { date: '2023', val: 1 },
        { date: '2024', val: 1 },
        { date: '2025', val: 1 }
      ],
      normalRangeLabel: 'Goal: Total Cessation'
    }
  ];

  const [selectedFactorId, setSelectedFactorId] = useState<string>(triggeredFactors[0].id);
  const currentFactor = triggeredFactors.find(f => f.id === selectedFactorId) || triggeredFactors[0];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6 text-xs">
      {/* Patient Banner */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-sm">
            {patient.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">{patient.name}</span>
              <span className="font-mono text-slate-500 font-semibold">MRN {patient.mrn}</span>
            </div>
            <div className="text-slate-500 flex items-center gap-3 text-[11px] mt-0.5">
              <span>DOB: <strong>{patient.dob} ({patient.age}y)</strong></span>
              <span>•</span>
              <span>Active Problems: <strong>{patient.activeProblems.length}</strong></span>
              <span>•</span>
              <span>Explainability Protocol: <strong className="text-teal-700">Audit Grade IV</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectView('treatment-analyzer')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
          >
            ← Back to Treatment Plan
          </button>
          <button
            onClick={() => onSelectView('safe-ai')}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            Open Safe-AI & Bias Suite
          </button>
        </div>
      </div>

      {/* Tabs Header matching explainability viewer.png */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 pt-3 rounded-t-xl">
        {[
          { id: 'explanation', label: 'Explanation' },
          { id: 'model', label: 'Model Details' },
          { id: 'evidence', label: 'Data & Evidence' },
          { id: 'compliance', label: 'Compliance & Ethics' },
          { id: 'audit', label: 'Audit History' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main 3-Column Layout matching explainability viewer.png */}
      {activeTab === 'explanation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Triggered Factors (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="font-bold text-slate-800 text-sm">Triggered Factors (5)</h2>
              <span className="text-[10px] text-slate-400">Select to inspect</span>
            </div>

            <div className="space-y-2">
              {triggeredFactors.map(factor => {
                const isSelected = factor.id === currentFactor.id;
                return (
                  <div
                    key={factor.id}
                    onClick={() => setSelectedFactorId(factor.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'bg-teal-50/70 border-teal-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-[11px]">{factor.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        factor.impactLevel === 'High' ? 'bg-red-100 text-red-700' :
                        factor.impactLevel === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        +{factor.impactPoints} pts
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{factor.value}</span>
                      <span className="text-slate-400 font-medium">{factor.source}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Column: Factor Explanation (6 cols) matching explainability viewer.png */}
          <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Factor Deep-Dive</span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">{currentFactor.name}</h2>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                currentFactor.impactLevel === 'High' ? 'bg-red-100 text-red-700' :
                currentFactor.impactLevel === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {currentFactor.impactLevel} Impact (+{currentFactor.impactPoints} points)
              </span>
            </div>

            {/* Why this factor increases risk */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-xs">This factor significantly increases risk due to:</h3>
              <ul className="space-y-1.5 text-slate-600 text-[11px] pl-2">
                {currentFactor.bulletReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0"></span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How this was calculated */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-800 text-xs">How this was calculated</h3>
              <div className="text-[11px] text-slate-600 space-y-1">
                <p><strong>Rule:</strong> {currentFactor.ruleCitation}</p>
                <p><strong>Weight:</strong> {currentFactor.impactPoints} points towards total composite score</p>
                <p><strong>Patient Value:</strong> <span className="font-bold text-slate-800">{currentFactor.value}</span> ({currentFactor.normalRangeLabel})</p>
              </div>

              {/* Range Visual Slider */}
              <div className="pt-2">
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold mb-1">
                  <span>Normal / Goal</span>
                  <span>Borderline</span>
                  <span className="text-red-600">Elevated / High Risk</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full relative overflow-hidden flex">
                  <div className="w-1/3 bg-emerald-400 h-full"></div>
                  <div className="w-1/3 bg-amber-400 h-full"></div>
                  <div className="w-1/3 bg-red-500 h-full"></div>
                </div>
                <div className="text-center text-[10px] font-bold text-red-600 mt-1">
                  ▲ Current Patient Reading: {currentFactor.value}
                </div>
              </div>
            </div>

            {/* Evidence Timeline Graph */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-xs">Evidence Timeline ({currentFactor.name})</h3>
              <div className="h-28 bg-slate-50 rounded-lg border border-slate-200 flex items-end justify-around p-3">
                {currentFactor.timelinePoints.map((pt, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className="font-bold text-[10px] text-slate-700">{pt.val}</span>
                    <div className="w-8 bg-teal-500 rounded-t" style={{ height: `${(pt.val / 150) * 60}px` }}></div>
                    <span className="text-[9px] text-slate-400">{pt.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Guidance Citation */}
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-700 block flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>Clinical Guidance Source:</span>
              </span>
              <p className="italic text-slate-500">{currentFactor.guidelineName}</p>
            </div>

            {/* What this means callout box */}
            {currentFactor.potentialMitigation > 0 && (
              <div className="p-3.5 bg-teal-50 rounded-lg border border-teal-200 text-teal-900 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                <div>
                  <span className="font-bold block">What this means for the patient</span>
                  <span>Managing this factor according to clinical guidelines could lower the composite risk score by up to <strong className="font-extrabold">{currentFactor.potentialMitigation} points</strong>.</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Reasoning Timeline & Confidence (3 cols) matching explainability viewer.png */}
          <div className="lg:col-span-3 space-y-6">
            {/* Reasoning Timeline */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Reasoning Timeline</span>
                </h2>
                <span className="text-[10px] text-slate-400">Step-by-step</span>
              </div>

              <div className="space-y-3 pl-2 relative border-l-2 border-slate-200">
                <div className="relative pl-3">
                  <span className="w-2 h-2 rounded-full bg-teal-600 absolute -left-[17px] top-1.5"></span>
                  <span className="text-[10px] text-slate-400 font-mono block">10:15:02 AM</span>
                  <p className="font-bold text-slate-800 text-[11px]">Risk Calculation Requested</p>
                  <p className="text-[10px] text-slate-500">Initiated by Dr. Gregory House</p>
                </div>

                <div className="relative pl-3">
                  <span className="w-2 h-2 rounded-full bg-teal-600 absolute -left-[17px] top-1.5"></span>
                  <span className="text-[10px] text-slate-400 font-mono block">10:15:03 AM</span>
                  <p className="font-bold text-slate-800 text-[11px]">Patient Data Retrieved</p>
                  <p className="text-[10px] text-slate-500">28 clinical data points loaded</p>
                </div>

                <div className="relative pl-3">
                  <span className="w-2 h-2 rounded-full bg-teal-600 absolute -left-[17px] top-1.5"></span>
                  <span className="text-[10px] text-slate-400 font-mono block">10:15:03 AM</span>
                  <p className="font-bold text-slate-800 text-[11px]">Model Executed</p>
                  <p className="text-[10px] text-slate-500">Cardio-Diabetes Composite v2.1</p>
                </div>

                <div className="relative pl-3">
                  <span className="w-2 h-2 rounded-full bg-teal-600 absolute -left-[17px] top-1.5"></span>
                  <span className="text-[10px] text-slate-400 font-mono block">10:15:04 AM</span>
                  <p className="font-bold text-slate-800 text-[11px]">Factors Evaluated</p>
                  <p className="text-[10px] text-slate-500">85 rules matched across EHR</p>
                </div>

                <div className="relative pl-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -left-[17px] top-1.5"></span>
                  <span className="text-[10px] text-slate-400 font-mono block">10:15:04 AM</span>
                  <p className="font-bold text-slate-800 text-[11px]">Risk Score Computed</p>
                  <p className="text-[10px] text-slate-500">72/100 (High Risk)</p>
                </div>

                <div className="relative pl-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -left-[17px] top-1.5"></span>
                  <span className="text-[10px] text-slate-400 font-mono block">10:15:05 AM</span>
                  <p className="font-bold text-slate-800 text-[11px]">Results Displayed</p>
                  <p className="text-[10px] text-slate-500">Explainability report rendered</p>
                </div>
              </div>
            </div>

            {/* Model Confidence Card */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center space-y-3">
              <span className="font-bold text-slate-700 text-xs block">Model Confidence & Rigor</span>
              <div className="w-20 h-20 rounded-full border-4 border-teal-500 mx-auto flex items-center justify-center font-extrabold text-teal-700 text-lg">
                78%
              </div>
              <div className="space-y-1 text-slate-600 text-[11px] text-left">
                <div className="flex justify-between">
                  <span>Factors Considered:</span>
                  <strong className="text-slate-800">5 / 12</strong>
                </div>
                <div className="flex justify-between">
                  <span>Data Completeness:</span>
                  <strong className="text-emerald-700">92% (High)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Validation Cohort:</span>
                  <strong className="text-slate-800">42,000 pts</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Tabs: Model Details, Data & Evidence, Compliance */}
      {activeTab === 'model' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800">Model Architecture & Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg space-y-2">
              <h3 className="font-bold text-slate-800">Model Name: Cardio-Diabetes Composite v2.1</h3>
              <p className="text-slate-600 leading-relaxed">
                Trained on multisite EHR databases and aligned with clinical guidelines from the American College of Cardiology (ACC), American Heart Association (AHA), and American Diabetes Association (ADA).
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg space-y-2">
              <h3 className="font-bold text-slate-800">Explainability Standard: TreeSHAP + Rule Tracing</h3>
              <p className="text-slate-600 leading-relaxed">
                Every factor contribution is mathematically decomposed using Shapley additive exPlanations (SHAP) mapped directly to deterministic rule thresholds to prevent black-box opacity.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800">Joint Commission & HIPAA Compliance Framework</h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
              <h3 className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>NPSG.03.06.01 Medication Safety Standard</span>
              </h3>
              <p className="text-[11px] mt-1">Real-time alert verification matches Joint Commission standards for continuous medication reconciliation across transitions of care.</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-900">
              <h3 className="font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600" />
                <span>NIST AI Risk Management Framework 1.0 Aligned</span>
              </h3>
              <p className="text-[11px] mt-1">Validates transparency, safety, fairness, and human clinician autonomy before order transmission.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800">Clinical Decision Audit Trail</h2>
          <p className="text-xs text-slate-500">Every analysis and recommendation is logged with non-repudiation timestamps for clinical governance.</p>
          <div className="p-4 bg-slate-50 rounded-lg font-mono text-[11px] text-slate-700 space-y-1">
            <p>[2025-05-08 10:15:02] USER_ID: G_HOUSE_MD | ACTION: EVAL_TREATMENT_PLAN | PATIENT_MRN: 1000213</p>
            <p>[2025-05-08 10:15:03] ENGINE: CLINICAL_RULES_V2 | DDI_COUNT: 1 | ALLERGY_CROSS: 0 | OD_VIOLATIONS: 0</p>
            <p>[2025-05-08 10:15:04] RISK_COMPOSITE: 72 | CATEGORY: HIGH_RISK | CONFIDENCE: 78%</p>
            <p>[2025-05-08 10:15:05] STATUS: EXPLAINABILITY_RENDERED | SIGNATURE: VALID_SHA256</p>
          </div>
        </div>
      )}
    </div>
  );
};
