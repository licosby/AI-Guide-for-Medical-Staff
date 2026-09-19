import React from 'react';
import { 
  Heart, 
  Activity, 
  Pill, 
  FileCheck, 
  Calendar, 
  ShieldAlert, 
  UserCheck, 
  Clock, 
  AlertCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { Patient } from '../types/clinical';

interface PatientDashboardProps {
  patient: Patient;
  onSelectView: (view: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ patient, onSelectView }) => {
  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Patient Header Banner matching patient-dashboard.png */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
              {patient.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{patient.name}</h1>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded font-mono">
                  MRN {patient.mrn}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>DOB: {patient.dob} ({patient.age}y)</span>
                <span>Gender: {patient.gender}</span>
                <span>PCP: <strong className="text-slate-700">{patient.pcp}</strong></span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {patient.phone}</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {patient.email}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {patient.address}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectView('treatment-analyzer')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Treatment Analyzer</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectView('risk-calculator')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              <span>Risk Calculator</span>
            </button>
          </div>
        </div>

        {/* Banner Details: Allergies, Health Summary, Care Team */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
          {/* Allergies Chips */}
          <div>
            <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1.5">Documented Allergies</span>
            <div className="flex flex-wrap gap-1.5">
              {patient.allergies.length > 0 ? (
                patient.allergies.map((allg, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200 font-medium"
                    title={`Reaction: ${allg.reaction}`}
                  >
                    <ShieldAlert className="w-3 h-3 text-red-500" />
                    <span>{allg.allergen}</span>
                    <span className="text-[10px] opacity-75">({allg.reaction})</span>
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">No Known Drug Allergies (NKDA)</span>
              )}
            </div>
          </div>

          {/* Health Summary / Diagnoses */}
          <div>
            <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1.5">Health Summary</span>
            <div className="flex flex-wrap gap-1.5">
              {patient.conditions.map((cond, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium border border-slate-200">
                  {cond}
                </span>
              ))}
            </div>
          </div>

          {/* Care Team */}
          <div>
            <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1.5">Care Team</span>
            <div className="space-y-1">
              {patient.careTeam.map((member, idx) => (
                <div key={idx} className="text-slate-700">
                  <span className="font-semibold">{member.name}</span> — <span className="text-slate-500">{member.specialty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid matching patient-dashboard.png */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        {/* Card 1: Vital Signs */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Vital Signs</span>
            </h2>
            <span className="text-[10px] text-slate-400">{patient.vitals.recordedTime}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 text-[11px]">Blood Pressure</span>
              <p className="text-base font-bold text-slate-800">{patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic} <span className="text-xs font-normal text-slate-500">mmHg</span></p>
              <span className="text-[10px] text-amber-600 font-medium">Stage 1 HTN</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 text-[11px]">Heart Rate / Pulse</span>
              <p className="text-base font-bold text-slate-800">{patient.vitals.pulse} <span className="text-xs font-normal text-slate-500">bpm</span></p>
              <span className="text-[10px] text-emerald-600 font-medium">Normal Sinus</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 text-[11px]">Temperature</span>
              <p className="text-base font-bold text-slate-800">{patient.vitals.tempF}°F <span className="text-xs font-normal text-slate-500">Oral</span></p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 text-[11px]">Oxygen Saturation</span>
              <p className="text-base font-bold text-slate-800">{patient.vitals.spo2}% <span className="text-xs font-normal text-slate-500">Room Air</span></p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 text-[11px]">Height & Weight</span>
              <p className="text-xs font-bold text-slate-800">{patient.vitals.heightInches}" / {patient.vitals.weightLbs} lbs</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 text-[11px]">Body Mass Index (BMI)</span>
              <p className="text-base font-bold text-slate-800">{patient.vitals.bmi} <span className="text-xs font-normal text-slate-500">kg/m²</span></p>
            </div>
          </div>
        </div>

        {/* Card 2: Current Medications */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>Current Medications ({patient.medications.length})</span>
            </h2>
            <button 
              onClick={() => onSelectView('treatment-analyzer')}
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              Analyze
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
            {patient.medications.map((med) => (
              <div key={med.id} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{med.name} {med.dose}</p>
                  <p className="text-slate-500 text-[11px]">{med.route} • {med.frequency}</p>
                </div>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
                  {med.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Recent Lab Results */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-purple-600" />
              <span>Recent Results</span>
            </h2>
            <span className="text-[10px] text-slate-400">Flowsheets</span>
          </div>

          <div className="space-y-2">
            {patient.recentLabs.map((lab, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <div>
                  <span className="font-semibold text-slate-800">{lab.name}</span>
                  <span className="text-slate-400 text-[10px] block">Ref: {lab.referenceRange}</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${lab.isAbnormal ? 'text-red-600' : 'text-slate-800'}`}>
                    {lab.value} {lab.unit}
                  </span>
                  {lab.isAbnormal && <span className="text-[10px] text-red-500 font-bold block">Abnormal</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Recent Encounters */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Recent Encounters</span>
            </h2>
          </div>

          <div className="space-y-2.5">
            {patient.encounters.map((enc, idx) => (
              <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-100 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{enc.type}</span>
                  <span className="text-[10px] text-slate-400">{enc.date}</span>
                </div>
                <p className="text-slate-600 text-[11px]">Provider: {enc.provider}</p>
                {enc.notes && <p className="text-slate-500 text-[10px] italic">"{enc.notes}"</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Card 5: Care Gaps */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Care Gaps & Quality Measures</span>
            </h2>
          </div>

          <div className="space-y-2">
            {patient.careGaps.map((gap, idx) => (
              <div key={idx} className="p-2.5 rounded border border-slate-100 bg-slate-50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{gap.title}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    gap.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {gap.status}
                  </span>
                </div>
                <p className="text-slate-500 text-[10px]">{gap.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Card 6: Clinical Summary & Active Problems */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Clinical Summary & Plan</span>
            </h2>
          </div>

          <div className="space-y-2">
            <div>
              <span className="font-bold text-slate-600 text-[11px] block mb-1">Active Problems:</span>
              <ul className="list-disc pl-4 text-slate-700 space-y-0.5 text-[11px]">
                {patient.activeProblems.map((prob, idx) => (
                  <li key={idx}>{prob}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-600 text-[11px] block mb-1">Assessment & Plan:</span>
              <p className="text-slate-600 text-[11px] leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                {patient.planSummary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
