import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  ArrowRight, 
  ShieldAlert, 
  Activity, 
  FileText, 
  Heart,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Patient } from '../types/clinical';

interface PatientManagementProps {
  patients: Patient[];
  activePatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  onSelectView: (view: string) => void;
  onOpenAddPatient: () => void;
}

export const PatientManagement: React.FC<PatientManagementProps> = ({
  patients,
  activePatient,
  onSelectPatient,
  onSelectView,
  onOpenAddPatient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');

  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrn.includes(searchTerm) ||
      p.conditions.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterTag === 'high-risk') {
      return matchesSearch && (p.conditions.includes('Atherosclerotic CAD') || p.vitals.bpSystolic >= 140);
    }
    if (filterTag === 'diabetes') {
      return matchesSearch && p.conditions.some(c => c.toLowerCase().includes('diabetes'));
    }
    if (filterTag === 'allergies') {
      return matchesSearch && p.allergies.length > 0;
    }
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Management</h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {patients.length} Clinical Profiles
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Browse complete patient histories, inspect baseline labs, and initiate clinical safety analyses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddPatient}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Patient</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, MRN, diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Patients' },
            { id: 'high-risk', label: 'High Risk' },
            { id: 'diabetes', label: 'Diabetes' },
            { id: 'allergies', label: 'Documented Allergies' }
          ].map(tag => (
            <button
              key={tag.id}
              onClick={() => setFilterTag(tag.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${
                filterTag === tag.id
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patients List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatients.map((p) => {
          const isActive = p.id === activePatient.id;
          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl p-5 border transition-all space-y-4 ${
                isActive 
                  ? 'border-blue-500 shadow-sm ring-1 ring-blue-500/20' 
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">{p.name}</span>
                      {isActive && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                          Active Chart
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-semibold">MRN {p.mrn}</span>
                      <span>•</span>
                      <span>{p.gender}, {p.age} yrs</span>
                      <span>•</span>
                      <span>DOB: {p.dob}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conditions & Allergies */}
              <div className="space-y-2 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Diagnoses:</span>
                  <div className="flex flex-wrap gap-1">
                    {p.conditions.map((c, i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Allergies:</span>
                  <div className="flex flex-wrap gap-1">
                    {p.allergies.length > 0 ? (
                      p.allergies.map((a, i) => (
                        <span key={i} className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[11px] font-medium">
                          ⚠️ {a.allergen} ({a.reaction})
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">No known drug allergies (NKDA)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Vitals Summary */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                  <span className="font-bold text-slate-800">{p.vitals.bpSystolic}/{p.vitals.bpDiastolic} mmHg</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Heart Rate</span>
                  <span className="font-bold text-slate-800">{p.vitals.pulse} bpm</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Active Meds</span>
                  <span className="font-bold text-blue-700">{p.medications.length} items</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    onSelectPatient(p);
                    onSelectView('patient-dashboard');
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                >
                  View Full Chart
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectPatient(p);
                      onSelectView('risk-calculator');
                    }}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg text-xs transition-colors"
                  >
                    Risk Score
                  </button>
                  <button
                    onClick={() => {
                      onSelectPatient(p);
                      onSelectView('treatment-analyzer');
                    }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <span>Analyze Plan</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
