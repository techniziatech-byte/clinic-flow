
import { cn } from '@/lib/utils';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MotionCard } from '@/components/ui/motion-card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorClass = "bg-primary/10 text-primary",
  delay = 0
}: StatsCardProps) {
  return (
    <MotionCard delay={delay}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={cn("rounded-xl p-2.5 transition-colors", colorClass)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="flex items-end justify-between mt-4">
          <div>
            <div className="text-3xl font-bold tracking-tight">{value}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">{subtitle}</p>
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
              trend.isPositive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
            )}>
              {trend.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {trend.value}%
            </div>
          )}
        </div>
      </CardContent>
    </MotionCard>
  );
}
