
import { OPDConfig, Token } from '@/types/clinic';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface OPDCardProps {
  config: OPDConfig;
  tokens: Token[];
  onClick?: () => void;
}

export function OPDCard({ config, tokens, onClick }: OPDCardProps) {
  const waitingCount = tokens.length;
  const isBusy = waitingCount > 5;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300",
        "bg-white hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50"
      )}
    >

      {/* Decorative Background Icon */}
      <div className="absolute -right-6 -bottom-6 text-[100px] opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-10 transition-all duration-500 rotate-12 pointer-events-none">
        {config.icon}
      </div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ring-1 ring-inset ring-black/5 bg-gradient-to-br from-white to-slate-50",
          `text-${config.color}`
        )}>
          {config.icon}
        </div>
        {waitingCount > 0 && (
          <span className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
            isBusy ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
          )}>
            <span className={cn("relative flex h-2 w-2")}>
              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isBusy ? "bg-red-500" : "bg-emerald-500")}></span>
              <span className={cn("relative inline-flex rounded-full h-2 w-2", isBusy ? "bg-red-500" : "bg-emerald-500")}></span>
            </span>
            {waitingCount} Waiting
          </span>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{config.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">Consultation Fee: <span className="font-medium text-foreground">PKR {config.consultationFee}</span></p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
        <div className="flex -space-x-2">
          {[...Array(Math.min(3, waitingCount))].map((_, i) => (
            <div key={i} className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
              <Users className="h-3 w-3" />
            </div>
          ))}
          {waitingCount > 3 && (
            <div className="h-8 w-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
              +{waitingCount - 3}
            </div>
          )}
        </div>
        <div className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
          View Queue →
        </div>
      </div>
    </motion.div>
  );
}
