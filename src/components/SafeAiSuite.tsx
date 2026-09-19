import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  MessageSquare, 
  Accessibility, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  RefreshCw,
  ArrowRight,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { Patient } from '../types/clinical';

interface SafeAiSuiteProps {
  patient: Patient;
  onSelectView: (view: string) => void;
}

export const SafeAiSuite: React.FC<SafeAiSuiteProps> = ({ patient, onSelectView }) => {
  // Decision tree interactive step
  const [treeStep, setTreeStep] = useState<number>(1);
  const [q1CriticallyUnstable, setQ1CriticallyUnstable] = useState<boolean | null>(null);
  const [q2DataComplete, setQ2DataComplete] = useState<boolean | null>(null);
  const [q3SevereContradiction, setQ3SevereContradiction] = useState<boolean | null>(null);

  // Bias scanner state
  const [clinicalNoteText, setClinicalNoteText] = useState<string>(
    `70-year-old elderly male with non-compliant hypertension and diabetic lifestyle issues. Patient seems somewhat hesitant to follow rigid dietary restrictions.`
  );
  const [biasResult, setBiasResult] = useState<{
    score: 'Clean' | 'Mild Bias Detected' | 'High Bias Concern';
    flags: { term: string; explanation: string; suggestion: string }[];
  } | null>(null);

  // Patient Communication Mode
  const [communicationTone, setCommunicationTone] = useState<'simple' | 'empathetic' | 'detailed'>('simple');

  // Accessibility States
  const [largeText, setLargeText] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Run Bias Scan
  const handleScanBias = () => {
    const flags: { term: string; explanation: string; suggestion: string }[] = [];
    const text = clinicalNoteText.toLowerCase();

    if (text.includes('non-compliant') || text.includes('noncompliant')) {
      flags.push({
        term: 'non-compliant',
        explanation: 'Attributive term implying intentional resistance rather than exploring socioeconomic, financial, or medication adherence barriers.',
        suggestion: 'Replace with: "experiences barriers to medication adherence" or "reports difficulty taking medications regularly."'
      });
    }

    if (text.includes('elderly')) {
      flags.push({
        term: 'elderly',
        explanation: 'Potentially ageist categorization that can lead clinicians to under-treat or inappropriately withhold evidence-based therapies.',
        suggestion: 'Replace with: "older adult (70 years of age)" or state specific age.'
      });
    }

    if (text.includes('lifestyle issues')) {
      flags.push({
        term: 'lifestyle issues',
        explanation: 'Stigmatizing framing that can obscure structural determinants of health (SDOH).',
        suggestion: 'Specify concrete dietary or physical activity challenges.'
      });
    }

    setBiasResult({
      score: flags.length > 1 ? 'High Bias Concern' : flags.length === 1 ? 'Mild Bias Detected' : 'Clean',
      flags
    });
  };

  return (
    <div className={`p-4 lg:p-6 max-w-7xl mx-auto space-y-6 ${largeText ? 'text-base' : 'text-xs'}`}>
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">HCAI Safe-AI, Ethics & Patient Suite</h1>
            <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-0.5 rounded">PDF Framework Aligned</span>
          </div>
          <p className="text-slate-500 mt-1">
            Clinical decision tree validation, linguistic bias detector, and patient-centered explainability generator.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Accessibility Toggles */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg">
            <button
              onClick={() => setLargeText(!largeText)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                largeText ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aa Large Text
            </button>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                highContrast ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              High Contrast
            </button>
          </div>

          <button
            onClick={() => onSelectView('treatment-analyzer')}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            ← Treatment Analyzer
          </button>
        </div>
      </div>

      {/* Grid: Decision Tree + Bias Checker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Safe-AI Decision Tree */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe-AI Clinical Decision Tree</span>
            </h2>
            <button
              onClick={() => {
                setTreeStep(1);
                setQ1CriticallyUnstable(null);
                setQ2DataComplete(null);
                setQ3SevereContradiction(null);
              }}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Flow</span>
            </button>
          </div>

          {/* Interactive Decision Walkthrough */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className={`p-4 rounded-xl border transition-all ${treeStep === 1 ? 'bg-blue-50/50 border-blue-300' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Checkpoint 1: Clinical Stability</span>
              <p className="font-bold text-slate-800 mb-2">Is the patient in acute life-threatening instability or requiring emergency intervention?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setQ1CriticallyUnstable(true);
                    setTreeStep(4); // Emergency Exit
                  }}
                  className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors ${
                    q1CriticallyUnstable === true ? 'bg-red-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-red-50'
                  }`}
                >
                  Yes — Emergent Condition
                </button>
                <button
                  onClick={() => {
                    setQ1CriticallyUnstable(false);
                    setTreeStep(2);
                  }}
                  className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors ${
                    q1CriticallyUnstable === false ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  No — Clinically Stable
                </button>
              </div>
            </div>

            {/* Step 2 */}
            {treeStep >= 2 && q1CriticallyUnstable === false && (
              <div className={`p-4 rounded-xl border transition-all ${treeStep === 2 ? 'bg-blue-50/50 border-blue-300' : 'bg-slate-50 border-slate-200'}`}>
                <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Checkpoint 2: Data Integrity</span>
                <p className="font-bold text-slate-800 mb-2">Is the EHR record complete (verified allergies, baseline renal function, recent vitals)?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setQ2DataComplete(true);
                      setTreeStep(3);
                    }}
                    className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors ${
                      q2DataComplete === true ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50'
                    }`}
                  >
                    Yes — Data Complete (&gt;90%)
                  </button>
                  <button
                    onClick={() => {
                      setQ2DataComplete(false);
                      setTreeStep(5); // Incomplete Data
                    }}
                    className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors ${
                      q2DataComplete === false ? 'bg-amber-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-amber-50'
                    }`}
                  >
                    No — Missing Labs / Records
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {treeStep >= 3 && q2DataComplete === true && (
              <div className={`p-4 rounded-xl border transition-all ${treeStep === 3 ? 'bg-blue-50/50 border-blue-300' : 'bg-slate-50 border-slate-200'}`}>
                <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Checkpoint 3: Contraindications & Allergies</span>
                <p className="font-bold text-slate-800 mb-2">Does the proposed treatment plan have unaddressed critical cross-allergies or severe contraindications?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setQ3SevereContradiction(false);
                      setTreeStep(6); // Safe to proceed!
                    }}
                    className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors ${
                      q3SevereContradiction === false ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50'
                    }`}
                  >
                    No — All Clear / Reconciled
                  </button>
                  <button
                    onClick={() => {
                      setQ3SevereContradiction(true);
                      setTreeStep(7); // Blocked
                    }}
                    className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors ${
                      q3SevereContradiction === true ? 'bg-red-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-red-50'
                    }`}
                  >
                    Yes — Unresolved Critical Alert
                  </button>
                </div>
              </div>
            )}

            {/* Tree Outcome Badges */}
            {treeStep === 6 && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Decision: AI Verified Safe for Clinical Execution</span>
                </div>
                <p className="text-[11px]">Treatment plan meets all Joint Commission and hospital safety criteria. May proceed to order dispatch.</p>
              </div>
            )}

            {treeStep === 4 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 space-y-1">
                <div className="flex items-center gap-2 font-bold text-red-800">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span>Decision: AI Bypassed for Emergency Resuscitation</span>
                </div>
                <p className="text-[11px]">Immediate clinical code or bedside evaluation required. Do not rely on AI models during acute resuscitation.</p>
              </div>
            )}

            {treeStep === 5 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Decision: Hold for Missing Data Verification</span>
                </div>
                <p className="text-[11px]">Acquire current serum creatinine, eGFR, or documented allergy history before executing high-risk medications.</p>
              </div>
            )}
          </div>
        </div>

        {/* Module 2: Clinical Language Bias Checker */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-600" />
              <span>Clinical Language Bias Scanner</span>
            </h2>
            <span className="text-[10px] text-slate-400">Implicit Bias Mitigation</span>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-700">Clinical Narrative Note to Audit:</label>
            <textarea
              value={clinicalNoteText}
              onChange={(e) => setClinicalNoteText(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
            <button
              onClick={handleScanBias}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scan for Implicit Bias & Stigmatizing Phrasing</span>
            </button>
          </div>

          {biasResult && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-xs">Analysis Result:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  biasResult.score === 'Clean' ? 'bg-emerald-100 text-emerald-800' :
                  biasResult.score === 'Mild Bias Detected' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  {biasResult.score}
                </span>
              </div>

              {biasResult.flags.map((flag, idx) => (
                <div key={idx} className="p-3 bg-red-50/50 rounded-lg border border-red-200 text-xs space-y-1">
                  <p className="font-bold text-red-700">Flagged Word: "{flag.term}"</p>
                  <p className="text-slate-600 text-[11px]">{flag.explanation}</p>
                  <p className="text-emerald-700 font-semibold text-[11px]">💡 {flag.suggestion}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Module 3: Patient Communication Mode (Plain-Language Metaphors) */}
      <section className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Patient Communication Mode — Plain Language Translator</span>
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Translates complex pathophysiological explanations into clear, empathetic patient metaphors.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(['simple', 'empathetic', 'detailed'] as const).map(tone => (
              <button
                key={tone}
                onClick={() => setCommunicationTone(tone)}
                className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-all ${
                  communicationTone === tone ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block text-xs">High Blood Pressure</span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {communicationTone === 'simple' && "Think of your blood vessels like a garden hose. When the pressure is too high for too long, it strains the hose and the pump (your heart). Lowering it protects both."}
              {communicationTone === 'empathetic' && "We know managing blood pressure takes daily effort. Keeping that number closer to 120/80 is like taking heavy baggage off your heart every single day."}
              {communicationTone === 'detailed' && "Sustained systolic pressure over 130 stretches arterial walls, leading to gradual microvascular thickening and kidney workload."}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block text-xs">Type 2 Diabetes & A1c</span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {communicationTone === 'simple' && "Insulin is like a key that lets sugar into your cells for energy. Right now the keyhole is a bit sticky. Your meds help that key turn easily again."}
              {communicationTone === 'empathetic' && "An A1c of 7.2% means you've been working hard, and you're very close to goal. A tiny tweak in medication will get you right into the green zone."}
              {communicationTone === 'detailed' && "HbA1c measures 90-day glycosylated hemoglobin. Target < 7.0% minimizes diabetic retinopathy and peripheral neuropathy progression."}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block text-xs">Statin Therapy (Atorvastatin)</span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {communicationTone === 'simple' && "Your statin acts like a nightly cleanup crew on the highway, sweeping away cholesterol grease before it can stick to the walls."}
              {communicationTone === 'empathetic' && "Taking this nightly pill is like putting an invisible shield around your heart arteries so you can stay active with your family."}
              {communicationTone === 'detailed' && "HMG-CoA reductase inhibitor stabilizes coronary plaque fibrous caps, reducing acute rupture and secondary cardiovascular events."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
