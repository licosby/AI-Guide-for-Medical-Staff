import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  ChevronDown, 
  UserCheck, 
  X, 
  AlertTriangle, 
  Heart, 
  Stethoscope, 
  Check, 
  ArrowRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Patient } from '../types/clinical';

export interface PatientSelectorProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient) => void;
  onClearPatient?: () => void;
  className?: string;
  showCardListWhenUnselected?: boolean;
}

export const PatientSelector: React.FC<PatientSelectorProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onClearPatient,
  className = '',
  showCardListWhenUnselected = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter patients based on query
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    const q = searchQuery.toLowerCase();
    return patients.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.mrn.includes(q) ||
        p.conditions.some(c => c.toLowerCase().includes(q)) ||
        p.gender.toLowerCase().startsWith(q)
    );
  }, [patients, searchQuery]);

  const handleSelect = (patient: Patient) => {
    onSelectPatient(patient);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Selector Bar */}
      <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-sm transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left Title & Status */}
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
              selectedPatient ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}>
              {selectedPatient ? (
                selectedPatient.name.slice(0, 2).toUpperCase()
              ) : (
                <Users className="w-5 h-5 text-slate-500" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {selectedPatient ? 'Active Analysis Patient' : 'Patient Selection'}
                </span>
                {selectedPatient ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Loaded
                  </span>
                ) : (
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Required
                  </span>
                )}
              </div>

              {selectedPatient ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900">{selectedPatient.name}</span>
                  <span className="text-xs font-mono text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                    MRN {selectedPatient.mrn}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedPatient.age}yo {selectedPatient.gender}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-600 font-medium">
                  Select a patient to load their treatment plan, clinical rules & risk scores
                </p>
              )}
            </div>
          </div>

          {/* Right Selector Controls */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {/* Quick Native Dropdown for instant selection */}
            <div className="relative flex-1 sm:w-64">
              <select
                aria-label="Select patient from dropdown"
                value={selectedPatient ? selectedPatient.id : ''}
                onChange={(e) => {
                  const p = patients.find(pat => pat.id === e.target.value);
                  if (p) handleSelect(p);
                }}
                className={`w-full bg-white border rounded-lg px-3 py-2 text-xs font-medium text-slate-800 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer ${
                  selectedPatient 
                    ? 'border-slate-300 hover:border-slate-400' 
                    : 'border-blue-400 ring-2 ring-blue-100 text-blue-900 bg-blue-50/20'
                }`}
              >
                <option value="" disabled={!!selectedPatient}>
                  {selectedPatient ? '-- Switch Patient --' : '-- Choose Patient to Analyze --'}
                </option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (MRN: {p.mrn}) • {p.age}yo {p.gender}
                  </option>
                ))}
              </select>
            </div>

            {/* Change / Browse Modal or Dropdown Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 shrink-0 ${
                isOpen 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                  : selectedPatient
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                    : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{isOpen ? 'Close Census' : selectedPatient ? 'Switch Patient' : 'Select Patient'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Clear Button if a patient is selected */}
            {selectedPatient && onClearPatient && (
              <button
                type="button"
                onClick={onClearPatient}
                title="Unload patient & return to selector"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Census Browser Panel */}
        {isOpen && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patient by name, MRN, diagnosis, or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filtered Patient List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredPatients.length === 0 ? (
                <div className="col-span-full py-6 text-center text-slate-400 text-xs">
                  No matching patients found for "{searchQuery}".
                </div>
              ) : (
                filteredPatients.map(patient => {
                  const isCurrent = selectedPatient?.id === patient.id;
                  return (
                    <div
                      key={patient.id}
                      onClick={() => handleSelect(patient)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-blue-50/80 border-blue-400 shadow-2xs ring-1 ring-blue-400/40'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {patient.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-900 text-xs truncate max-w-[140px]">
                            {patient.name}
                          </span>
                        </div>
                        {isCurrent ? (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400 font-semibold">
                            MRN {patient.mrn}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mb-2">
                        <span>{patient.age}y / {patient.gender}</span>
                        <span>•</span>
                        <span>BP {patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic}</span>
                      </div>

                      {/* Conditions tags */}
                      <div className="flex flex-wrap gap-1">
                        {patient.conditions.slice(0, 2).map((c, i) => (
                          <span key={i} className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {c}
                          </span>
                        ))}
                        {patient.conditions.length > 2 && (
                          <span className="text-[9px] text-slate-400 font-medium">
                            +{patient.conditions.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Optional Card List for unselected state */}
      {showCardListWhenUnselected && !selectedPatient && (
        <PatientCardList
          patients={patients}
          onSelectPatient={handleSelect}
        />
      )}
    </div>
  );
};

export interface PatientCardListProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  className?: string;
}

export const PatientCardList: React.FC<PatientCardListProps> = ({
  patients,
  onSelectPatient,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Available Clinical Profiles ({patients.length})
        </h3>
        <span className="text-[11px] text-slate-400">Click any profile to load into Treatment Analyzer</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map(patient => (
          <div
            key={patient.id}
            onClick={() => onSelectPatient(patient)}
            className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors">
                    {patient.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                      {patient.name}
                    </h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="font-mono font-semibold">MRN {patient.mrn}</span>
                      <span>•</span>
                      <span>{patient.age}y / {patient.gender}</span>
                    </div>
                  </div>
                </div>

                {patient.allergies.length > 0 && (
                  <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    {patient.allergies.length} Allerg{patient.allergies.length === 1 ? 'y' : 'ies'}
                  </span>
                )}
              </div>

              {/* Conditions */}
              <div className="space-y-1.5 my-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Diagnoses & Conditions
                </span>
                <div className="flex flex-wrap gap-1">
                  {patient.conditions.map((condition, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-800 text-[10px] font-medium rounded-md transition-colors"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Vitals & Regimen Summary */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                <div>
                  <span className="block text-slate-400">Vitals BP</span>
                  <strong className="text-slate-700">{patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic}</strong>
                </div>
                <div>
                  <span className="block text-slate-400">Medications</span>
                  <strong className="text-slate-700">{patient.medications.length} active</strong>
                </div>
                <div>
                  <span className="block text-slate-400">Problems</span>
                  <strong className="text-slate-700">{patient.activeProblems.length} active</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectPatient(patient);
              }}
              className="w-full mt-2 py-2 px-3 bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
            >
              <span>Load Into Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
