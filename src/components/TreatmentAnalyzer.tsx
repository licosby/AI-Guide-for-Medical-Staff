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
  Send,
  HelpCircle,
  TrendingUp,
  BookOpen,
  Info
} from 'lucide-react';
import { Patient, MedicationItem, ProcedureItem, TherapyItem, DiagnosticTestItem, ClinicalAlert, RiskAnalysis } from '../types/clinical';
import { DRUG_CATALOG, PROCEDURES_CATALOG, THERAPIES_CATALOG, TESTS_CATALOG } from '../data/medicalDatabase';
import { INITIAL_PATIENTS } from '../data/mockPatients';
import { evaluateTreatmentPlan } from '../services/clinicalRulesEngine';
import { ExplainScoreModal } from './ExplainScoreModal';
import { PatientSelector, PatientCardList } from './PatientSelector';

interface TreatmentAnalyzerProps {
  patient?: Patient | null;
  patients?: Patient[];
  onSelectPatient?: (patient: Patient) => void;
  onUpdatePatient: (updated: Patient) => void;
  onOpenOrderDispatch: () => void;
  onSelectView: (view: string) => void;
}

export const TreatmentAnalyzer: React.FC<TreatmentAnalyzerProps> = ({
  patient: _initialPatientProp, // Do NOT auto-load; require explicit selection
  patients = INITIAL_PATIENTS,
  onSelectPatient,
  onUpdatePatient,
  onOpenOrderDispatch,
  onSelectView
}) => {
  // Requirement: Do NOT automatically load the last viewed patient.
  // User must explicitly choose a patient via the Select Patient feature.
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [activeTab, setActiveTab] = useState<'medications' | 'procedures' | 'therapies' | 'tests'>('medications');
  const [isExplainScoreOpen, setIsExplainScoreOpen] = useState(false);
  
  // Treatment plan local state - refreshed when a patient is selected
  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [procedures, setProcedures] = useState<ProcedureItem[]>([]);
  const [therapies, setTherapies] = useState<TherapyItem[]>([]);
  const [tests, setTests] = useState<DiagnosticTestItem[]>([]);
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
  const [analysisResult, setAnalysisResult] = useState<RiskAnalysis | null>(null);

  // Selected alert for deep drill-down and independent toggle state for clinical concerns
  const [expandedAlerts, setExpandedAlerts] = useState<Record<string, boolean>>({});
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  // Independent toggle state for risk breakdown categories
  const [expandedRiskCategories, setExpandedRiskCategories] = useState<Record<string, boolean>>({});

  // Handler to select and load a patient into the analyzer
  const handleSelectPatient = (chosenPatient: Patient) => {
    setSelectedPatient(chosenPatient);
    setMedications([...chosenPatient.medications]);
    setProcedures([...chosenPatient.procedures]);
    setTherapies([...chosenPatient.therapies]);
    setTests([...chosenPatient.tests]);
    setPlanNotes(chosenPatient.planSummary || 'Blood pressure sub-optimally controlled. Monitoring potassium and renal profile.');
    setConsentStatus('Yes');
    setSelectedCatalogDrug('');
    setSelectedDose('');
    setSelectedFreq('Daily');
    setSelectedProcedure('');
    setSelectedTherapy('');
    setSelectedTest('');
    setExpandedAlerts({});
    setExpandedRiskCategories({});

    const initialRes = evaluateTreatmentPlan({
      patient: chosenPatient,
      medications: chosenPatient.medications,
      procedures: chosenPatient.procedures,
      therapies: chosenPatient.therapies,
      tests: chosenPatient.tests,
      consentStatus: 'Yes',
      planNotes: chosenPatient.planSummary || 'Initial evaluation'
    });
    setAnalysisResult(initialRes);
    if (initialRes.alerts.length > 0) {
      setExpandedAlertId(initialRes.alerts[0].id);
      setExpandedAlerts({ [initialRes.alerts[0].id]: true });
    }

    if (onSelectPatient) {
      onSelectPatient(chosenPatient);
    }
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setMedications([]);
    setProcedures([]);
    setTherapies([]);
    setTests([]);
    setAnalysisResult(null);
    setExpandedAlerts({});
    setExpandedRiskCategories({});
  };

  const toggleRiskCategory = (categoryKey: string) => {
    setExpandedRiskCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  const toggleAlert = (alertId: string) => {
    setExpandedAlerts(prev => ({
      ...prev,
      [alertId]: !prev[alertId]
    }));
    setExpandedAlertId(alertId);
  };

  // Run analysis function
  const runAnalysis = () => {
    if (!selectedPatient) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = evaluateTreatmentPlan({
        patient: selectedPatient,
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
        setExpandedAlerts(prev => ({
          ...prev,
          [res.alerts[0].id]: true
        }));
      }
      setIsAnalyzing(false);
    }, 450);
  };

  useEffect(() => {
    if (selectedPatient) {
      runAnalysis();
    }
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
    if (!selectedPatient) return;
    onUpdatePatient({
      ...selectedPatient,
      medications,
      procedures,
      therapies,
      tests
    });
    onOpenOrderDispatch();
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6 text-xs">
      {/* Patient Selection Component directly at top of Treatment Analyzer */}
      <PatientSelector
        patients={patients}
        selectedPatient={selectedPatient}
        onSelectPatient={handleSelectPatient}
        onClearPatient={handleClearPatient}
      />

      {/* If no patient is selected yet, show clear prompt and hide treatment plan fields */}
      {!selectedPatient || !analysisResult ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xs text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto shadow-2xs">
              <Stethoscope className="w-8 h-8" />
            </div>
            
            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Please select a patient to begin analysis
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                The Treatment Analyzer evaluates real-time pharmacological regimens, drug interactions, contraindications, and guideline alignments. Choose a patient from the selector above or pick a clinical profile below to load their medical chart.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] text-slate-600 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                No auto-loaded patient
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Live Rule Engine Verification
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                Interactive Risk Breakdown
              </span>
            </div>
          </div>

          {/* Quick-Pick Patient Cards Directory */}
          <PatientCardList
            patients={patients}
            onSelectPatient={handleSelectPatient}
          />
        </div>
      ) : (
        <>
          {/* Patient Banner matching treatment analyzer.png */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
                {selectedPatient.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900">{selectedPatient.name}</span>
                  <span className="font-mono text-slate-500 font-semibold">MRN {selectedPatient.mrn}</span>
                </div>
                <div className="text-slate-500 flex items-center gap-3 text-[11px] mt-0.5">
                  <span>Allergies: <strong className="text-red-600">{selectedPatient.allergies.map(a => a.allergen).join(', ') || 'NKDA'}</strong></span>
                  <span>•</span>
                  <span>Problems: <strong className="text-slate-700">{selectedPatient.activeProblems.length} active</strong></span>
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

            <div className="pt-1 flex flex-col items-center gap-2">
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                analysisResult.overallScore >= 70 ? 'bg-red-100 text-red-700' :
                analysisResult.overallScore >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {analysisResult.riskCategory}
              </span>

              {/* Explain Score Button directly under score */}
              <button
                type="button"
                onClick={() => setIsExplainScoreOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-indigo-700 hover:text-indigo-800 font-bold text-[11px] rounded-lg border border-indigo-200 shadow-2xs transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>Explain Score</span>
              </button>
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

          {/* Risk Breakdown Bars - Clickable with Independent Detail Panels */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 text-xs block">Risk Breakdown</span>
              <span className="text-[10px] text-indigo-600 font-medium">Click any bar to expand factors</span>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 'drugInteractions',
                  label: 'Drug Interactions',
                  score: analysisResult.breakdown.drugInteractions,
                  colorBar: 'bg-red-500',
                  badgeBg: 'bg-red-50 text-red-700 border-red-200',
                  summary: 'Pharmacological synergy & clearance load',
                  factors: [
                    {
                      name: 'Lisinopril + Spironolactone Concomitant RAS Blockade',
                      impact: '+18 pts',
                      description: 'Dual inhibition of renin-angiotensin-aldosterone axis suppresses potassium secretion, elevating hyperkalemia danger (>5.2 mEq/L).',
                      guideline: 'ACC/AHA HF Guidelines (Class III: Harm)'
                    },
                    {
                      name: 'Metformin Elimination Competition in Reduced eGFR',
                      impact: '+10 pts',
                      description: 'Baseline renal filtration rate (eGFR ~54 mL/min) slows tubular drug excretion, increasing systemic metabolite burden.',
                      guideline: 'FDA Metformin Renal Safety Label'
                    },
                    {
                      name: 'Hepatic Cytochrome P450 Metabolic Overlap',
                      impact: '+7 pts',
                      description: 'Concurrent Statin / Antihypertensive substrate utilization across common enzymatic clearance pathways.',
                      guideline: 'Lexicomp Multi-Drug Interaction Matrix'
                    }
                  ],
                  mitigation: 'Order basic metabolic panel (BMP) in 10–14 days; verify serum potassium & serum creatinine before dose escalation.'
                },
                {
                  id: 'adverseEffects',
                  label: 'Adverse Effects',
                  score: analysisResult.breakdown.adverseEffects,
                  colorBar: 'bg-amber-500',
                  badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
                  summary: 'Hyperkalemia, orthostasis & azotemia susceptibility',
                  factors: [
                    {
                      name: 'Serum Potassium Accumulation Threshold',
                      impact: '+14 pts',
                      description: 'Baseline serum potassium at 4.9 mEq/L borders the critical alert window with blunted renal compensation capacity.',
                      guideline: 'KDIGO Clinical Practice Guideline'
                    },
                    {
                      name: 'Orthostatic Reflex Suppression & Fall Hazard',
                      impact: '+10 pts',
                      description: 'Combined systemic vasodilation can drop diastolic pressure below 60 mmHg during rapid postural transitions.',
                      guideline: 'AHA Geriatric Cardiovascular Safety'
                    },
                    {
                      name: 'Intraglomerular Hemodynamic Transient Azotemia',
                      impact: '+6 pts',
                      description: 'Efferent arteriolar dilation commonly triggers an initial 10–20% rise in serum creatinine upon therapy initiation.',
                      guideline: 'National Kidney Foundation Guidelines'
                    }
                  ],
                  mitigation: 'Instruct on gradual position changes, maintain fluid volume balance, and check seated/standing blood pressures.'
                },
                {
                  id: 'diseaseInteractions',
                  label: 'Disease Interactions',
                  score: analysisResult.breakdown.diseaseInteractions,
                  colorBar: 'bg-blue-500',
                  badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
                  summary: 'CKD Stage 3, Diabetes & hypertensive vascular stiffness',
                  factors: [
                    {
                      name: 'Stage 3 Chronic Kidney Disease Comorbidity',
                      impact: '+12 pts',
                      description: 'Baseline renal microvascular impairment limits pharmacokinetic margin of safety for cardioprotective drugs.',
                      guideline: 'ADA-KDIGO Consensus on Diabetes & CKD'
                    },
                    {
                      name: 'Type 2 Diabetes Endothelial Remodeling',
                      impact: '+8 pts',
                      description: 'Glycemic control (HbA1c 7.2%) correlates with arterial stiffness and heightened baroreceptor dampening.',
                      guideline: 'ADA Standards of Medical Care 2024'
                    },
                    {
                      name: 'Isolated Systolic Hypertension Profile',
                      impact: '+5 pts',
                      description: 'Elevated pulse pressure (>54 mmHg) indicates chronic arterial compliance loss and end-organ shear stress.',
                      guideline: '2023 ACC/AHA High Blood Pressure Practice'
                    }
                  ],
                  mitigation: 'Obtain urine albumin-to-creatinine ratio (uACR) and synchronize with nephrology clinical care pathway.'
                },
                {
                  id: 'doseAndDuration',
                  label: 'Dose & Duration',
                  score: analysisResult.breakdown.doseAndDuration,
                  colorBar: 'bg-purple-500',
                  badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
                  summary: 'Maintenance ceiling proximity & surveillance cycle',
                  factors: [
                    {
                      name: 'Lisinopril 20 mg Daily Target Proximity',
                      impact: '+9 pts',
                      description: 'Patient is at standard upper-middle clinical titration before compulsory lab re-evaluation is mandated.',
                      guideline: 'ACC Blood Pressure Optimization Protocols'
                    },
                    {
                      name: 'Chronic Continuous Regimen Duration (>180 Days)',
                      impact: '+6 pts',
                      description: 'Protracted duration without documented interim safety profile re-testing increases latent risk accumulation.',
                      guideline: 'AHRQ Ambulatory Safety Recommendations'
                    },
                    {
                      name: 'Titration Interval Under Staged 4-Week Horizon',
                      impact: '+5 pts',
                      description: 'Allow adequate home blood pressure diary accumulation before proceeding to subsequent dose adjustments.',
                      guideline: 'USPSTF Cardiovascular Prevention Guidelines'
                    }
                  ],
                  mitigation: 'Review 14-day home blood pressure readings and schedule comprehensive lab panel within 30 days.'
                }
              ].map(cat => {
                const isCatExpanded = !!expandedRiskCategories[cat.id];
                return (
                  <div
                    key={cat.id}
                    className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                      isCatExpanded
                        ? 'border-indigo-300 bg-slate-50/70 shadow-2xs ring-1 ring-indigo-200/50'
                        : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Clickable Risk Bar Header */}
                    <button
                      type="button"
                      onClick={() => toggleRiskCategory(cat.id)}
                      className="w-full text-left p-2.5 space-y-1.5 cursor-pointer focus:outline-hidden group"
                      aria-expanded={isCatExpanded}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 group-hover:text-indigo-900 transition-colors">
                          <span className={`w-2 h-2 rounded-full ${cat.colorBar}`}></span>
                          <span>{cat.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${cat.badgeBg}`}>
                            {cat.score}%
                          </span>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isCatExpanded
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                          }`}>
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 transform ${
                              isCatExpanded ? 'rotate-90' : 'rotate-0'
                            }`} />
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar Track */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`${cat.colorBar} h-1.5 rounded-full transition-all duration-500`}
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-500">
                        <span className="truncate pr-2">{cat.summary}</span>
                        <span className="text-indigo-600 font-semibold shrink-0 group-hover:underline">
                          {isCatExpanded ? 'Hide factors ▲' : 'Show factors ▼'}
                        </span>
                      </div>
                    </button>

                    {/* Expandable Detail Panel directly beneath the bar */}
                    {isCatExpanded && (
                      <div className="px-3 pb-3 pt-2.5 border-t border-slate-200 bg-white text-xs space-y-2.5 animate-fadeIn">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Factors Contributing to {cat.label} ({cat.factors.length})</span>
                          </span>
                          <span className="text-[10px] text-slate-400">Impact on Category</span>
                        </div>

                        <div className="space-y-1.5">
                          {cat.factors.map((factor, fIdx) => (
                            <div key={fIdx} className="p-2 rounded bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-slate-800">{factor.name}</span>
                                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.2 rounded shrink-0">
                                  {factor.impact}
                                </span>
                              </div>
                              <p className="text-slate-600 text-[10px] leading-relaxed">
                                {factor.description}
                              </p>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-0.5">
                                <span className="font-semibold text-slate-500">Source:</span> {factor.guideline}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Clinical Mitigation Advisory */}
                        <div className="p-2.5 rounded-lg bg-indigo-50/80 border border-indigo-100 text-[10px] text-indigo-950 flex items-start gap-2">
                          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-indigo-800">Clinical Action / Mitigation: </span>
                            <span>{cat.mitigation}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Concerns: High Severity at Top, Expandable on Click with Enhanced Visible Arrows & Rotation */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 text-xs">Top Clinical Concerns</span>
              <span className="text-[10px] text-slate-400">High severity at top • Click to toggle</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {analysisResult.alerts.map(alert => {
                const isExpanded = !!expandedAlerts[alert.id];
                const badgeColor = 
                  alert.severity === 'Critical' ? 'bg-red-100 text-red-800 border-red-300' :
                  alert.severity === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                  alert.severity === 'Moderate' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  'bg-blue-50 text-blue-700 border-blue-200';

                return (
                  <div
                    key={alert.id}
                    onClick={() => toggleAlert(alert.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isExpanded 
                        ? 'bg-blue-50/40 border-indigo-300 shadow-xs ring-1 ring-indigo-200/50' 
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${badgeColor}`}>
                          {alert.severity}
                        </span>
                        <span className="font-bold text-slate-800 text-[11px] truncate">{alert.title}</span>
                      </div>

                      {/* Prominent High-Visibility Arrow Button with Smooth Rotation Animation */}
                      <div 
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                          isExpanded 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-200' 
                            : 'bg-indigo-50/90 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 shadow-2xs'
                        }`}
                        title={isExpanded ? "Collapse clinical concern" : "Expand clinical concern"}
                      >
                        <ChevronRight 
                          className={`w-4.5 h-4.5 transition-transform duration-300 ease-in-out transform ${
                            isExpanded ? 'rotate-90 text-white' : 'rotate-0 text-indigo-700'
                          }`} 
                        />
                      </div>
                    </div>

                    <p className="text-slate-600 text-[11px] mt-1 line-clamp-2">{alert.summary}</p>

                    {/* Expanded details with smooth entrance */}
                    {isExpanded && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-200 text-[11px] space-y-2 animate-fadeIn">
                        <p className="text-slate-700 leading-relaxed font-normal">{alert.detailedReason}</p>
                        <div className="p-2 bg-white rounded border border-slate-200 text-[10px] text-slate-600 flex items-start gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-800">Evidence Guideline:</strong> {alert.clinicalGuideline}
                          </div>
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

      {/* Explain Score Modal */}
      {selectedPatient && analysisResult && (
        <ExplainScoreModal
          isOpen={isExplainScoreOpen}
          onClose={() => setIsExplainScoreOpen(false)}
          patient={selectedPatient}
          riskData={analysisResult}
          score={analysisResult.overallScore}
          riskCategory={analysisResult.riskCategory}
          confidence={analysisResult.clinicalConfidence}
          onNavigateToFullExplainability={() => onSelectView('explainability')}
        />
      )}
        </>
      )}
    </div>
  );
};
