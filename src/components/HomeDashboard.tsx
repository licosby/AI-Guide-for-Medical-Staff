import React, { useState } from 'react';
import { 
  FileEdit, 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  GitFork, 
  BarChart3, 
  Users, 
  Info, 
  Lock,
  HeartPulse,
  Plus,
  FileText,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Patient } from '../types/clinical';

interface HomeDashboardProps {
  onSelectView: (view: string) => void;
  patients: Patient[];
  activePatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  onOpenAddPatient: () => void;
  unreadCount?: number;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSelectView,
  patients,
  activePatient,
  onSelectPatient,
  onOpenAddPatient
}) => {
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);

  return (
    <div className="min-h-full bg-slate-50/60 pb-12">
      {/* Container matching HomeScreen_HiFi_WF.png */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 space-y-12">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              AI-Powered Clinical Safety & Compliance
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-lg">
              Your intelligent partner for safer treatment decisions, risk assessment, and regulatory compliance.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onSelectView('treatment-analyzer')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#2054b0] hover:bg-[#19438e] text-white text-sm sm:text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-98"
              >
                <FileEdit className="w-5 h-5" />
                <span>Analyze New Treatment Plan</span>
              </button>
            </div>
          </div>

          {/* Right Hero Graphic: Monitor Mockup with Medical Ambient Elements */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Ambient Background Graphic (Soft crosses, heart pulse, document outlines) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-60">
              <div className="absolute -top-4 right-6 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-400">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div className="absolute top-10 -left-4 w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-300">
                <Plus className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-2 right-4 w-9 h-11 border-2 border-dashed border-blue-200 rounded-lg flex items-center justify-center text-blue-300">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            {/* Monitor Frame */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-blue-100/80 z-10">
              {/* Screen Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                </div>
                <span className="text-[11px] font-medium text-slate-400">Clinical Decision Support Simulation</span>
                <span className="w-4"></span>
              </div>

              {/* 3 Cards Inside Monitor */}
              <div className="grid grid-cols-3 gap-3">
                {/* 1. Risk Score */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 text-center flex flex-col items-center justify-center">
                  <span className="text-[11px] font-bold text-slate-700 mb-2">Risk Score</span>
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500"
                        strokeDasharray="24, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-sm font-extrabold text-slate-800">2.4</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 mt-1">Low Risk</span>
                </div>

                {/* 2. Alerts */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-slate-700 text-center mb-1">Alerts</span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                      <span>1 High</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                      <span>2 Medium</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>1 Low</span>
                    </div>
                  </div>
                </div>

                {/* 3. Compliance */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 text-center flex flex-col items-center justify-center">
                  <span className="text-[11px] font-bold text-slate-700 mb-2">Compliance</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700">Compliant</span>
                </div>
              </div>
            </div>

            {/* Monitor Stand Base */}
            <div className="hidden sm:block absolute -bottom-5 w-24 h-4 bg-slate-200 rounded-t-lg z-0"></div>
          </div>
        </div>

        {/* Section Header matching HomeScreen_HiFi_WF.png */}
        <div className="pt-8 text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Powerful Tools for Safer Care
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* 6 Tool Cards Grid matching HomeScreen_HiFi_WF.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Treatment Plan Analyzer */}
          <div 
            onClick={() => onSelectView('treatment-analyzer')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileEdit className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Treatment Plan Analyzer
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Analyze patient charts, diagnoses, and treatment plans for safety and compliance risks.
                </p>
              </div>
            </div>
            <div className="pt-5">
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 2: Risk-to-Human Calculator */}
          <div 
            onClick={() => onSelectView('risk-calculator')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Risk-to-Human Calculator
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Automatically calculates risk scores based on detected issues and clinical impact.
                </p>
              </div>
            </div>
            <div className="pt-5">
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all">
                <span>View Risk Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 3: Explainability Viewer */}
          <div 
            onClick={() => onSelectView('explainability')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Explainability Viewer
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  See exactly why alerts were triggered with transparent reasoning and guideline sources.
                </p>
              </div>
            </div>
            <div className="pt-5">
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all">
                <span>View Explanations</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 4: Safe-AI Decision Tree */}
          <div 
            onClick={() => onSelectView('safe-ai')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <GitFork className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Safe-AI Decision Tree
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Interactive learning tool to understand safe vs unsafe clinical decision-making.
                </p>
              </div>
            </div>
            <div className="pt-5">
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all">
                <span>Explore Decision Tree</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 5: Reports & Analytics */}
          <div 
            onClick={() => onSelectView('reports')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                  Reports & Analytics
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  View trends, risk breakdowns, and compliance insights across patients.
                </p>
              </div>
            </div>
            <div className="pt-5">
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all">
                <span>View Reports</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 6: Patient Management */}
          <div 
            onClick={() => onSelectView('patients')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                  Patient Management
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Securely manage patient information, history, and treatment records.
                </p>
              </div>
            </div>
            <div className="pt-5">
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all">
                <span>Manage Patients</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Banner Card matching HomeScreen_HiFi_WF.png */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Built for Healthcare. Designed for Safety.
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                HIPAA-compliant • JCAHO-aligned • Clinician-approved
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowLearnMoreModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors shrink-0 shadow-2xs"
          >
            <Info className="w-4 h-4 text-blue-600" />
            <span>Learn More</span>
          </button>
        </div>

        {/* Footer matching HomeScreen_HiFi_WF.png */}
        <div className="text-center text-xs text-slate-400 pt-4">
          © 2025 HCAI Compliance Assistant. All rights reserved.
        </div>
      </div>

      {/* Learn More Modal */}
      {showLearnMoreModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>About HCAI Compliance Assistant</span>
              </h3>
              <button 
                onClick={() => setShowLearnMoreModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-slate-600 leading-relaxed text-sm">
              <p>
                <strong>HCAI Compliance Assistant</strong> is an educational and clinical decision support learning platform designed to teach healthcare professionals how to evaluate AI-generated treatment plans, detect drug interactions, navigate explainability metrics, and uphold Joint Commission safety mandates.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
                  <span className="font-bold text-blue-900 block">JCAHO NPSG Aligned</span>
                  <span className="text-slate-500 text-[11px]">Medication reconciliation & allergy cross-checking protocols</span>
                </div>
                <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <span className="font-bold text-emerald-900 block">NIST AI RMF 1.0</span>
                  <span className="text-slate-500 text-[11px]">Governed explainability, transparency, and safety guardrails</span>
                </div>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowLearnMoreModal(false)}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg text-xs hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
