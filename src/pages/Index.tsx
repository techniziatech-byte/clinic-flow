import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { PatientRegistrationForm } from '@/components/registration/PatientRegistrationForm';
import { QueueManager } from '@/components/queue/QueueManager';
import { VitalsStation } from '@/components/vitals/VitalsStation';
import { ConsultationView } from '@/components/consultation/ConsultationView';
import { LabModule } from '@/components/lab/LabModule';
import { PharmacyModule } from '@/components/pharmacy/PharmacyModule';
import { BillingModule } from '@/components/billing/BillingModule';
import { DepartmentList } from '@/components/departments/DepartmentList';
import { DepartmentDetail } from '@/components/departments/DepartmentDetail';
import { RadiologyModule } from '@/components/radiology/RadiologyModule';
import { GynecologyOPD } from '@/components/opd/GynecologyOPD';
import { PediatricsOPD } from '@/components/opd/PediatricsOPD';
import { ENTOPD } from '@/components/opd/ENTOPD';
import { DentalOPD } from '@/components/opd/DentalOPD';
import { GeneralMedicineOPD } from '@/components/opd/GeneralMedicineOPD';
import { CardiologyOPD } from '@/components/opd/CardiologyOPD';
import { cn } from '@/lib/utils';
import { DoctorList } from '@/components/doctors/DoctorList';
import { Settings } from 'lucide-react';
// import { useClinicStore } from '@/stores/clinicStore'; // Disabled to avoid store errors
// import { useDoctorStore } from '@/stores/doctorStore'; // Disabled to avoid store errors
// import { useLabStore } from '@/stores/labStore'; // Disabled
// import { usePharmacyStore } from '@/stores/pharmacyStore'; // Disabled
// import { useRadiologyStore } from '@/stores/radiologyStore'; // Disabled
// import { useDepartmentStore } from '@/stores/departmentStore'; // Disabled

const sectionTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of clinic operations' },
  registration: { title: 'Patient Registration', subtitle: 'Register new patients and generate tokens' },
  doctors: { title: 'Doctor Management', subtitle: 'Manage doctors available in OPDs' },
  queue: { title: 'Queue Management', subtitle: 'Monitor and manage patient queues' },

  consultation: { title: 'Consultation', subtitle: 'Doctor consultation panel' },
  'opd-dermatology': { title: 'Dermatology OPD', subtitle: 'Skin health and dermatology services' },
  lab: { title: 'Laboratory', subtitle: 'Process lab orders and results' },
  radiology: { title: 'Radiology', subtitle: 'Imaging appointments and reports' },
  pharmacy: { title: 'Pharmacy', subtitle: 'Dispense medications' },
  billing: { title: 'Billing', subtitle: 'Process payments' },
  settings: { title: 'Settings', subtitle: 'System configuration' },
};

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize all stores from Supabase
// const initClinic = useClinicStore(s => s.initialize); // Disabled
  // const cleanupClinic = useClinicStore(s => s.cleanup);
  // const initDoctors = useDoctorStore(s => s.initialize);
  // const initLab = useLabStore(s => s.initialize);
  // const initPharmacy = usePharmacyStore(s => s.initialize);
  // const initRadiology = useRadiologyStore(s => s.initialize);
  // const initDepartments = useDepartmentStore(s => s.initialize);

  useEffect(() => {
  // initClinic();
    // initDoctors();
    // initLab();
    // initPharmacy();
    // initRadiology();
    // initDepartments();
    // return () => cleanupClinic();
  }, []);

  useEffect(() => {
    const path = location.pathname.substring(1); // remove leading slash
    if (path === '' || path === 'dashboard') {
      setActiveSection('dashboard');
    } else if (path.startsWith('departments')) {
      setActiveSection('departments');
    } else {
      setActiveSection(path);
    }
  }, [location]);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    navigate(`/${section}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} />;
      case 'registration':
        return <div className="p-6"><PatientRegistrationForm /></div>;
      case 'doctors':
        return <div className="p-6"><DoctorList /></div>;
      case 'queue':
        return <QueueManager />;

      case 'consultation':
        return <ConsultationView />;
      case 'opd-dermatology':
        return <div className="p-6">
          <h1 className="text-3xl font-bold">Dermatology OPD</h1>
          <p>Dermatology consultations and procedures.</p>
        </div>;
      case 'lab':
        return <LabModule />;
      case 'pharmacy':
        return <PharmacyModule />;
      case 'radiology':
        return <RadiologyModule />;
      case 'billing':
        return <BillingModule />;
      case 'departments':
        return window.location.pathname.includes('/departments/') ? <DepartmentDetail /> : <DepartmentList />;
      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Settings className="mb-4 h-16 w-16 text-muted-foreground/30" />
            <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
            <p className="mt-2 text-muted-foreground">System configuration coming soon</p>
          </div>
        );
      default:
        return <DashboardView onNavigate={handleNavigate} />;
    }
  };

  const sectionInfo = sectionTitles[activeSection] || sectionTitles.dashboard;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleNavigate}
      />

      <main className={cn(
        "transition-all duration-300",
        "ml-64" // Sidebar width
      )}>
        <Header title={sectionInfo.title} subtitle={sectionInfo.subtitle} />
        <div className="min-h-[calc(100vh-4rem)]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
