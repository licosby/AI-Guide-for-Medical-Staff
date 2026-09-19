import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Stethoscope, 
  Activity, 
  FlaskConical, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Patient, MedicationItem, ProcedureItem, TherapyItem, DiagnosticTestItem, ClinicalAlert, RiskAnalysis } from '../types/clinical';
import { DRUG_CATALOG, PROCEDURES_CATALOG, THERAPIES_CATALOG, TESTS_CATALOG } from '../data/medicalDatabase';
import { evaluateTreatmentPlan } from '../services/clinicalRulesEngine';

interface TreatmentAnalyzerProps {
  patient: Patient;
  onUpdatePatient: (updated: Patient) => void;
  onOpenOrderDispatch: () => void;
  onSelectView: (view: string) => void;
}

export const TreatmentAnalyzer: React.FC<TreatmentAnalyzerProps> = ({
  patient,
  onUpdatePatient,
  onOpenOrderDispatch,
  onSelectView
}) => {
  const [activeTab, setActiveTab] = useState<'medications' | 'procedures' | 'therapies' | 'tests'>('medications');
  
  // Treatment plan local state
  const [medications, setMedications] = useState<MedicationItem[]>(patient.medications);
  const [procedures, setProcedures] = useState<ProcedureItem[]>(patient.procedures);
  const [therapies, setTherapies] = useState<TherapyItem[]>(patient.therapies);
  const [tests, setTests] = useState<DiagnosticTestItem[]>(patient.tests);
  const [planNotes, setPlanNotes] = useState<string>('Blood pressure sub-optimally controlled. Monitoring potassium and renal profile.');
  const [consentStatus, setConsentStatus] = useState<'Yes' | 'Pending' | 'Not Required'>('Yes');

  // New item selector states
  const [selectedCatalogDrug, setSelectedCatalogDrug] = useState<string>('');
  const [selectedDose, setSelectedDose] = useState<string>('');
  const [selectedFreq, setSelectedFreq] = useState<string>('Daily');

  const [selectedProcedure, setSelectedProcedure] = useState<string>('');
  const [selectedTherapy, setSelectedTherapy] = useState<string>('');
  const [selectedTest, setSelectedTest] = useState<string>('');

  // Analysis result
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<RiskAnalysis>(() => 
    evaluateTreatmentPlan({
      patient,
      medications: patient.medications,
      procedures: patient.procedures,
      therapies: patient.therapies,
      tests: patient.tests,
      consentStatus: 'Yes',
      planNotes: 'Initial evaluation'
    })
  );

  // Selected alert for deep drill-down (handwritten note: "When I click through alerts they expand in selected alerts")
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  // Run analysis function
  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = evaluateTreatmentPlan({
        patient,
        medications,
        procedures,
        therapies,
        tests,
        consentStatus,
        planNotes
      });
      setAnalysisResult(res);
      if (res.alerts.length > 0) {
        setExpandedAlertId(res.alerts[0].id);
      }
      setIsAnalyzing(false);
    }, 450);
  };

  useEffect(() => {
    runAnalysis();
  }, [medications, procedures, therapies, tests, consentStatus]);

  // Add Medication
  const handleAddMedication = () => {
    if (!selectedCatalogDrug) return;
    const catalogItem = DRUG_CATALOG.find(d => d.name === selectedCatalogDrug);
    if (!catalogItem) return;

    const newMed: MedicationItem = {
      id: `med-${Date.now()}`,
      name: catalogItem.name,
      genericName: catalogItem.generic,
      dose: selectedDose || catalogItem.commonDoses[0] || '10 mg',
      route: catalogItem.routes[0] || 'PO (Oral)',
      frequency: selectedFreq || catalogItem.frequencies[0] || 'Daily',
      category: catalogItem.category,
      maxDailyDoseMg: catalogItem.maxDailyMg,
      blackBoxWarning: catalogItem.blackBox
    };

    setMedications([...medications, newMed]);
    setSelectedCatalogDrug('');
    setSelectedDose('');
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  // Add Procedure
  const handleAddProcedure = () => {
    if (!selectedProcedure) return;
    const item = PROCEDURES_CATALOG.find(p => p.name === selectedProcedure);
    if (!item) return;

    const newProc: ProcedureItem = {
      id: `proc-${Date.now()}`,
      name: item.name,
      category: item.category,
      urgency: item.urgency,
      department: item.department
    };

    setProcedures([...procedures, newProc]);
    setSelectedProcedure('');
  };

  // Add Therapy
  const handleAddTherapy = () => {
    if (!selectedTherapy) return;
    const item = THERAPIES_CATALOG.find(t => t.name === selectedTherapy);
    if (!item) return;

    const newTherapy: TherapyItem = {
      id: `th-${Date.now()}`,
      name: item.name,
      discipline: item.discipline,
      frequency: item.defaultFreq,
      goal: item.goal
    };

    setTherapies([...therapies, newTherapy]);
    setSelectedTherapy('');
  };

  // Add Test
  const handleAddTest = () => {
    if (!selectedTest) return;
    const item = TESTS_CATALOG.find(t => t.name === selectedTest);
    if (!item) return;

    const newTest: DiagnosticTestItem = {
      id: `test-${Date.now()}`,
      name: item.name,
      type: item.type,
      urgency: item.urgency,
      department: item.department
    };

    setTests([...tests, newTest]);
    setSelectedTest('');
  };

  // Save changes to patient
  const handleAcceptPlan = () => {
    onUpdatePatient({
      ...patient,
      medications,
      procedures,
      therapies,
      tests
    });
    onOpenOrderDispatch();
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6 text-xs">
      {/* Patient Banner matching treatment analyzer.png */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
            {patient.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">{patient.name}</span>
              <span className="font-mono text-slate-500 font-semibold">MRN {patient.mrn}</span>
            </div>
            <div className="text-slate-500 flex items-center gap-3 text-[11px] mt-0.5">
              <span>Allergies: <strong className="text-red-600">{patient.allergies.map(a => a.allergen).join(', ') || 'NKDA'}</strong></span>
              <span>•</span>
              <span>Problems: <strong className="text-slate-700">{patient.activeProblems.length} active</strong></span>
              <span>•</span>
              <span>Last Labs: <strong className="text-slate-700">May 7, 2025</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectView('risk-calculator')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
          >
            View Risk Calculator →
          </button>
          <button
            onClick={handleAcceptPlan}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Accept & Upload Orders</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Clinical Engine matching treatment analyzer.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Treatment Plan (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 text-sm">1. Treatment Plan</h2>
            <span className="text-slate-400 text-[10px]">Step 1 of 3</span>
          </div>

          {/* Sub-tabs: Medications, Procedures, Therapies, Tests */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg text-center font-medium">
            <button
              onClick={() => setActiveTab('medications')}
              className={`py-1.5 rounded text-[11px] transition-all ${
                activeTab === 'medications' ? 'bg-white text-blue-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Medications ({medications.length})
            </button>
            <button
              onClick={() => setActiveTab('procedures')}
              className={`py-1.5 rounded text-[11px] transition-all ${
                activeTab === 'procedures' ? 'bg-white text-blue-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Procedures ({procedures.length})
            </button>
            <button
              onClick={() => setActiveTab('therapies')}
              className={`py-1.5 rounded text-[11px] transition-all ${
                activeTab === 'therapies' ? 'bg-white text-blue-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Therapies ({therapies.length})
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`py-1.5 rounded text-[11px] transition-all ${
                activeTab === 'tests' ? 'bg-white text-blue-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tests ({tests.length})
            </button>
          </div>

          {/* Tab 1: Medications */}
          {activeTab === 'medications' && (
            <div className="space-y-3">
              {/* Add Medication Dropdowns */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 text-[11px] block">+ Prescribe Medication</span>
                <div className="space-y-2">
                  <select
                    value={selectedCatalogDrug}
                    onChange={(e) => {
                      const drugName = e.target.value;
                      setSelectedCatalogDrug(drugName);
                      const d = DRUG_CATALOG.find(item => item.name === drugName);
                      if (d && d.commonDoses.length > 0) setSelectedDose(d.commonDoses[0]);
                      if (d && d.frequencies.length > 0) setSelectedFreq(d.frequencies[0]);
                    }}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800"
                  >
                    <option value="">-- Select Drug from Hospital Formulary --</option>
                    {DRUG_CATALOG.map(d => (
                      <option key={d.name} value={d.name}>{d.name} ({d.category})</option>
                    ))}
                  </select>

                  {selectedCatalogDrug && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold">Standard Dose</label>
                        <select
                          value={selectedDose}
                          onChange={(e) => setSelectedDose(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs"
                        >
                          {DRUG_CATALOG.find(d => d.name === selectedCatalogDrug)?.commonDoses.map(dose => (
                            <option key={dose} value={dose}>{dose}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold">Frequency</label>
                        <select
                          value={selectedFreq}
                          onChange={(e) => setSelectedFreq(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs"
                        >
                          {DRUG_CATALOG.find(d => d.name === selectedCatalogDrug)?.frequencies.map(freq => (
                            <option key={freq} value={freq}>{freq}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleAddMedication}
                    disabled={!selectedCatalogDrug}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold py-1.5 px-3 rounded transition-colors text-xs flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Plan</span>
                  </button>
                </div>
              </div>

              {/* Current Prescriptions List */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {medications.map(m => (
                  <div key={m.id} className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between group hover:border-blue-200">
                    <div>
                      <p className="font-bold text-slate-800">{m.name} <span className="text-blue-600 font-semibold">{m.dose}</span></p>
                      <p className="text-[10px] text-slate-500">{m.route} • {m.frequency}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveMedication(m.id)}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                      title="Remove from plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Procedures */}
          {activeTab === 'procedures' && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 text-[11px] block">+ Order Procedure / Surgery</span>
                <select
                  value={selectedProcedure}
                  onChange={(e) => setSelectedProcedure(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800"
                >
                  <option value="">-- Select Surgical / Interventional Procedure --</option>
                  {PROCEDURES_CATALOG.map(p => (
                    <option key={p.name} value={p.name}>{p.name} ({p.department})</option>
                  ))}
                </select>
                <button
                  onClick={handleAddProcedure}
                  disabled={!selectedProcedure}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold py-1.5 px-3 rounded transition-colors text-xs flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Order Procedure</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {procedures.length === 0 ? (
                  <p className="text-slate-400 italic text-center py-4">No surgical procedures ordered.</p>
                ) : (
                  procedures.map(p => (
                    <div key={p.id} className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-[10px] text-slate-500">{p.category} • {p.department} ({p.urgency})</p>
                      </div>
                      <button
                        onClick={() => setProcedures(procedures.filter(x => x.id !== p.id))}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Therapies */}
          {activeTab === 'therapies' && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 text-[11px] block">+ Order Rehabilitative & Supportive Therapy</span>
                <select
                  value={selectedTherapy}
                  onChange={(e) => setSelectedTherapy(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800"
                >
                  <option value="">-- Select Therapy (PT, OT, RT, SLP, Wound, Dialysis) --</option>
                  {THERAPIES_CATALOG.map(t => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddTherapy}
                  disabled={!selectedTherapy}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold py-1.5 px-3 rounded transition-colors text-xs flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Order Therapy</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {therapies.length === 0 ? (
                  <p className="text-slate-400 italic text-center py-4">No therapy programs ordered.</p>
                ) : (
                  therapies.map(t => (
                    <div key={t.id} className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{t.name}</p>
                        <p className="text-[10px] text-slate-500">{t.frequency} • Goal: {t.goal}</p>
                      </div>
                      <button
                        onClick={() => setTherapies(therapies.filter(x => x.id !== t.id))}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Tests */}
          {activeTab === 'tests' && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 text-[11px] block">+ Order Diagnostic Tests & Imaging</span>
                <select
                  value={selectedTest}
                  onChange={(e) => setSelectedTest(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800"
                >
                  <option value="">-- Select Lab Panel, Imaging, or ECG --</option>
                  {TESTS_CATALOG.map(test => (
                    <option key={test.name} value={test.name}>{test.name} ({test.department})</option>
                  ))}
                </select>
                <button
                  onClick={handleAddTest}
                  disabled={!selectedTest}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold py-1.5 px-3 rounded transition-colors text-xs flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Order Diagnostic Test</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {tests.length === 0 ? (
                  <p className="text-slate-400 italic text-center py-4">No diagnostic tests ordered.</p>
                ) : (
                  tests.map(t => (
                    <div key={t.id} className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{t.name}</p>
                        <p className="text-[10px] text-slate-500">{t.department} • {t.urgency}</p>
                      </div>
                      <button
                        onClick={() => setTests(tests.filter(x => x.id !== t.id))}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Consent Status & Clinical Notes */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <div>
              <span className="font-bold text-slate-600 text-[10px] block mb-1 uppercase">Informed Consent Status</span>
              <div className="flex items-center gap-3">
                {(['Yes', 'Pending', 'Not Required'] as const).map(status => (
                  <label key={status} className="flex items-center gap-1 cursor-pointer text-slate-700">
                    <input
                      type="radio"
                      name="consent"
                      value={status}
                      checked={consentStatus === status}
                      onChange={() => setConsentStatus(status)}
                      className="text-blue-600"
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-600 text-[10px] block mb-1 uppercase">Plan Notes</span>
              <textarea
                value={planNotes}
                onChange={(e) => setPlanNotes(e.target.value)}
                rows={2}
                placeholder="Document clinical rationale, titration notes, or patient counseling..."
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Column 2: Analyze Treatment Plan (4 cols) matching treatment analyzer.png */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 text-sm">2. Analyze Treatment Plan</h2>
            <span className="text-slate-400 text-[10px]">Step 2 of 3</span>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Sparkles className="w-4 h-4 text-blue-200" />
            )}
            <span>{isAnalyzing ? 'Evaluating Medical Rules...' : 'Analyze Plan'}</span>
          </button>

          <p className="text-[10px] text-slate-400 text-center">Last analyzed: Just now</p>

          {/* Semicircle / Donut Risk Gauge */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Overall Patient Risk Score</span>
            <div className="relative w-36 h-20 mx-auto flex items-end justify-center overflow-hidden">
              {/* Semi-circle Gauge background */}
              <div className="w-36 h-36 rounded-full border-12 border-slate-200 border-b-transparent border-l-transparent -rotate-45 relative">
                <div 
                  className={`w-full h-full rounded-full border-12 border-b-transparent border-l-transparent transition-all duration-700 ${
                    analysisResult.overallScore >= 70 ? 'border-red-500' :
                    analysisResult.overallScore >= 40 ? 'border-amber-500' : 'border-emerald-500'
                  }`}
                  style={{ transform: `rotate(${(analysisResult.overallScore / 100) * 180}deg)` }}
                />
              </div>
              <div className="absolute bottom-1 flex flex-col items-center">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{analysisResult.overallScore}</span>
                <span className="text-[10px] font-bold text-slate-500 -mt-1">/100</span>
              </div>
            </div>

            <div className="pt-1">
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                analysisResult.overallScore >= 70 ? 'bg-red-100 text-red-700' :
                analysisResult.overallScore >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {analysisResult.riskCategory}
              </span>
            </div>
          </div>

          {/* Plan Analysis Metrics */}
          <div className="space-y-2">
            <span className="font-bold text-slate-700 text-xs block">Plan Analysis Summary</span>
            <ul className="space-y-1.5 text-slate-600 text-[11px]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span><strong>{analysisResult.alerts.filter(a => a.category === 'Drug Interaction').length}</strong> potential drug-drug interactions detected</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span><strong>1</strong> dose optimization & safety limit advisory</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span><strong>{analysisResult.guidelineAlignments.length}</strong> clinical practice guideline considerations</span>
              </li>
            </ul>
          </div>

          {/* Clinical Confidence & Harm vs Benefit */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-slate-500 text-[10px] font-semibold block">Clinical Confidence</span>
              <p className="text-lg font-bold text-blue-700">{analysisResult.clinicalConfidence}%</p>
              <span className="text-[10px] text-slate-400">High Confidence</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-slate-500 text-[10px] font-semibold block">Expected Benefit</span>
              <p className="text-lg font-bold text-emerald-700">{analysisResult.expectedBenefit}</p>
              <span className="text-[10px] text-slate-400">Harm: {analysisResult.potentialHarm}</span>
            </div>
          </div>
        </div>

        {/* Column 3: Risk & Insights (4 cols) matching treatment analyzer.png */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 text-sm">3. Risk & Insights</h2>
            <span className="text-slate-400 text-[10px]">Step 3 of 3</span>
          </div>

          {/* Risk Breakdown Bars */}
          <div className="space-y-2">
            <span className="font-bold text-slate-700 text-xs block">Risk Breakdown</span>
            <div className="space-y-1.5">
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                  <span>Drug Interactions</span>
                  <span className="font-bold">{analysisResult.breakdown.drugInteractions}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${analysisResult.breakdown.drugInteractions}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                  <span>Adverse Effects</span>
                  <span className="font-bold">{analysisResult.breakdown.adverseEffects}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${analysisResult.breakdown.adverseEffects}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                  <span>Disease Interactions</span>
                  <span className="font-bold">{analysisResult.breakdown.diseaseInteractions}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${analysisResult.breakdown.diseaseInteractions}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                  <span>Dose & Duration</span>
                  <span className="font-bold">{analysisResult.breakdown.doseAndDuration}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${analysisResult.breakdown.doseAndDuration}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Concerns: High Severity at Top, Expandable on Click! */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 text-xs">Top Clinical Concerns</span>
              <span className="text-[10px] text-slate-400">High severity at top</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {analysisResult.alerts.map(alert => {
                const isExpanded = expandedAlertId === alert.id;
                const badgeColor = 
                  alert.severity === 'Critical' ? 'bg-red-100 text-red-800 border-red-300' :
                  alert.severity === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                  alert.severity === 'Moderate' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  'bg-blue-50 text-blue-700 border-blue-200';

                return (
                  <div
                    key={alert.id}
                    onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isExpanded ? 'bg-blue-50/40 border-blue-300 shadow-xs' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${badgeColor}`}>
                          {alert.severity}
                        </span>
                        <span className="font-bold text-slate-800 text-[11px]">{alert.title}</span>
                      </div>
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                    </div>

                    <p className="text-slate-600 text-[11px] mt-1 line-clamp-2">{alert.summary}</p>

                    {/* Expanded view matching user note: "When I click through alerts they expand in selected alerts" */}
                    {isExpanded && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200 text-[11px] space-y-1.5">
                        <p className="text-slate-700 leading-relaxed">{alert.detailedReason}</p>
                        <div className="p-2 bg-white rounded border border-slate-200 text-[10px] text-slate-500">
                          <strong className="text-slate-700">Guideline:</strong> {alert.clinicalGuideline}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guideline Alignment */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-700 text-xs block">Guideline Alignment</span>
            <div className="space-y-1">
              {analysisResult.guidelineAlignments.map((g, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">{g.name}</span>
                  <span className={`font-semibold px-2 py-0.2 rounded text-[10px] ${
                    g.status === 'Aligned' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {g.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Evidence-Based Alternatives with % effectiveness / risk reduction */}
      <section className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Alternative Options & Risk Reductions</h2>
            <p className="text-slate-500 text-xs">Evidence-based clinical alternatives to consider with estimated risk reduction percentages.</p>
          </div>
          <button
            onClick={() => onSelectView('explainability')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Inspect Evidence Base</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysisResult.alternatives.map((alt, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-bold text-slate-800 text-xs">{alt.title}</h3>
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <TrendingDown className="w-3 h-3 text-emerald-600" />
                    <span>+{alt.riskReductionPercent}% Risk Reduction</span>
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{alt.description}</p>
              </div>

              <button
                onClick={() => {
                  alert(`Selected alternative: ${alt.title}. You may incorporate this into the patient's medications or order set.`);
                }}
                className="w-full bg-white hover:bg-emerald-600 hover:text-white text-emerald-700 font-semibold py-1.5 px-3 rounded-lg border border-emerald-300 transition-colors text-xs"
              >
                Apply Alternative to Plan
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
