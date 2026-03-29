import { useState } from 'react';
import { useClinicStore } from '@/stores/clinicStore';
import { OPD_CONFIGS, OPDType, TokenStatus } from '@/types/clinic';
import { TokenCard } from './TokenCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Users, Clock, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function QueueDisplay() {
  const { getTokensByOPD, getActiveTokens, updateTokenStatus } = useClinicStore();
  const [selectedOPD, setSelectedOPD] = useState<OPDType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TokenStatus | 'all'>('all');

  const tokens = selectedOPD === 'all'
    ? getActiveTokens()
    : getTokensByOPD(selectedOPD);

  const filteredTokens = statusFilter === 'all'
    ? tokens
    : tokens.filter(t => t.status === statusFilter);

  const statusCounts = tokens.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl bg-card p-4 shadow-card">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <Select value={selectedOPD} onValueChange={(v) => setSelectedOPD(v as OPDType | 'all')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select OPD" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All OPDs</SelectItem>
            {OPD_CONFIGS.map((opd) => (
              <SelectItem key={opd.type} value={opd.type}>
                <span className="flex items-center gap-2">
                  <span>{opd.icon}</span>
                  {opd.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TokenStatus | 'all')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="registered">Registered</SelectItem>
            <SelectItem value="called-vitals">Called for Vitals</SelectItem>
            <SelectItem value="with-junior">With Junior</SelectItem>
            <SelectItem value="with-consultant">With Consultant</SelectItem>
            <SelectItem value="sent-to-lab">Sent to Lab</SelectItem>
            <SelectItem value="sent-to-pharmacy">Sent to Pharmacy</SelectItem>
            <SelectItem value="billing-pending">Billing Pending</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{filteredTokens.length} patients</span>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {[
          { status: 'registered', label: 'Waiting', color: 'bg-status-waiting' },
          { status: 'called-vitals', label: 'Vitals', color: 'bg-status-in-progress' },
          { status: 'with-junior', label: 'Junior', color: 'bg-status-pending' },
          { status: 'with-consultant', label: 'Consultant', color: 'bg-primary' },
          { status: 'sent-to-lab', label: 'Lab', color: 'bg-orange-500' },
          { status: 'sent-to-pharmacy', label: 'Pharmacy', color: 'bg-teal-500' },
          { status: 'billing-pending', label: 'Billing', color: 'bg-yellow-500' },
        ].map(({ status, label, color }) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status as TokenStatus)}
            className={cn(
              "flex items-center justify-between rounded-lg border p-3 transition-all hover:shadow-md",
              statusFilter === status && "ring-2 ring-primary"
            )}
          >
            <span className="text-sm font-medium">{label}</span>
            <Badge className={cn(color, "text-white")}>
              {statusCounts[status] || 0}
            </Badge>
          </button>
        ))}
      </div>

      {/* Token List */}
      <div className="space-y-3">
        {filteredTokens.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-12 text-center">
            <Clock className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium text-muted-foreground">No patients in queue</h3>
            <p className="text-sm text-muted-foreground/70">Tokens will appear here when patients are registered</p>
          </div>
        ) : (
          filteredTokens.map((token) => (
            <TokenCard
              key={token.id}
              token={token}
              onCallNext={() => {
                const statusOrder: TokenStatus[] = [
                  'registered',
                  'waiting-for-vitals',
                  'in-vitals',
                  'waiting-for-junior',
                  'with-junior',
                  'waiting-for-consultant',
                  'with-consultant',
                  'sent-to-lab',
                  'sent-to-pharmacy',
                  'billing-pending',
                  'completed',
                ];
                const currentIndex = statusOrder.indexOf(token.status);
                if (currentIndex < statusOrder.length - 1) {
                  updateTokenStatus(token.id, statusOrder[currentIndex + 1]);
                }
              }}
              onUpdateStatus={(status) => updateTokenStatus(token.id, status)}
            />
          ))
        )}
      </div>
    </div>
  );
}
