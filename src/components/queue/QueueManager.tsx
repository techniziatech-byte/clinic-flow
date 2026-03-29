
import { useState } from 'react';
import { useClinicStore } from '@/stores/clinicStore';
import { useDoctorStore } from '@/stores/doctorStore';
import { OPD_CONFIGS, OPDType, TokenStatus, TOKEN_STATUS_LABELS } from '@/types/clinic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, Play, Pause, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function QueueManager() {
    const { tokens, updateTokenStatus, patients } = useClinicStore();
    const { doctors } = useDoctorStore();
    const [selectedOPD, setSelectedOPD] = useState<OPDType | 'all'>('all');

    // Grouping Logic (Simplified for brevity)
    const waitingForVitals = tokens.filter(t => t.status === 'registered' || t.status === 'waiting-for-vitals');
    const inVitals = tokens.filter(t => t.status === 'in-vitals');
    const waitingForJunior = tokens.filter(t => t.status === 'waiting-for-junior');
    const withJunior = tokens.filter(t => t.status === 'with-junior');
    const waitingForConsultant = tokens.filter(t => t.status === 'waiting-for-consultant');
    const withConsultant = tokens.filter(t => t.status === 'with-consultant');
    const inLab = tokens.filter(t => t.status === 'sent-to-lab' || t.status === 'waiting-for-radiology' || t.status === 'in-radiology');
    const inPharmacy = tokens.filter(t => t.status === 'sent-to-pharmacy');
    const inBilling = tokens.filter(t => t.status === 'billing-pending');

    const handleNextStage = (tokenId: string, currentStatus: TokenStatus) => {
        let nextStatus: TokenStatus = currentStatus;
        switch (currentStatus) {
            case 'registered': nextStatus = 'waiting-for-vitals'; break;
            case 'waiting-for-vitals': nextStatus = 'in-vitals'; break;
            case 'in-vitals': nextStatus = 'waiting-for-junior'; break;
            case 'waiting-for-junior': nextStatus = 'with-junior'; break;
            case 'with-junior': nextStatus = 'waiting-for-consultant'; break;
            case 'waiting-for-consultant': nextStatus = 'with-consultant'; break;
            case 'with-consultant': nextStatus = 'billing-pending'; break;
            default: return;
        }
        updateTokenStatus(tokenId, nextStatus);
        toast.success(`Token moved to ${TOKEN_STATUS_LABELS[nextStatus]}`);
    };

    const QueueColumn = ({ title, items, color = "bg-slate-50", onNext }: { title: string, items: typeof tokens, color?: string, onNext?: (id: string) => void }) => (
        <div className="flex flex-col h-full min-w-[280px] max-w-[320px] rounded-2xl bg-slate-50/50 border border-slate-100/50 shadow-inner overflow-hidden">
            <div className={cn("px-4 py-3 border-b flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10")}>
                <h3 className="font-semibold text-sm text-slate-700">{title}</h3>
                <Badge variant="secondary" className="bg-white shadow-sm font-mono">{items.length}</Badge>
            </div>
            <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                    <AnimatePresence mode='popLayout'>
                        {items.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                                className="text-center text-xs text-muted-foreground py-8 italic"
                            >
                                No patients waiting
                            </motion.div>
                        ) : (
                            items.map(token => {
                                const patient = patients.find(p => p.id === token.patientId);
                                const opd = OPD_CONFIGS.find(c => c.type === token.opdType);
                                const doctor = token.consultantId ? doctors.find(d => d.id === token.consultantId) : null;

                                return (
                                    <motion.div
                                        layoutId={token.id}
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        key={token.id}
                                        className="group relative bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="outline" className={cn("font-mono text-[10px] px-1.5 bg-slate-50 text-slate-600 border-slate-200")}>
                                                {token.tokenNumber}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground font-medium bg-slate-50 px-1.5 py-0.5 rounded-full">
                                                {new Date(token.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm", `bg-${opd?.color}`)}>
                                                {patient?.firstName[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-sm truncate text-slate-800">{patient?.firstName} {patient?.lastName}</div>
                                                <div className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                                                    {opd?.name} • {doctor ? `Dr. ${doctor.name.split(' ').pop()}` : 'Unassigned'}
                                                </div>
                                            </div>
                                        </div>

                                        {onNext && (
                                            <Button
                                                size="sm"
                                                className="w-full mt-3 h-8 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white hover:bg-primary"
                                                onClick={() => onNext(token.id)}
                                            >
                                                Move Next <ArrowRight className="ml-1.5 h-3 w-3" />
                                            </Button>
                                        )}
                                    </motion.div>
                                )
                            })
                        )}
                    </AnimatePresence>
                </div>
            </ScrollArea>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50/30"
        >
            <div className="px-6 py-4 flex justify-between items-center border-b bg-white/50 backdrop-blur-sm">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-800">Queue Operations</h1>
                    <p className="text-sm text-slate-500">Live patient flow monitoring</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <Button variant="ghost" size="sm" className="h-7 text-xs bg-white shadow-sm">Board View</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">List View</Button>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 border-slate-200"><Pause className="mr-2 h-3 w-3" /> Pause</Button>
                    <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"><Play className="mr-2 h-3 w-3" /> Auto-Route</Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-6 inline-flex gap-4 h-full min-w-full">
                    <QueueColumn
                        title="Reception / Waiting"
                        items={waitingForVitals}
                        onNext={(id) => handleNextStage(id, tokens.find(t => t.id === id)!.status)}
                    />

                    <QueueColumn
                        title="Vitals Station"
                        items={inVitals}
                        onNext={(id) => handleNextStage(id, 'in-vitals')}
                    />

                    <QueueColumn
                        title="Waiting for Jr. Doctor"
                        items={waitingForJunior}
                        onNext={(id) => handleNextStage(id, 'waiting-for-junior')}
                    />

                    <QueueColumn
                        title="With Junior Doctor"
                        items={withJunior}
                        onNext={(id) => handleNextStage(id, 'with-junior')}
                    />

                    <QueueColumn
                        title="Waiting for Consultant"
                        items={waitingForConsultant}
                        onNext={(id) => handleNextStage(id, 'waiting-for-consultant')}
                    />

                    <QueueColumn
                        title="With Consultant"
                        items={withConsultant}
                        onNext={(id) => handleNextStage(id, 'with-consultant')}
                    />

                    <QueueColumn title="Lab / Radiology" items={inLab} />
                    <QueueColumn title="Pharmacy" items={inPharmacy} />
                    <QueueColumn title="Billing" items={inBilling} />
                </div>
            </ScrollArea>
        </motion.div>
    );
}
