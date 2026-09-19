import React from 'react';
import { Shield, PlusCircle, Search, Sparkles } from 'lucide-react';
import { Patient } from '../types/clinical';

interface HeaderProps {
  currentView: string;
  onSelectView: (view: string) => void;
  activePatient: Patient;
  onOpenAddPatient: () => void;
  onOpenFdaLookup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  activePatient,
  onOpenAddPatient,
  onOpenFdaLookup,
}) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'patients', label: 'Patients' },
    { id: 'treatment-analyzer', label: 'Treatment Plans' },
    { id: 'risk-calculator', label: 'Risk Calculator' },
    { id: 'explainability', label: 'Explainability' },
    { id: 'safe-ai', label: 'Safe-AI Learning' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 select-none shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onSelectView('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs group-hover:bg-blue-100 transition-colors">
            {/* Shield with medical cross */}
            <svg 
              className="w-6 h-6" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <line x1="12" y1="8" x2="12" y2="14" />
              <line x1="9" y1="11" x2="15" y2="11" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">HCAI</span>
            </div>
            <span className="text-xs font-medium text-slate-500 block -mt-1">Compliance Assistant</span>
          </div>
        </div>

        {/* Center Navigation Links matching HomeScreen_HiFi_WF.png */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id || 
              (item.id === 'patients' && currentView === 'patient-dashboard');

            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`relative px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-[-10px] left-3.5 right-3.5 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools (Active Patient Pill & Quick Actions) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Active Patient Indicator */}
          <div 
            onClick={() => onSelectView('patient-dashboard')}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition-colors text-xs"
            title="Current Active Patient Chart"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-800">{activePatient.name}</span>
            <span className="text-slate-400 font-mono text-[11px]">MRN {activePatient.mrn}</span>
          </div>

          <button
            onClick={onOpenFdaLookup}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
            title="FDA Regulatory Drug Labeling Lookup"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>FDA Lookup</span>
          </button>

          <button
            onClick={onOpenAddPatient}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Patient</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-100 gap-2 text-xs scrollbar-none bg-slate-50">
        {navItems.map((item) => {
          const isActive = currentView === item.id || 
            (item.id === 'patients' && currentView === 'patient-dashboard');
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`whitespace-nowrap px-2.5 py-1 rounded font-semibold transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
