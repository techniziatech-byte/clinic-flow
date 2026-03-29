
import { useState } from 'react';
import { useRadiologyStore } from '@/stores/radiologyStore';
import { useClinicStore } from '@/stores/clinicStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

export function RadiologyOrders() {
    const { orders, tests, addOrder } = useRadiologyStore();
    const { patients } = useClinicStore();

    // Create new order state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedTests, setSelectedTests] = useState<string[]>([]);

    const handleCreate = () => {
        if (!selectedPatient || selectedTests.length === 0) return;

        const patient = patients.find(p => p.id === selectedPatient);
        const selectedTestObjs = tests.filter(t => selectedTests.includes(t.id));
        const totalAmount = selectedTestObjs.reduce((acc, t) => acc + t.price, 0);

        addOrder({
            visitId: 'v1', // mock
            patientId: selectedPatient,
            doctorId: 'd1', // mock
            priority: 'routine',
            clinicalIndications: '',
            tests: selectedTestObjs.map(t => ({
                testId: t.id,
                testName: t.name,
                modality: t.modality,
                price: t.price,
                status: 'pending'
            })),
            totalAmount
        });

        toast.success("Radiology Order Created");
        setIsDialogOpen(false);
        setSelectedPatient('');
        setSelectedTests([]);
    };

    const toggleTest = (id: string) => {
        setSelectedTests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Order List</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> New Order</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Radiology Order</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Patient</Label>
                                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                                    <SelectTrigger><SelectValue placeholder="Select Patient" /></SelectTrigger>
                                    <SelectContent>
                                        {patients.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tests</Label>
                                <div className="border rounded-md p-2 max-h-48 overflow-auto grid gap-2">
                                    {tests.map(t => (
                                        <div key={t.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedTests.includes(t.id)}
                                                onChange={() => toggleTest(t.id)}
                                                className="rounded border-gray-300"
                                            />
                                            <label className="text-sm">{t.name} ({t.modality})</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Button onClick={handleCreate}>Submit Order</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Tests</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8">No orders</TableCell></TableRow> :
                                orders.map(order => {
                                    const patient = patients.find(p => p.id === order.patientId);
                                    return (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                            <TableCell>{patient?.firstName} {patient?.lastName}</TableCell>
                                            <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {order.tests.map(t => (
                                                        <Badge key={t.testId} variant="secondary" className="text-xs">{t.testName}</Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="outline">{order.status}</Badge></TableCell>
                                            <TableCell><Button variant="ghost" size="sm">View</Button></TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
