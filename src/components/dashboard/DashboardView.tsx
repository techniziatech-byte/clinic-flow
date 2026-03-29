
// import { useClinicStore } from '@/stores/clinicStore';
// import { useDoctorStore } from '@/stores/doctorStore';
import { OPD_CONFIGS } from '@/types/clinic';
import { StatsCard } from './StatsCard';
import { OPDCard } from './OPDCard';
import { WorkflowStatus } from './WorkflowStatus';
import { TokenCard } from '@/components/queue/TokenCard';
import { Users, Clock, Stethoscope, CreditCard, Activity, TrendingUp } from 'lucide-react';
import { MotionContainer, MotionSection } from '@/components/ui/motion-card';

interface DashboardViewProps {
  onNavigate: (section: string) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const patients = []; // Fallback
  const doctors = []; // Fallback

  const activeDoctors = doctors.filter(d => d.status === 'active');
  const activeTokens = [];
  const todayPatients = patients.length;
  const waitingTokens = [];
  const latestTokens = activeTokens.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <MotionContainer
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 p-6 max-w-[1600px] mx-auto"
    >
      {/* Welcome Section */}
      <MotionSection variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 to-cyan-600 p-8 text-white shadow-xl shadow-teal-900/10">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">Good Morning, Dr. Ayesha</h1>
          <p className="mt-2 text-blue-50/90 max-w-xl text-lg">
            You have {activeTokens.length} active patients in the system today. The clinic is running smoothly with an average wait time of 12 mins.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      </MotionSection>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Registrations"
          value={todayPatients}
          subtitle="New patients today"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          delay={0.1}
          colorClass="bg-blue-500/10 text-blue-600"
        />
        <StatsCard
          title="Active Doctors"
          value={activeDoctors.length}
          subtitle="Checked in now"
          icon={Stethoscope}
          trend={{ value: 100, isPositive: true }}
          delay={0.2}
          colorClass="bg-emerald-500/10 text-emerald-600"
        />
        <StatsCard
          title="Waiting Queue"
          value={waitingTokens.length}
          subtitle="Pending consultation"
          icon={Clock}
          trend={{ value: 5, isPositive: false }}
          delay={0.3}
          colorClass="bg-amber-500/10 text-amber-600"
        />
        <StatsCard
          title="Revenue Generated"
          value="PKR 24,500"
          subtitle="Total billing today"
          icon={CreditCard}
          trend={{ value: 18, isPositive: true }}
          delay={0.4}
          colorClass="bg-violet-500/10 text-violet-600"
        />
      </div>

      {/* OPD Department Cards */}
      <MotionSection variants={itemVariants}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Live OPD Status</h2>
            <p className="text-muted-foreground text-sm">Real-time patient distribution across departments</p>
          </div>
          <button
            onClick={() => onNavigate('queue')}
            className="group flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View Full Queue
            <span className="block transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {OPD_CONFIGS.map((config) => (
            <OPDCard
              key={config.type}
              config={config}
              tokens={[]}
              onClick={() => onNavigate('queue')}
            />
          ))}
        </div>
      </MotionSection>

      {/* Workflow & Recent Tokens */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Workflow Preview */}
        <MotionSection variants={itemVariants} className="rounded-3xl bg-white p-8 shadow-card border border-slate-100">
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Patient Journey</h3>
          </div>
          <WorkflowStatus currentStatus="with-consultant" />
          <p className="mt-6 text-sm text-muted-foreground bg-slate-50 p-4 rounded-xl border border-slate-100/50">
            Currently tracking a patient in <strong>Consultation</strong>. Next step is Pharmacy or Lab based on doctor orders.
          </p>
        </MotionSection>

        {/* Recent Queue Activity */}
        <MotionSection variants={itemVariants} className="rounded-3xl bg-white p-8 shadow-card border border-slate-100">
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Live Queue Updates</h3>
          </div>
          <div className="space-y-4">
            {latestTokens.length > 0 ? (
              latestTokens.map((token) => (
                <TokenCard key={token.id} token={token} showActions={false} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/60 border-2 border-dashed rounded-xl bg-slate-50/50">
                <Users className="h-10 w-10 mb-2 opacity-20" />
                <p>No active patients right now</p>
              </div>
            )}
          </div>
        </MotionSection>
      </div>
    </MotionContainer>
  );
}
