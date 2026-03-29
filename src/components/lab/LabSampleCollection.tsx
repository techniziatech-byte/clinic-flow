
import { useLabStore } from '@/stores/labStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestTube, Check, ArrowRight, QrCode } from 'lucide-react';
import { toast } from 'sonner';

export function LabSampleCollection() {
    const { orders, collectSample, samples, processSample } = useLabStore();

    // Filter orders needing collection (pending)
    const pendingCollections = orders.filter(o => o.status === 'pending');

    // Filter samples needing processing (collected)
    const collectedSamples = samples.filter(s => s.status === 'collected' || s.status === 'received');

    const handleCollect = (orderId: string) => {
        // Simulating collecting blood/urine based on tests
        collectSample(orderId, 'blood');
        toast.success("Sample collected and barcoded");
    };

    const handleProcess = (sampleId: string) => {
        processSample(sampleId);
        toast.success("Sample sent for processing");
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Collection Queue */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TestTube className="h-5 w-5" /> Sample Collection
                    </CardTitle>
                    <CardDescription>Pending orders waiting for sample collection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pendingCollections.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No pending collections</p>
                    ) : (
                        pendingCollections.map(order => (
                            <div key={order.id} className="border rounded-lg p-4 flex justify-between items-center bg-card">
                                <div>
                                    <p className="font-medium">Order #{order.id}</p>
                                    <div className="flex gap-2 mt-1">
                                        {order.tests.map(t => (
                                            <Badge key={t.testId} variant="outline" className="text-xs">{t.testName}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <Button size="sm" onClick={() => handleCollect(order.id)}>
                                    <QrCode className="mr-2 h-4 w-4" /> Collect
                                </Button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Processing Queue */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowRight className="h-5 w-5" /> Send to Processing
                    </CardTitle>
                    <CardDescription>Collected samples ready for analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {collectedSamples.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No samples waiting</p>
                    ) : (
                        collectedSamples.map(sample => (
                            <div key={sample.id} className="border rounded-lg p-4 flex justify-between items-center bg-card">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <QrCode className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-mono font-medium">{sample.id}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground capitalize mt-1">Type: {sample.sampleType}</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => handleProcess(sample.id)}>
                                    Process <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
