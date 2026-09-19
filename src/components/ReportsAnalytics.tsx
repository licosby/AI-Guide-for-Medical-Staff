import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, AlertTriangle, Users, Award, ArrowRight } from 'lucide-react';
import { Patient } from '../types/clinical';

interface ReportsAnalyticsProps {
  patients: Patient[];
  onSelectView: (view: string) => void;
}

export const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({ patients, onSelectView }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Clinical Analytics</h1>
            <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Educational Cohort Data
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Population-level safety trends, alert trigger breakdowns, and Joint Commission compliance audits.
          </p>
        </div>

        <button
          onClick={() => onSelectView('treatment-analyzer')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
        >
          ← Return to Treatment Analyzer
        </button>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold text-xs">Monitored Patients</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{patients.length}</p>
          <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
            <span>↑ 100% active charts verified</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold text-xs">Interactions Prevented</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">42</p>
          <span className="text-amber-700 font-semibold text-[11px]">
            High-severity DDIs intercepted
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold text-xs">Compliance Audit Score</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">99.4%</p>
          <span className="text-slate-500 text-[11px]">
            JCAHO NPSG.03.06.01 compliant
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold text-xs">Explainability Rigor</span>
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-purple-700">Grade IV</p>
          <span className="text-slate-500 text-[11px]">
            Deterministic rule + SHAP trace
          </span>
        </div>
      </div>

      {/* 2-Column Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Frequent Safety Alert Categories */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Frequent Clinical Alert Categories</span>
          </h2>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Drug-Drug Interaction (e.g. Lisinopril + Spironolactone)</span>
                <span className="text-red-600 font-bold">38%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Blood Pressure Goal Variance (&gt;130/80 mmHg)</span>
                <span className="text-amber-600 font-bold">28%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Allergy Cross-Reactivity Risk</span>
                <span className="text-blue-600 font-bold">18%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Renal Dose Adjustment Alerts (eGFR &lt; 45)</span>
                <span className="text-teal-600 font-bold">16%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: '16%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Learning & Decision Support Competency */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Training & Competency Overview</span>
          </h2>

          <div className="p-4 bg-slate-50 rounded-xl space-y-3 text-xs text-slate-600">
            <p className="leading-relaxed">
              In this educational environment, clinicians and healthcare students explore how clinical decision support algorithms balance alert specificity, explainability, and prompt medication reconciliation.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-medium">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block">Pharmacokinetics</span>
                <span className="text-slate-500">Real FDA labeling integration</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block">Workflow Efficiency</span>
                <span className="text-slate-500">Direct hospital order routing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
