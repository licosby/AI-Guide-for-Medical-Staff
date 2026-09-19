import React, { useState } from 'react';
import { X, UserPlus, Heart, AlertCircle, ShieldAlert } from 'lucide-react';
import { Patient } from '../types/clinical';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (newPatient: Patient) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onAddPatient }) => {
  const [name, setName] = useState('');
  const [mrn, setMrn] = useState(`100${Math.floor(1000 + Math.random() * 9000)}`);
  const [dob, setDob] = useState('1965-03-12');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [pcp, setPcp] = useState('Gregory House, MD');
  const [conditionsInput, setConditionsInput] = useState('Hypertension, Type 2 Diabetes');
  const [allergiesInput, setAllergiesInput] = useState('Penicillins');
  const [systolic, setSystolic] = useState('134');
  const [diastolic, setDiastolic] = useState('84');
  const [heartRate, setHeartRate] = useState('76');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Calculate age from DOB
    const birthYear = new Date(dob).getFullYear() || 1965;
    const age = new Date().getFullYear() - birthYear;

    const conditionList = conditionsInput
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    const allergyList = allergiesInput
      .split(',')
      .map(a => a.trim())
      .filter(Boolean)
      .map(allergen => ({
        allergen,
        severity: 'Moderate' as const,
        reaction: 'Documented clinical sensitivity'
      }));

    const newPatient: Patient = {
      id: `p-${Date.now()}`,
      mrn,
      name,
      dob,
      age: Math.max(18, age),
      gender,
      pcp,
      phone: '555-234-5678',
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@patientportal.org`,
      address: '742 Evergreen Terrace, Madison, WI',
      allergies: allergyList,
      conditions: conditionList,
      activeProblems: conditionList.map(c => `${c} (Active)`),
      vitals: {
        bpSystolic: parseInt(systolic) || 120,
        bpDiastolic: parseInt(diastolic) || 80,
        pulse: parseInt(heartRate) || 72,
        tempF: 98.6,
        respirations: 16,
        spo2: 98,
        heightInches: 66,
        weightLbs: 165,
        bmi: 26.6,
        recordedTime: '10:30 AM (Intake)'
      },
      medications: [
        {
          id: `m-init-1`,
          name: 'Amlodipine',
          genericName: 'amlodipine besylate',
          dose: '5 mg',
          route: 'PO (Oral)',
          frequency: 'Daily',
          category: 'Antihypertensive'
        }
      ],
      procedures: [],
      therapies: [],
      tests: [
        {
          id: `t-init-1`,
          name: 'Comprehensive Metabolic Panel (CMP)',
          type: 'Laboratory',
          urgency: 'Routine',
          department: 'Laboratory'
        }
      ],
      recentLabs: [
        { name: 'eGFR', value: '74', unit: 'mL/min/1.73m²', referenceRange: '> 60', date: 'Intake Lab' }
      ],
      encounters: [
        { date: 'Today', type: 'Initial Intake', provider: pcp, notes: 'Patient onboarded into EHR.' }
      ],
      careGaps: [
        { title: 'Baseline Annual Wellness Exam', status: 'Due Soon', action: 'Schedule with PCP' }
      ],
      careTeam: [
        { name: pcp, role: 'Primary Care Physician', specialty: 'Internal Medicine' }
      ],
      planSummary: 'Initial patient intake. Review medication history and baseline laboratory tests.'
    };

    onAddPatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden text-xs">
        {/* Header */}
        <div className="bg-[#183661] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-300" />
            <h2 className="text-base font-bold">Add New Patient to EHR (Epic System)</h2>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Patient Full Name (Last, First)</label>
              <input
                type="text"
                required
                placeholder="e.g. Miller, Sarah L."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Medical Record Number (MRN)</label>
              <input
                type="text"
                required
                value={mrn}
                onChange={(e) => setMrn(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Date of Birth</label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Primary Care Physician</label>
              <input
                type="text"
                value={pcp}
                onChange={(e) => setPcp(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Known Drug Allergies (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Penicillins, Sulfa, Contrast Media"
              value={allergiesInput}
              onChange={(e) => setAllergiesInput(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Medical Conditions / Diagnoses (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Essential Hypertension, Type 2 Diabetes, CAD"
              value={conditionsInput}
              onChange={(e) => setConditionsInput(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          {/* Vitals */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 text-[11px] block">Intake Vital Signs</span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
            >
              Save & Open Patient Chart
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
