import { cn } from '@/lib/utils';
import { TokenStatus, TOKEN_STATUS_LABELS } from '@/types/clinic';
import {
  UserPlus,
  Activity,
  Stethoscope,
  FlaskConical,
  Pill,
  CreditCard,
  CheckCircle,
  UserCheck
} from 'lucide-react';

interface WorkflowStatusProps {
  currentStatus: TokenStatus;
}

const workflowSteps = [
  { status: 'registered', icon: UserPlus, label: 'Registered' },
  { status: 'waiting-for-vitals', icon: Activity, label: 'Wait Vitals' },
  { status: 'in-vitals', icon: Activity, label: 'Vitals' },
  { status: 'waiting-for-junior', icon: UserCheck, label: 'Wait Jr.' },
  { status: 'with-junior', icon: UserCheck, label: 'Junior Dr.' },
  { status: 'waiting-for-consultant', icon: Stethoscope, label: 'Wait Cons.' },
  { status: 'with-consultant', icon: Stethoscope, label: 'Consultant' },
  { status: 'sent-to-lab', icon: FlaskConical, label: 'Lab' },
  { status: 'waiting-for-radiology', icon: FlaskConical, label: 'Wait Rad.' },
  { status: 'in-radiology', icon: FlaskConical, label: 'Radiology' },
  { status: 'sent-to-pharmacy', icon: Pill, label: 'Pharmacy' },
  { status: 'billing-pending', icon: CreditCard, label: 'Billing' },
  { status: 'completed', icon: CheckCircle, label: 'Done' },
] as const;

const getStepIndex = (status: TokenStatus): number => {
  return workflowSteps.findIndex(s => s.status === status);
};

export function WorkflowStatus({ currentStatus }: WorkflowStatusProps) {
  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-2 p-4">
        {workflowSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={step.status} className="flex items-center">
              <div
                className={cn(
                  "workflow-step relative",
                  isCurrent && "workflow-step-active",
                  isCompleted && "workflow-step-completed"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
                    isCompleted && "bg-status-completed text-white",
                    isCurrent && "bg-primary text-primary-foreground animate-pulse-glow",
                    isPending && "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "mt-1 text-xs font-medium",
                    isCompleted && "text-status-completed",
                    isCurrent && "text-primary",
                    isPending && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < workflowSteps.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-0.5 w-8 transition-colors duration-300",
                    index < currentIndex ? "bg-status-completed" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
