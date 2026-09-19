import React, { useState } from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Activity, 
  Send, 
  RefreshCw,
  Sparkles,
  HeartPulse
} from 'lucide-react';
import { Patient, RiskAnalysis } from '../types/clinical';
import { evaluateTreatmentPlan } from '../services/clinicalRulesEngine';

interface RiskCalculatorProps {
  patient: Patient;
  onSelectView: (view: string) => void;
  onOpenOrderDispatch: () => void;
}

export const RiskCalculator: React.FC<RiskCalculatorProps> = ({
  patient,
  onSelectView,
  onOpenOrderDispatch
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [riskData, setRiskData] = useState<RiskAnalysis>(() => 
    evaluateTreatmentPlan({
      patient,
      medications: patient.medications,
      procedures: patient.procedures,
      therapies: patient.therapies,
      tests: patient.tests,
      consentStatus: 'Yes',
      planNotes: 'Risk calculation session'
    })
  );

  const handleRecalculate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setRiskData(evaluateTreatmentPlan({
        patient,
        medications: patient.medications,
        procedures: patient.procedures,
        therapies: patient.therapies,
        tests: patient.tests,
        consentStatus: 'Yes',
        planNotes: 'Manual risk recalculation'
      }));
      setIsUpdating(false);
    }, 400);
  };

  const trendPoints = [
    { date: 'Nov 2024', score: 58 },
    { date: 'Jan 2025', score: 61 },
    { date: 'Mar 2025', score: 65 },
    { date: 'May 2025', score: riskData.overallScore }
  ];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6 text-xs">
      {/* Patient Banner */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-bold text-sm">
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
              <span>Allergies: <strong className="text-red-600">{patient.allergies.map(a => a.allergen).join(', ') || 'NKDA'}</strong></span>
              <span>•</span>
              <span>Active Problems: <strong>{patient.activeProblems.length}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRecalculate}
            disabled={isUpdating}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
            <span>Update Calculation</span>
          </button>
          <button
            onClick={onOpenOrderDispatch}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Accept Treatment & Upload to Patient Charts</span>
          </button>
        </div>
      </div>

      {/* Stepper matching risk.png */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 rounded-lg text-slate-600 font-medium">
        <div 
          onClick={() => onSelectView('home')} 
          className="cursor-pointer hover:text-blue-700 flex items-center gap-1.5"
        >
          <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-[10px]">1</span>
          <span>Home</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        <div 
          onClick={() => onSelectView('treatment-analyzer')} 
          className="cursor-pointer hover:text-blue-700 flex items-center gap-1.5"
        >
          <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-[10px]">2</span>
          <span>Treatment Analyzer</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">3</span>
          <span>Risk Calculator</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        <div 
          onClick={() => onSelectView('explainability')} 
          className="cursor-pointer hover:text-blue-700 flex items-center gap-1.5 text-slate-400"
        >
          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-[10px]">4</span>
          <span>Explainability Viewer</span>
        </div>
      </div>

      {/* Top 2 Cards: Risk Overview + Key Risk Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Overview Card matching risk.png */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              <span>Risk Overview</span>
            </h2>
            <span className="text-[10px] text-slate-400">Cardio-Diabetes Composite v2.1</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* Speedometer Gauge */}
            <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
              <div className="w-44 h-44 rounded-full border-14 border-slate-200 border-b-transparent border-l-transparent -rotate-45 relative">
                <div 
                  className={`w-full h-full rounded-full border-14 border-b-transparent border-l-transparent transition-all duration-700 ${
                    riskData.overallScore >= 70 ? 'border-red-500' :
                    riskData.overallScore >= 40 ? 'border-amber-500' : 'border-emerald-500'
                  }`}
                  style={{ transform: `rotate(${(riskData.overallScore / 100) * 180}deg)` }}
                />
              </div>
              <div className="absolute bottom-1 flex flex-col items-center">
                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{riskData.overallScore}</span>
                <span className="text-xs font-bold text-slate-500 -mt-1">/100</span>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Risk Category</span>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                  riskData.overallScore >= 70 ? 'bg-red-100 text-red-700' :
                  riskData.overallScore >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {riskData.riskCategory}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Model Confidence</span>
                <span className="font-bold text-blue-700 text-sm">78% Confidence</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Last Updated</span>
                <span className="text-slate-600">May 8, 2025 (Just now)</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
            Composite clinical risk model derived from Framingham Cardiovascular Risk, ADA Diabetes Complication Index, and Lexicomp Multi-Drug Pharmacokinetic matrices.
          </div>
        </div>

        {/* Key Risk Drivers Card matching risk.png */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <span>Key Risk Drivers</span>
            </h2>
            <button
              onClick={() => onSelectView('explainability')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Inspect Details →
            </button>
          </div>

          <div className="space-y-3">
            {riskData.keyDrivers.map((driver, idx) => (
              <div 
                key={idx}
                onClick={() => onSelectView('explainability')}
                className="p-2 rounded hover:bg-slate-50 cursor-pointer transition-colors space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-800">{driver.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      driver.impactLevel === 'High' ? 'bg-red-100 text-red-700' :
                      driver.impactLevel === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {driver.impactLevel}
                    </span>
                    <span className="font-extrabold text-slate-800">{driver.percentage}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      driver.impactLevel === 'High' ? 'bg-red-500' :
                      driver.impactLevel === 'Moderate' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${driver.percentage * 3.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Risk Factors Table matching risk.png */}
      <section className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-800 text-sm">Detailed Risk Factors Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-y border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Risk Factor</th>
                <th className="py-2.5 px-3">Patient Value</th>
                <th className="py-2.5 px-3">Model Weight / Impact</th>
                <th className="py-2.5 px-3">Clinical Status</th>
                <th className="py-2.5 px-3">Evidence Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-3 font-bold text-slate-800">Uncontrolled Hypertension</td>
                <td className="py-3 px-3 text-slate-700">{patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic} mmHg</td>
                <td className="py-3 px-3 font-semibold text-red-600">+24 points (High)</td>
                <td className="py-3 px-3">
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-semibold text-[11px]">Above Goal</span>
                </td>
                <td className="py-3 px-3 text-slate-500">Flowsheets</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-800">Diabetes (Glycemic Control)</td>
                <td className="py-3 px-3 text-slate-700">HbA1c 7.2%</td>
                <td className="py-3 px-3 font-semibold text-red-600">+18 points (High)</td>
                <td className="py-3 px-3">
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-semibold text-[11px]">Above Goal</span>
                </td>
                <td className="py-3 px-3 text-slate-500">Recent Results</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-800">Chronological Age</td>
                <td className="py-3 px-3 text-slate-700">{patient.age} years (DOB {patient.dob})</td>
                <td className="py-3 px-3 font-semibold text-amber-600">+14 points (Moderate)</td>
                <td className="py-3 px-3">
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold text-[11px]">Risk Present</span>
                </td>
                <td className="py-3 px-3 text-slate-500">Demographics</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-800">LDL Cholesterol</td>
                <td className="py-3 px-3 text-slate-700">82 mg/dL</td>
                <td className="py-3 px-3 font-semibold text-blue-600">+10 points (Moderate)</td>
                <td className="py-3 px-3">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold text-[11px]">Near Goal (&lt;70)</span>
                </td>
                <td className="py-3 px-3 text-slate-500">Recent Results</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-800">Smoking Status</td>
                <td className="py-3 px-3 text-slate-700">Current Smoker (Former heavy)</td>
                <td className="py-3 px-3 font-semibold text-slate-600">+6 points (Low)</td>
                <td className="py-3 px-3">
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold text-[11px]">Risk Present</span>
                </td>
                <td className="py-3 px-3 text-slate-500">Social History</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 2-Column Lower: Risk Over Time Trend + Risk Mitigation Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Over Time Trend matching risk.png */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 text-sm">Risk Over Time (Trend)</h2>
            <span className="text-[10px] text-slate-400">6-Month Clinical Trajectory</span>
          </div>

          <div className="h-44 w-full flex items-end justify-between px-4 pt-4 pb-2 bg-slate-50 rounded-lg border border-slate-200 relative">
            {/* Trend chart visual */}
            {trendPoints.map((pt, idx) => {
              const heightPercent = ((pt.score - 40) / 60) * 100;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 z-10">
                  <span className="font-extrabold text-slate-800 text-xs bg-white px-1.5 py-0.5 rounded shadow-2xs border border-slate-200">
                    {pt.score}
                  </span>
                  <div 
                    className="w-10 bg-gradient-to-t from-indigo-500 to-red-500 rounded-t-md transition-all duration-500" 
                    style={{ height: `${heightPercent}px` }} 
                  />
                  <span className="text-[10px] text-slate-500 font-medium">{pt.date}</span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500">
            Trajectory demonstrates an ascending risk curve (+14 points over 6 months) driven by persistent systolic hypertension and elevated HbA1c.
          </p>
        </div>

        {/* Risk Mitigation Opportunities matching risk.png */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 text-sm">Risk Mitigation Opportunities</h2>
            <span className="text-emerald-700 font-bold text-xs">-35 to -45 pts achievable</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Optimize BP Control (&lt; 130/80 mmHg)</p>
                <p className="text-slate-500 text-[11px]">Titrate Amlodipine or optimize ARB dose.</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-700 text-xs">-15 to -20 pts</span>
                <span className="block text-[10px] text-red-600 font-semibold">High Priority</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Improve Glycemic Control (A1c &lt; 7.0%)</p>
                <p className="text-slate-500 text-[11px]">Add SGLT2i or GLP-1 RA for cardiorenal protection.</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-700 text-xs">-10 to -15 pts</span>
                <span className="block text-[10px] text-red-600 font-semibold">High Priority</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Intensify Statin (Atorvastatin 40 mg)</p>
                <p className="text-slate-500 text-[11px]">Attain secondary prevention LDL &lt; 70 mg/dL.</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-700 text-xs">-5 to -10 pts</span>
                <span className="block text-[10px] text-amber-600 font-semibold">Moderate Priority</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Smoking Cessation Support</p>
                <p className="text-slate-500 text-[11px]">Enroll in behavioral counseling and nicotine replacement.</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-700 text-xs">-5 to -10 pts</span>
                <span className="block text-[10px] text-amber-600 font-semibold">Moderate Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
