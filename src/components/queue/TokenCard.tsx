
import { cn } from '@/lib/utils';
import { Token, TOKEN_STATUS_LABELS, OPD_CONFIGS } from '@/types/clinic';
import { Clock, AlertTriangle, User, Stethoscope, MoreVertical, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { useDoctorStore } from '@/stores/doctorStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from 'framer-motion';

interface TokenCardProps {
  token: Token;
  onCallNext?: () => void;
  onUpdateStatus?: (status: Token['status']) => void;
  showActions?: boolean;
}

const statusColors: Record<Token['status'], string> = {
  'registered': 'bg-slate-100 text-slate-700 border-slate-200',
  'waiting-for-vitals': 'bg-blue-50 text-blue-700 border-blue-200',
  'in-vitals': 'bg-blue-100 text-blue-800 border-blue-300',
  'waiting-for-junior': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'with-junior': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'waiting-for-consultant': 'bg-purple-50 text-purple-700 border-purple-200',
  'with-consultant': 'bg-purple-100 text-purple-800 border-purple-300',
  'sent-to-lab': 'bg-orange-50 text-orange-700 border-orange-200',
  'waiting-for-radiology': 'bg-orange-50 text-orange-700 border-orange-200',
  'in-radiology': 'bg-orange-100 text-orange-800 border-orange-300',
  'sent-to-pharmacy': 'bg-teal-50 text-teal-700 border-teal-200',
  'billing-pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'completed': 'bg-green-50 text-green-700 border-green-200',
};

export function TokenCard({ token, onCallNext, onUpdateStatus, showActions = true }: TokenCardProps) {
  const doctors = [];
  const opdConfig = OPD_CONFIGS.find(c => c.type === token.opdType);
  const assignedDoctor = null;

  const getTimeSince = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-xl border bg-white shadow-card hover:shadow-lg transition-all duration-300",
        token.priority === 'urgent' && "ring-2 ring-red-100 border-red-200 bg-red-50/10"
      )}
    >
      {/* Left Color Bar for Status */}
      <div className={cn("absolute left-0 top-3 bottom-3 w-1 rounded-r-full", statusColors[token.status].split(" ")[1].replace("text", "bg"))} />

      {/* Token Number Box */}
      <div className={cn(
        "flex h-14 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50",
        token.priority === 'urgent' && "bg-red-50 border-red-200"
      )}>
        <span className="text-[10px] font-bold uppercase text-slate-400">{opdConfig?.prefix}</span>
        <span className="font-mono text-xl font-black tracking-tighter text-slate-700">
          {token.tokenNumber.split('-')[1]}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-foreground truncate flex items-center gap-2">
            {token.patient?.firstName} {token.patient?.lastName}
            {token.priority === 'urgent' && <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">Urgent</Badge>}
          </h4>
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
            <Clock className="h-3 w-3" /> {getTimeSince(token.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="font-mono opacity-70">{token.patient?.mrNumber}</span>
          {assignedDoctor && (
            <span className="flex items-center gap-1 text-primary font-medium bg-primary/5 px-2 py-0.5 rounded">
              <Stethoscope className="h-3 w-3" /> Dr. {assignedDoctor.name.split(' ').pop()}
            </span>
          )}
        </div>

        {/* Status Pill */}
        <div className="mt-2.5 flex items-center justify-between">
          <Badge variant="outline" className={cn("capitalize font-normal", statusColors[token.status])}>
            {TOKEN_STATUS_LABELS[token.status]}
          </Badge>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onCallNext && (
                <Button size="icon" className="h-7 w-7 rounded-full shadow-md" onClick={onCallNext}>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
              {onUpdateStatus && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-slate-100">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Move to</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onUpdateStatus('sent-to-lab')}>
                      Lab
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateStatus('sent-to-pharmacy')}>
                      Pharmacy
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateStatus('billing-pending')}>
                      Billing
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
