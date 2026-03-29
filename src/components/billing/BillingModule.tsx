import { useState } from 'react';
import { useClinicStore } from '@/stores/clinicStore';
import { OPD_CONFIGS } from '@/types/clinic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { CreditCard, Receipt, Printer, CheckCircle, Wallet, Building, Smartphone } from 'lucide-react';

export function BillingModule() {
  const { getTokensByStatus, updateTokenStatus } = useClinicStore();
  const billingQueue = getTokensByStatus('billing-pending');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState('0');

  const token = billingQueue.find(t => t.id === selectedToken);
  const opdConfig = token ? OPD_CONFIGS.find(c => c.type === token.opdType) : null;

  // Demo billing items
  const billingItems = [
    { id: '1', description: 'OPD Consultation', category: 'consultation', amount: opdConfig?.consultationFee || 300 },
    { id: '2', description: 'Complete Blood Count', category: 'lab', amount: 350 },
    { id: '3', description: 'Medications', category: 'pharmacy', amount: 230 },
  ];

  const subtotal = billingItems.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = Math.round(subtotal * (parseInt(discount) / 100));
  const total = subtotal - discountAmount;

  const handlePayment = () => {
    if (!selectedToken) return;
    updateTokenStatus(selectedToken, 'completed');
    toast.success('Payment completed!', {
      description: `Token ${token?.tokenNumber} - Visit completed`,
    });
    setSelectedToken(null);
    setDiscount('0');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Billing & Payments</h2>
          <p className="text-muted-foreground">Process payments and generate invoices</p>
        </div>
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">
          <CreditCard className="mr-1 h-4 w-4" />
          {billingQueue.length} Pending Bills
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Billing Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Queue</CardTitle>
            <CardDescription>Patients ready for billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {billingQueue.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Receipt className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No pending bills</p>
              </div>
            ) : (
              billingQueue.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedToken(t.id)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition-all",
                    selectedToken === t.id
                      ? "border-yellow-500 bg-yellow-500/5"
                      : "hover:border-yellow-500/50"
                  )}
                >
                  <span className="font-mono text-sm font-bold text-yellow-600">
                    {t.tokenNumber}
                  </span>
                  <p className="mt-1 text-sm font-medium">
                    {t.patient?.firstName} {t.patient?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.patient?.mrNumber}</p>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Invoice Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Invoice
            </CardTitle>
            <CardDescription>
              {token
                ? `${token.patient?.firstName} ${token.patient?.lastName} - ${token.tokenNumber}`
                : 'Select a patient to generate invoice'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedToken ? (
              <div className="py-16 text-center text-muted-foreground">
                <CreditCard className="mx-auto mb-4 h-16 w-16 opacity-30" />
                <p>Select a patient from the billing queue</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Billing Items */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                    <span>Description</span>
                    <span>Amount</span>
                  </div>
                  {billingItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <Badge variant="outline" className="mt-1 text-xs capitalize">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="font-semibold">PKR {item.amount}</p>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>PKR {subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="w-20 text-right"
                        min="0"
                        max="100"
                      />
                      <span>%</span>
                      <span className="text-status-completed">-PKR {discountAmount}</span>
                    </div>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">PKR {total}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Method</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'cash', label: 'Cash', icon: Wallet },
                      { value: 'card', label: 'Card', icon: CreditCard },
                      { value: 'upi', label: 'UPI', icon: Smartphone },
                      { value: 'insurance', label: 'Insurance', icon: Building },
                    ].map((method) => (
                      <button
                        key={method.value}
                        onClick={() => setPaymentMethod(method.value)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-lg border p-3 transition-all",
                          paymentMethod === method.value
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        )}
                      >
                        <method.icon className="h-5 w-5" />
                        <span className="text-xs font-medium">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Invoice
                  </Button>
                  <Button onClick={handlePayment} className="flex-1 bg-status-completed hover:bg-status-completed/90">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Payment
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
