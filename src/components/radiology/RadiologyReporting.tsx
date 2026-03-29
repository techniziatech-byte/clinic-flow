
import { useState } from 'react';
import { useRadiologyStore } from '@/stores/radiologyStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export function RadiologyReporting() {
    const { orders, saveReport } = useRadiologyStore();

    // Find tests ready for reporting (images uploaded)
    const reportQueue = orders.flatMap(o =>
        o.tests
            .filter(t => t.status === 'images-uploaded')
            .map(t => ({ ...t, orderId: o.id, patientId: o.patientId }))
    );

    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [reportContent, setReportContent] = useState('');
    const [impression, setImpression] = useState('');

    const handleSave = () => {
        if (!selectedItem) return;

        saveReport({
            orderId: selectedItem.orderId,
            testId: selectedItem.testId,
            patientId: selectedItem.patientId,
            radiologistId: 'rad1', // mock
            reportContent,
            findings: reportContent,
            impression: impression,
            imageUrls: [], // mock
            status: 'final'
        });

        toast.success("Report Finalized");
        setSelectedItem(null);
        setReportContent('');
        setImpression('');
    };

    return (
        <div className="grid gap-6 md:grid-cols-3 h-[calc(100vh-12rem)]">
            {/* Queue */}
            <Card className="md:col-span-1 border-r h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="text-lg">Reporting Queue</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-2">
                    {reportQueue.length === 0 ? <p className="text-center text-muted-foreground py-8">No reports pending</p> :
                        reportQueue.map((item, idx) => (
                            <div
                                key={idx}
                                className="p-3 mb-2 border rounded-lg cursor-pointer hover:bg-muted"
                                onClick={() => setSelectedItem(item)}
                            >
                                <div className="font-medium">{item.testName}</div>
                                <div className="flex justify-between mt-1">
                                    <Badge variant="outline" className="text-xs">{item.modality}</Badge>
                                    <span className="text-xs text-muted-foreground">#{item.orderId}</span>
                                </div>
                            </div>
                        ))
                    }
                </CardContent>
            </Card>

            {/* Editor */}
            <Card className="md:col-span-2 h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Report Editor</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                    {selectedItem ? (
                        <>
                            <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-md">
                                <ImageIcon className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-medium">4 images available for review</span>
                                <Button variant="link" size="sm" className="ml-auto">View Images</Button>
                            </div>

                            <div className="space-y-2 flex-1">
                                <label className="text-sm font-medium">Findings / Detailed Report</label>
                                <Textarea
                                    className="h-full min-h-[200px] font-mono resize-none"
                                    value={reportContent}
                                    onChange={e => setReportContent(e.target.value)}
                                    placeholder="Enter findings..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Impression / Conclusion</label>
                                <Textarea
                                    className="min-h-[80px]"
                                    value={impression}
                                    onChange={e => setImpression(e.target.value)}
                                    placeholder="Summary..."
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" onClick={() => setSelectedItem(null)}>Cancel</Button>
                                <Button onClick={handleSave}>Finalize Report</Button>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            Select a study to start reporting
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
