import React, { useState, useEffect } from 'react';
import { CheckCircle2, Send, X, Building2, Pill, FlaskConical, Stethoscope, Activity, FileCheck, ArrowRight } from 'lucide-react';
import { Patient } from '../types/clinical';

interface OrderDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
}

export const OrderDispatchModal: React.FC<OrderDispatchModalProps> = ({ isOpen, onClose, patient }) => {
  const [stage, setStage] = useState<'dispatching' | 'confirmed'>('dispatching');
  const [completedDepartments, setCompletedDepartments] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStage('dispatching');
      setCompletedDepartments([]);

      const timer1 = setTimeout(() => setCompletedDepartments(prev => [...prev, 'pharmacy']), 400);
      const timer2 = setTimeout(() => setCompletedDepartments(prev => [...prev, 'lab']), 800);
      const timer3 = setTimeout(() => setCompletedDepartments(prev => [...prev, 'radiology']), 1200);
      const timer4 = setTimeout(() => {
        setCompletedDepartments(prev => [...prev, 'nursing']);
        setStage('confirmed');
      }, 1600);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden text-xs">
        {/* Header */}
        <div className="bg-[#183661] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold">Automated Clinical Order Dispatch Engine</h2>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              {stage === 'confirmed' ? 'Orders Dispatched Directly to Departments!' : 'Transmitting Treatment Orders across Hospital Network...'}
            </h3>
            <p className="text-slate-500 text-xs">
              Orders automatically route to pharmacy, lab, radiology, and nursing queues so clinicians and patients don't wait for clerical re-entry.
            </p>
          </div>

          {/* Department Stations */}
          <div className="space-y-3">
            {/* Pharmacy */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-xs block">Central Pharmacy Station</span>
                  <span className="text-slate-500 text-[11px]">{patient.medications.length} prescriptions queued for dispensing & barcoding</span>
                </div>
              </div>
              <div>
                {completedDepartments.includes('pharmacy') ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Dispatched</span>
                  </span>
                ) : (
                  <span className="inline-block w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
                )}
              </div>
            </div>

            {/* Central Lab */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-xs block">Clinical Pathology & Diagnostic Lab</span>
                  <span className="text-slate-500 text-[11px]">{patient.tests.filter(t => t.type === 'Laboratory').length || 2} lab requisitions added to phlebotomy worklist</span>
                </div>
              </div>
              <div>
                {completedDepartments.includes('lab') ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Dispatched</span>
                  </span>
                ) : (
                  <span className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                )}
              </div>
            </div>

            {/* Radiology */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-xs block">Radiology & Imaging Suite</span>
                  <span className="text-slate-500 text-[11px]">PACS requisition and procedure pre-authorization initiated</span>
                </div>
              </div>
              <div>
                {completedDepartments.includes('radiology') ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Dispatched</span>
                  </span>
                ) : (
                  <span className="inline-block w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></span>
                )}
              </div>
            </div>

            {/* Floor Nursing */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-xs block">Nursing eMAR & Supportive Care Unit</span>
                  <span className="text-slate-500 text-[11px]">Therapy schedules & vital sign frequency updated automatically</span>
                </div>
              </div>
              <div>
                {completedDepartments.includes('nursing') ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Dispatched</span>
                  </span>
                ) : (
                  <span className="inline-block w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                )}
              </div>
            </div>
          </div>

          {/* Efficiency Metric */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs space-y-1">
            <span className="font-bold block flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Nursing Efficiency Optimization</span>
            </span>
            <p className="text-[11px]">
              Direct hospital queue dispatch reduces manual nursing documentation time by an estimated <strong>14 minutes per encounter</strong>, eliminating re-keying errors and order transmission delays.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors text-xs"
            >
              Close & Return to Patient Chart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
