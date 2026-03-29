
import { useState } from 'react';
import { useLabStore } from '@/stores/labStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CheckCircle2, AlertCircle, FileOutput } from 'lucide-react';
import { toast } from 'sonner';

export function LabResults() {
    const { samples, orders, results, submitResult, tests } = useLabStore();

    // Find orders that are in 'processing' or 'collected' (simplified: assuming samples are processed)
    // In a real app, this would query orders linked to samples with status 'processing'
    const processingSamples = samples.filter(s => s.status === 'processing');

    // Map samples back to orders to show tests
    const processingOrders = processingSamples.map(sample => {
        const order = orders.find(o => o.id === sample.orderId);
        return { sample, order };
    }).filter(item => item.order !== undefined);

    const [selectedEntry, setSelectedEntry] = useState<{ sampleId: string, orderId: string, testId: string } | null>(null);
    const [resultValue, setResultValue] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openResultDialog = (sampleId: string, orderId: string, testId: string) => {
        setSelectedEntry({ sampleId, orderId, testId });
        setResultValue('');
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (!selectedEntry) return;

        submitResult(selectedEntry.orderId, selectedEntry.testId, {
            value: resultValue,
            isAbnormal: false, // Simple logic
            verifiedAt: new Date().toISOString()
        });

        toast.success("Result submitted and verified");
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Result Entry & Verification</h3>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {processingOrders.map(({ sample, order }) => (
                    order && (
                        <Card key={sample.id}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex justify-between">
                                    <span>Sample: {sample.id}</span>
                                    <Badge variant="outline">{sample.sampleType}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {order.tests.map(testItem => {
                                    // Check if result exists
                                    const hasResult = results.some(r => r.orderId === order.id && r.testId === testItem.testId);

                                    return (
                                        <div key={testItem.testId} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                            <span className="text-sm font-medium">{testItem.testName}</span>
                                            {hasResult ? (
                                                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                                                    <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
                                                </Badge>
                                            ) : (
                                                <Button size="sm" variant="outline" onClick={() => openResultDialog(sample.id, order.id, testItem.testId)}>
                                                    Enter Result
                                                </Button>
                                            )}
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    )
                ))}

                {processingOrders.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                        <FileOutput className="mx-auto h-8 w-8 mb-2 opacity-50" />
                        No samples processing. Collect and process samples first.
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter Test Result</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Result Value</Label>
                            <Input
                                value={resultValue}
                                onChange={(e) => setResultValue(e.target.value)}
                                placeholder="Enter value (e.g. 12.5 g/dL)"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit}>submit & Verify</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
