import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { PatientManagement } from './components/PatientManagement';
import { PatientDashboard } from './components/PatientDashboard';
import { TreatmentAnalyzer } from './components/TreatmentAnalyzer';
import { RiskCalculator } from './components/RiskCalculator';
import { ExplainabilityViewer } from './components/ExplainabilityViewer';
import { SafeAiSuite } from './components/SafeAiSuite';
import { ReportsAnalytics } from './components/ReportsAnalytics';
import { AddPatientModal } from './components/AddPatientModal';
import { OrderDispatchModal } from './components/OrderDispatchModal';
import { LiveFdaLookupModal } from './components/LiveFdaLookupModal';
import { INITIAL_PATIENTS } from './data/mockPatients';
import { Patient } from './types/clinical';

export function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [activePatient, setActivePatient] = useState<Patient>(INITIAL_PATIENTS[0]);

  // Modals
  const [isAddPatientOpen, setIsAddPatientOpen] = useState<boolean>(false);
  const [isOrderDispatchOpen, setIsOrderDispatchOpen] = useState<boolean>(false);
  const [isFdaLookupOpen, setIsFdaLookupOpen] = useState<boolean>(false);

  const handleSelectPatient = (patient: Patient) => {
    setActivePatient(patient);
  };

  const handleAddPatient = (newPatient: Patient) => {
    setPatients([newPatient, ...patients]);
    setActivePatient(newPatient);
    setCurrentView('patient-dashboard');
  };

  const handleUpdatePatient = (updated: Patient) => {
    setActivePatient(updated);
    setPatients(patients.map(p => p.id === updated.id ? updated : p));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900">
      {/* Light Top Header matching HomeScreen_HiFi_WF.png */}
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        activePatient={activePatient}
        onOpenAddPatient={() => setIsAddPatientOpen(true)}
        onOpenFdaLookup={() => setIsFdaLookupOpen(true)}
      />

      {/* Main Full-Width Content (No Left Sidebar) */}
      <main className="flex-1 w-full overflow-y-auto">
        {currentView === 'home' && (
          <HomeDashboard
            onSelectView={setCurrentView}
            patients={patients}
            activePatient={activePatient}
            onSelectPatient={handleSelectPatient}
            onOpenAddPatient={() => setIsAddPatientOpen(true)}
          />
        )}

        {currentView === 'patients' && (
          <PatientManagement
            patients={patients}
            activePatient={activePatient}
            onSelectPatient={handleSelectPatient}
            onSelectView={setCurrentView}
            onOpenAddPatient={() => setIsAddPatientOpen(true)}
          />
        )}

        {currentView === 'patient-dashboard' && (
          <PatientDashboard
            patient={activePatient}
            onSelectView={setCurrentView}
          />
        )}

        {currentView === 'treatment-analyzer' && (
          <TreatmentAnalyzer
            patients={patients}
            onSelectPatient={handleSelectPatient}
            patient={activePatient}
            onUpdatePatient={handleUpdatePatient}
            onOpenOrderDispatch={() => setIsOrderDispatchOpen(true)}
            onSelectView={setCurrentView}
          />
        )}

        {currentView === 'risk-calculator' && (
          <RiskCalculator
            patient={activePatient}
            onSelectView={setCurrentView}
            onOpenOrderDispatch={() => setIsOrderDispatchOpen(true)}
          />
        )}

        {currentView === 'explainability' && (
          <ExplainabilityViewer
            patient={activePatient}
            onSelectView={setCurrentView}
          />
        )}

        {currentView === 'safe-ai' && (
          <SafeAiSuite
            patient={activePatient}
            onSelectView={setCurrentView}
          />
        )}

        {currentView === 'reports' && (
          <ReportsAnalytics
            patients={patients}
            onSelectView={setCurrentView}
          />
        )}
      </main>

      {/* Modals */}
      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        onAddPatient={handleAddPatient}
      />

      <OrderDispatchModal
        isOpen={isOrderDispatchOpen}
        onClose={() => setIsOrderDispatchOpen(false)}
        patient={activePatient}
      />

      <LiveFdaLookupModal
        isOpen={isFdaLookupOpen}
        onClose={() => setIsFdaLookupOpen(false)}
      />
    </div>
  );
}

export default App;
