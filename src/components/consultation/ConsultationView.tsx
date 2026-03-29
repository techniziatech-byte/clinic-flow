import { useState } from 'react';
import { useClinicStore } from '@/stores/clinicStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  Stethoscope, 
  FileText, 
  Pill, 
  FlaskConical, 
  Clock,
  User,
  Activity,
  Send
} from 'lucide-react';

export function ConsultationView() {
  const { getTokensByStatus, updateTokenStatus, currentRole } = useClinicStore();
  
  const isConsultant = currentRole === 'consultant' || currentRole === 'admin';
  const isJunior = currentRole === 'junior-doctor';
  
  const juniorQueue = getTokensByStatus('with-junior');
  const consultantQueue = getTokensByStatus('with-consultant');
  
  const relevantQueue = isConsultant ? consultantQueue : juniorQueue;
  
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const selectedPatient = relevantQueue.find(t => t.id === selectedToken);

  const handleComplete = (nextStatus: 'with-consultant' | 'sent-to-lab' | 'sent-to-pharmacy' | 'billing-pending') => {
    if (!selectedToken) return;
    
    updateTokenStatus(selectedToken, nextStatus);
    
    const statusLabels = {
      'with-consultant': 'Forwarded to Consultant',
      'sent-to-lab': 'Sent to Laboratory',
      'sent-to-pharmacy': 'Sent to Pharmacy',
      'billing-pending': 'Sent to Billing',
    };
    
    toast.success(statusLabels[nextStatus], {
      description: 'Patient moved to next station',
    });
    
    setSelectedToken(null);
    setNotes('');
    setDiagnosis('');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {isConsultant ? 'Consultant' : 'Junior Doctor'} Console
          </h2>
          <p className="text-muted-foreground">
            {isConsultant ? 'Final diagnosis and prescription' : 'Initial assessment and orders'}
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary">
          <Stethoscope className="mr-1 h-4 w-4" />
          {relevantQueue.length} Patients Waiting
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient Queue */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Patient Queue</CardTitle>
            <CardDescription>Click to select patient</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {relevantQueue.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No patients waiting</p>
              </div>
            ) : (
              relevantQueue.map((token) => (
                <button
                  key={token.id}
                  onClick={() => setSelectedToken(token.id)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition-all",
                    selectedToken === token.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-primary">
                      {token.tokenNumber}
                    </span>
                    {token.priority === 'urgent' && (
                      <Badge className="bg-status-urgent text-white">Urgent</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium">
                    {token.patient?.firstName} {token.patient?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {token.patient?.mrNumber}
                  </p>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Consultation Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Consultation
            </CardTitle>
            <CardDescription>
              {selectedPatient 
                ? `${selectedPatient.patient?.firstName} ${selectedPatient.patient?.lastName} - ${selectedPatient.tokenNumber}`
                : 'Select a patient to begin consultation'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedPatient ? (
              <div className="py-16 text-center text-muted-foreground">
                <User className="mx-auto mb-4 h-16 w-16 opacity-30" />
                <p className="text-lg font-medium">No Patient Selected</p>
                <p className="text-sm">Select a patient from the queue to start consultation</p>
              </div>
            ) : (
              <Tabs defaultValue="assessment" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  <TabsTrigger value="vitals">Vitals</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="assessment" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Clinical Notes</label>
                    <Textarea
                      placeholder="Enter clinical findings, symptoms, observations..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {isConsultant ? 'Final Diagnosis' : 'Provisional Diagnosis'}
                    </label>
                    <Textarea
                      placeholder="Enter diagnosis..."
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    {isJunior && (
                      <Button onClick={() => handleComplete('with-consultant')}>
                        <Send className="mr-2 h-4 w-4" />
                        Forward to Consultant
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline"
                      onClick={() => handleComplete('sent-to-lab')}
                    >
                      <FlaskConical className="mr-2 h-4 w-4" />
                      Order Lab Tests
                    </Button>

                    {isConsultant && (
                      <>
                        <Button 
                          variant="outline"
                          onClick={() => handleComplete('sent-to-pharmacy')}
                        >
                          <Pill className="mr-2 h-4 w-4" />
                          Prescribe & Send to Pharmacy
                        </Button>
                        <Button 
                          onClick={() => handleComplete('billing-pending')}
                          className="bg-status-completed hover:bg-status-completed/90"
                        >
                          Complete & Bill
                        </Button>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="vitals">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: 'Blood Pressure', value: '120/80 mmHg', icon: Activity },
                      { label: 'Pulse Rate', value: '72 bpm', icon: Activity },
                      { label: 'Temperature', value: '98.6 °F', icon: Activity },
                      { label: 'SpO2', value: '98%', icon: Activity },
                      { label: 'Weight', value: '70 kg', icon: Activity },
                      { label: 'Height', value: '170 cm', icon: Activity },
                    ].map((vital) => (
                      <div key={vital.label} className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">{vital.label}</p>
                        <p className="text-xl font-semibold">{vital.value}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  <div className="rounded-lg border-2 border-dashed border-border p-8 text-center text-muted-foreground">
                    <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>No previous visit history available</p>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
