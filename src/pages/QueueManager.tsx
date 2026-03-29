import { useQueueStore } from '@/stores/queueStore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { TokenCard } from '@/components/queue/TokenCard';
import { Plus, ArrowRight, CheckCircle } from 'lucide-react';

const generateTokenNumber = () => `D-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

const QueueManager = () => {
  const { tokens, fetchTokens, updateTokenStatus } = useQueueStore();
  const [patientName, setPatientName] = useState('');

  const addToken = async () => {
    if (!patientName.trim()) return;
    const tokenNumber = generateTokenNumber();
    const { error } = await supabase.from('tokens').insert({
      token_number: tokenNumber,
      patient_name: patientName,
      status: 'check-in',
    });
    if (error) console.error(error);
    setPatientName('');
    fetchTokens();
  };

  const clearPayment = (tokenId: string) => {
    updateTokenStatus(tokenId, {
      payment_cleared: true,
      current_station: 'opd',
      status: 'in-consultation',
    });
  };

  const callNext = (tokenId: string) => {
    updateTokenStatus(tokenId, { status: 'current' });
  };

  const flagProcedure = (tokenId: string) => {
    updateTokenStatus(tokenId, { procedure_required: true, status: 'procedure-pending' });
  };

  const waiting = tokens.filter(t => t.status === 'check-in' || t.status === 'in-consultation');
  const pendingPay = tokens.filter(t => t.status === 'procedure-pending');
  const currentOPD = tokens.find(t => t.status === 'current');

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Queue Manager - Reception</h1>
      
      {/* Add New Token */}
      <Card>
        <CardHeader>
          <CardTitle>Check-In New Patient</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 p-6">
          <Input 
            placeholder="Patient Name" 
            value={patientName} 
            onChange={(e) => setPatientName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addToken}>
            <Plus className="mr-2 h-4 w-4" />
            Generate Token
          </Button>
        </CardContent>
      </Card>

      {/* Current OPD */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <CardTitle className="flex items-center gap-2">
            Now Calling OPD <Badge>Live</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentOPD ? (
            <div className="text-center py-8">
              <div className="text-4xl font-black text-primary mb-2">{currentOPD.token_number}</div>
              <div className="text-xl">{currentOPD.patient_name}</div>
              <Button onClick={() => callNext(currentOPD.id)} className="mt-4">
                Call Next <ArrowRight className="ml-2" />
              </Button>
            </div>
          ) : (
            <p>No current OPD token</p>
          )}
        </CardContent>
      </Card>

      {/* Waiting Queue */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>OPD Waiting ({waiting.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {waiting.map(token => (
              <div key={token.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="font-bold text-xl">{token.token_number}</div>
                <div>{token.patient_name}</div>
                <Button size="sm" onClick={() => clearPayment(token.id)}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Payment Cleared
                </Button>
                <Button variant="outline" size="sm" onClick={() => flagProcedure(token.id)}>
                  Add Procedure
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Procedure Payment Pending ({pendingPay.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingPay.map(token => (
              <div key={token.id} className="p-3 border rounded-lg mb-3">
                <div className="font-bold">{token.token_number} - {token.patient_name}</div>
                <Button className="mt-2" onClick={() => clearPayment(token.id)}>
                  Procedure Paid
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QueueManager;

