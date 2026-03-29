import { useState } from 'react';
import { useClinicStore } from '@/stores/clinicStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TokenCard } from '@/components/queue/TokenCard';
import { toast } from 'sonner';
import { Activity, Heart, Thermometer, Scale, Ruler, Wind, Droplets } from 'lucide-react';

export function VitalsStation() {
  const { getTokensByStatus, updateTokenStatus } = useClinicStore();
  const calledForVitals = getTokensByStatus('waiting-for-vitals');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    pulse: '',
    temperature: '',
    weight: '',
    height: '',
    spo2: '',
    respiratoryRate: '',
  });

  const handleSaveVitals = () => {
    if (!selectedToken) return;
    
    // Validate required fields
    if (!vitals.bloodPressure || !vitals.pulse || !vitals.temperature) {
      toast.error('Please fill required vital signs');
      return;
    }

    // Update token status to move to junior doctor
    updateTokenStatus(selectedToken, 'with-junior');
    
    toast.success('Vitals recorded successfully!', {
      description: 'Patient moved to Junior Doctor queue',
    });
    
    // Reset form
    setSelectedToken(null);
    setVitals({
      bloodPressure: '',
      pulse: '',
      temperature: '',
      weight: '',
      height: '',
      spo2: '',
      respiratoryRate: '',
    });
  };

  const token = calledForVitals.find(t => t.id === selectedToken);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Vitals Station</h2>
          <p className="text-muted-foreground">Record patient vital signs</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-status-in-progress/10 px-4 py-2 text-status-in-progress">
          <Activity className="h-5 w-5" />
          <span className="font-medium">{calledForVitals.length} Waiting</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Waiting Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Called for Vitals</CardTitle>
            <CardDescription>Select a patient to record vitals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {calledForVitals.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No patients called for vitals
              </div>
            ) : (
              calledForVitals.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedToken(t.id)}
                  className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                    selectedToken === t.id ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-lg font-bold text-primary">{t.tokenNumber}</span>
                      <p className="text-sm text-muted-foreground">
                        {t.patient?.firstName} {t.patient?.lastName}
                      </p>
                    </div>
                    <Button size="sm" variant={selectedToken === t.id ? 'default' : 'outline'}>
                      {selectedToken === t.id ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Vitals Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-status-urgent" />
              Record Vitals
            </CardTitle>
            <CardDescription>
              {token 
                ? `Recording for ${token.patient?.firstName} ${token.patient?.lastName} (${token.tokenNumber})`
                : 'Select a patient from the queue'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedToken ? (
              <div className="py-12 text-center text-muted-foreground">
                <Activity className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>Select a patient to record vitals</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bp" className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-status-urgent" />
                      Blood Pressure *
                    </Label>
                    <Input
                      id="bp"
                      placeholder="120/80 mmHg"
                      value={vitals.bloodPressure}
                      onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pulse" className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-status-urgent" />
                      Pulse Rate *
                    </Label>
                    <Input
                      id="pulse"
                      type="number"
                      placeholder="72 bpm"
                      value={vitals.pulse}
                      onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="temp" className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      Temperature *
                    </Label>
                    <Input
                      id="temp"
                      type="number"
                      step="0.1"
                      placeholder="98.6 °F"
                      value={vitals.temperature}
                      onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spo2" className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-status-in-progress" />
                      SpO2
                    </Label>
                    <Input
                      id="spo2"
                      type="number"
                      placeholder="98 %"
                      value={vitals.spo2}
                      onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-primary" />
                      Weight
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="70 kg"
                      value={vitals.weight}
                      onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height" className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-primary" />
                      Height
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170 cm"
                      value={vitals.height}
                      onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rr" className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-teal-500" />
                      Resp. Rate
                    </Label>
                    <Input
                      id="rr"
                      type="number"
                      placeholder="16 /min"
                      value={vitals.respiratoryRate}
                      onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveVitals} className="w-full">
                  Save Vitals & Send to Junior Doctor
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
