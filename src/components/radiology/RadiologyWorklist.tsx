
import { useRadiologyStore } from '@/stores/radiologyStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';

export function RadiologyWorklist() {
    const { appointments, updateTestStatus, orders } = useRadiologyStore();

    // Get patients who are scheduled
    const scheduledItems = appointments.filter(a => a.status === 'scheduled');

    // Enrich with order/test details
    const worklist = scheduledItems.map(appt => {
        const order = orders.find(o => o.id === appt.orderId);
        const test = order?.tests.find(t => t.testId === appt.testId);
        return { appt, order, test };
    });

    const handleStart = (appt: any) => {
        // In real app, update appointment status to Checked-In / In-Progress
        toast.info("Patient Check-in recorded");
    };

    const handleComplete = (appt: any) => {
        updateTestStatus(appt.order.id, appt.test.testId, 'images-uploaded');
        toast.success("Exam completed and images uploaded");
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Technician Worklist</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {worklist.length === 0 ? <p className="col-span-full text-center py-12 text-muted-foreground border rounded-lg border-dashed">No scheduled exams for today</p> :
                    worklist.map(({ appt, order, test }) => {
                        if (!order || !test) return null;
                        return (
                            <Card key={appt.id}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex justify-between">
                                        <span>{test.testName}</span>
                                        <Badge>{test.modality}</Badge>
                                    </CardTitle>
                                    <CardDescription>Order #{order.id}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="text-sm">
                                            <p className="font-medium text-foreground">Status: Scheduled</p>
                                            <p className="text-muted-foreground">Time: {new Date(appt.scheduledTime).toLocaleTimeString()}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="flex-1" onClick={() => handleStart(appt)}>
                                                <Play className="mr-2 h-4 w-4" /> Start
                                            </Button>
                                            <Button size="sm" className="flex-1" onClick={() => handleComplete(appt)}>
                                                <Upload className="mr-2 h-4 w-4" /> Complete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </div>
        </div>
    );
}
