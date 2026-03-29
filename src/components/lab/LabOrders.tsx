
import { useState } from 'react';
import { useLabStore } from '@/stores/labStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, FileText } from 'lucide-react';
import { useClinicStore } from '@/stores/clinicStore';
import { toast } from 'sonner';

export function LabOrders() {
    const { orders, tests, addOrder } = useLabStore();
    const { patients } = useClinicStore();

    const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<string>('');
    const [selectedTests, setSelectedTests] = useState<string[]>([]);

    const handleCreateOrder = () => {
        if (!selectedPatient || selectedTests.length === 0) return;

        const patient = patients.find(p => p.id === selectedPatient);
        const selectedTestObjects = tests.filter(t => selectedTests.includes(t.id));
        const totalAmount = selectedTestObjects.reduce((acc, t) => acc + t.price, 0);

        addOrder({
            patientId: selectedPatient,
            visitId: 'v1', // mock
            doctorId: 'd1', // mock
            priority: 'normal',
            tests: selectedTestObjects.map(t => ({
                testId: t.id,
                testName: t.name,
                price: t.price,
                status: 'pending'
            })),
            totalAmount,
        });

        setIsNewOrderOpen(false);
        setSelectedPatient('');
        setSelectedTests([]);
        toast.success("Lab order created successfully");
    };

    const toggleTestSelection = (testId: string) => {
        setSelectedTests(prev =>
            prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Test Orders</h3>
                <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> New Order</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Lab Order</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Select Patient</Label>
                                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Search patient..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {patients.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.mrNumber})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Select Tests</Label>
                                <div className="grid grid-cols-2 gap-2 border rounded-md p-4 max-h-60 overflow-y-auto">
                                    {tests.map(test => (
                                        <div key={test.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={test.id}
                                                checked={selectedTests.includes(test.id)}
                                                onChange={() => toggleTestSelection(test.id)}
                                                className="h-4 w-4 rounded border-gray-300"
                                            />
                                            <label htmlFor={test.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {test.name} (PKR {test.price})
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={handleCreateOrder}>Create Order</Button>
                            </div>
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
                                <TableHead>Amount</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No orders found</TableCell>
                                </TableRow>
                            ) : (
                                orders.map(order => {
                                    const patient = patients.find(p => p.id === order.patientId);
                                    return (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                            <TableCell>{patient?.firstName} {patient?.lastName}</TableCell>
                                            <TableCell className="text-xs">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {order.tests.map(t => (
                                                        <Badge key={t.testId} variant="secondary" className="text-xs">{t.testName}</Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={order.status === 'completed' ? 'default' : 'outline'}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>PKR {order.totalAmount}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm"><FileText className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
