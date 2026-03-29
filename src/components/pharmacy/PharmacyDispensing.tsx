
import { useState } from 'react';
import { useClinicStore } from '@/stores/clinicStore';
import { usePharmacyStore } from '@/stores/pharmacyStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Pill, Check, Search, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

export function PharmacyDispensing() {
    const { getTokensByStatus, updateTokenStatus } = useClinicStore();
    const { medicines, searchMedicines, dispensePrescription } = usePharmacyStore();

    // Queue of patients sent to pharmacy
    const pharmacyQueue = getTokensByStatus('sent-to-pharmacy');
    const [selectedToken, setSelectedToken] = useState<string | null>(null);

    // Dispensing State
    const [cart, setCart] = useState<{ medId: string; qty: number }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const activeToken = pharmacyQueue.find(t => t.id === selectedToken);

    // Filter medicines for manual adding
    const searchResults = searchQuery ? searchMedicines(searchQuery) : [];

    const addToCart = (medId: string) => {
        setCart(prev => {
            const existing = prev.find(i => i.medId === medId);
            if (existing) {
                return prev.map(i => i.medId === medId ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { medId, qty: 1 }];
        });
        setSearchQuery(''); // Reset search
    };

    const removeFromCart = (medId: string) => {
        setCart(prev => prev.filter(i => i.medId !== medId));
    };

    const updateQty = (medId: string, delta: number) => {
        setCart(prev => prev.map(i => {
            if (i.medId === medId) {
                return { ...i, qty: Math.max(1, i.qty + delta) };
            }
            return i;
        }));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const med = medicines.find(m => m.id === item.medId);
            return total + (med ? med.sellingPrice * item.qty : 0);
        }, 0);
    };

    const handleDispense = () => {
        if (!selectedToken || !activeToken) return;

        // 1. Prepare Sale Data
        const saleItems = cart.map(item => {
            const med = medicines.find(m => m.id === item.medId)!;
            return {
                medicineId: med.id,
                medicineName: med.name,
                quantity: item.qty,
                pricePerUnit: med.sellingPrice,
                totalPrice: med.sellingPrice * item.qty,
                batchNumber: med.batchNumber || 'N/A'
            };
        });

        const totalAmount = calculateTotal();

        // 2. Call Store Action
        dispensePrescription(selectedToken, {
            visitId: activeToken.visitId,
            patientId: activeToken.patientId,
            patientName: `${activeToken.patient?.firstName} ${activeToken.patient?.lastName}`,
            items: saleItems,
            totalAmount: totalAmount,
            discount: 0,
            finalAmount: totalAmount,
            paymentMode: 'cash', // Default
            status: 'completed',
            createdBy: 'pharmacist-1' // Mock
        });

        // 3. Update Clinic Token Status
        updateTokenStatus(selectedToken, 'billing-pending');

        toast.success(`Dispensed medicines for ${activeToken.patient?.firstName}`);
        setSelectedToken(null);
        setCart([]);
    };

    return (
        <div className="grid gap-6 lg:grid-cols-3 h-[calc(100vh-12rem)]">
            {/* Queue Sidebar */}
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Pill className="h-5 w-5" /> Pending Queue
                        <Badge className="ml-auto">{pharmacyQueue.length}</Badge>
                    </CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1 px-4">
                    <div className="space-y-2">
                        {pharmacyQueue.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No patients waiting</p>
                        ) : (
                            pharmacyQueue.map(token => (
                                <button
                                    key={token.id}
                                    onClick={() => { setSelectedToken(token.id); setCart([]); }}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg border transition-all hover:bg-muted",
                                        selectedToken === token.id ? "bg-primary/10 border-primary" : "bg-card"
                                    )}
                                >
                                    <div className="font-semibold">{token.patient?.firstName} {token.patient?.lastName}</div>
                                    <div className="text-xs text-muted-foreground">MR: {token.patient?.mrNumber}</div>
                                    <div className="mt-1 flex gap-2">
                                        <Badge variant="outline" className="text-xs">{token.tokenNumber}</Badge>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </Card>

            {/* Dispensing Area */}
            <Card className="lg:col-span-2 flex flex-col h-full">
                <CardHeader>
                    <CardTitle>Dispensing Console</CardTitle>
                    <CardDescription>
                        {activeToken ? `Dispensing for: ${activeToken.patient?.firstName} ${activeToken.patient?.lastName}` : 'Select a patient to start'}
                    </CardDescription>
                </CardHeader>

                {activeToken ? (
                    <div className="flex-1 flex flex-col p-6 pt-0 space-y-4">
                        {/* Medicine Search */}
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Scan barcode or search medicine..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <div className="absolute top-full left-0 right-0 z-10 bg-popover border rounded-md shadow-md mt-1 max-h-48 overflow-auto">
                                    {searchResults.length > 0 ? searchResults.map(med => (
                                        <button
                                            key={med.id}
                                            onClick={() => addToCart(med.id)}
                                            className="w-full text-left px-4 py-2 hover:bg-muted flex justify-between"
                                        >
                                            <span>{med.name}</span>
                                            <span className="text-sm text-muted-foreground">Stock: {med.currentStock}</span>
                                        </button>
                                    )) : <div className="p-2 text-sm text-muted-foreground">No matches</div>}
                                </div>
                            )}
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 border rounded-md p-4 space-y-3 overflow-auto">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                    <Pill className="h-12 w-12 mb-2" />
                                    <p>Add medicines to dispense</p>
                                </div>
                            ) : (
                                cart.map(item => {
                                    const med = medicines.find(m => m.id === item.medId);
                                    if (!med) return null;
                                    return (
                                        <div key={item.medId} className="flex items-center justify-between p-2 border rounded-lg bg-card shadow-sm">
                                            <div>
                                                <div className="font-medium">{med.name}</div>
                                                <div className="text-xs text-muted-foreground">PKR {med.sellingPrice} / unit</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border rounded-md">
                                                    <button onClick={() => updateQty(item.medId, -1)} className="px-2 py-1 hover:bg-muted">-</button>
                                                    <span className="w-8 text-center text-sm">{item.qty}</span>
                                                    <button onClick={() => updateQty(item.medId, 1)} className="px-2 py-1 hover:bg-muted">+</button>
                                                </div>
                                                <div className="font-bold w-16 text-right">PKR {med.sellingPrice * item.qty}</div>
                                                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.medId)}>
                                                    <Trash className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="space-y-4">
                            <Separator />
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total Amount</span>
                                <span>PKR {calculateTotal()}</span>
                            </div>
                            <Button
                                className="w-full bg-teal-600 hover:bg-teal-700 h-12 text-lg"
                                onClick={handleDispense}
                                disabled={cart.length === 0}
                            >
                                <Check className="mr-2 h-5 w-5" /> Confirm Dispense & Send to Billing
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-muted/20 m-4 rounded-lg border-2 border-dashed">
                        Select a patient from the queue to start dispensing
                    </div>
                )}
            </Card>
        </div>
    );
}
