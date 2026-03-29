
import { useState } from 'react';
import { useRadiologyStore } from '@/stores/radiologyStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, Monitor } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Modality } from '@/types/radiology';

export function RadiologyScheduling() {
    const { orders, scheduleAppointment, modalities, appointments } = useRadiologyStore();

    // Filter unscheduled tests
    const pendingTests = orders.flatMap(o =>
        o.tests.filter(t => t.status === 'pending').map(t => ({ ...t, orderId: o.id, patientId: o.patientId }))
    );

    const [selectedTest, setSelectedTest] = useState<any>(null);
    const [selectedModality, setSelectedModality] = useState<Modality | null>(null);

    const handleSchedule = (modality: Modality) => {
        if (!selectedTest) return;

        scheduleAppointment({
            orderId: selectedTest.orderId,
            testId: selectedTest.testId,
            patientId: selectedTest.patientId,
            modalityId: modality.id,
            scheduledTime: new Date().toISOString(), // Mock: schedule for "now"
            technicianId: 'tech1'
        });

        toast.success(`Scheduled ${selectedTest.testName} in ${modality.name}`);
        setSelectedTest(null);
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Unscheduled Requests</CardTitle>
                    <CardDescription>Drag or click to schedule</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {pendingTests.length === 0 ? <p className="text-center text-muted-foreground py-8">No pending requests</p> :
                        pendingTests.map((item, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted",
                                    selectedTest === item ? "border-primary bg-primary/5" : ""
                                )}
                                onClick={() => setSelectedTest(item)}
                            >
                                <div className="flex justify-between">
                                    <span className="font-medium">{item.testName}</span>
                                    <Badge variant="outline">{item.modality}</Badge>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">Order #{item.orderId}</div>
                            </div>
                        ))
                    }
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Resource Availability</CardTitle>
                    <CardDescription>Select a modality to assign</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {modalities.map(mod => {
                        // Count scheduled appointments for this modality today (mock logic)
                        const count = appointments.filter(a => a.modalityId === mod.id && a.status === 'scheduled').length;

                        return (
                            <div key={mod.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Monitor className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">{mod.name}</div>
                                        <div className="text-xs text-muted-foreground">{mod.type} • {mod.roomNumber}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="flex gap-1">
                                        <Calendar className="h-3 w-3" /> {count} Scheduled
                                    </Badge>
                                    <Button
                                        size="sm"
                                        disabled={!selectedTest || selectedTest.modality !== mod.type}
                                        onClick={() => handleSchedule(mod)}
                                    >
                                        Assign
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
    );
}
