import { useState } from 'react';
import { useClinicStore } from '@/stores/clinicStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  Heart,
  FileText, 
  Clock,
  User,
  Send,
  FlaskConical,
  Pill,
  Activity,
  TrendingUp,
  Plus,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';

interface BPReading {
  id: string;
  date: string;
  systolic: number;
  diastolic: number;
}

export function CardiologyOPD() {
  const { getTokensByOPD, updateTokenStatus, currentRole } = useClinicStore();
  
  const carQueue = getTokensByOPD('cardiology').filter(t => 
    t.status === 'with-junior' || t.status === 'with-consultant'
  );
  
  const isConsultant = currentRole === 'consultant' || currentRole === 'admin';
  
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const selectedPatient = carQueue.find(t => t.id === selectedToken);
  
  // Chest Pain Assessment
  const [chestPain, setChestPain] = useState({
    present: false,
    character: 'none' as 'sharp' | 'dull' | 'pressure' | 'burning' | 'none',
    location: '',
    radiation: '',
    duration: '',
    triggers: '',
    reliefFactors: '',
    severity: 0
  });

  // Cardiac Risk Factors
  const [riskFactors, setRiskFactors] = useState({
    hypertension: false,
    diabetes: false,
    dyslipidemia: false,
    smoking: false,
    familyHistory: false,
    obesity: false,
    sedentaryLifestyle: false
  });

  // Symptoms
  const [symptoms, setSymptoms] = useState({
    dyspnea: false,
    dyspneaClass: 'none' as 'I' | 'II' | 'III' | 'IV' | 'none',
    palpitations: false,
    syncope: false,
    edema: false,
    fatigue: false,
    orthopnea: false,
    pnd: false
  });

  // BP Readings
  const [bpReadings, setBpReadings] = useState<BPReading[]>([]);
  const [newBP, setNewBP] = useState({ systolic: '', diastolic: '' });

  // Cardiac Examination
  const [cardiacExam, setCardiacExam] = useState({
    heartRate: '',
    rhythm: 'regular' as 'regular' | 'irregular',
    heartSounds: 'normal' as 'normal' | 'murmur' | 'gallop',
    murmurGrade: '',
    jvp: 'normal' as 'normal' | 'raised',
    peripheralPulses: 'present' as 'present' | 'diminished' | 'absent',
    notes: ''
  });

  // Orders
  const [orders, setOrders] = useState({
    ecg: false,
    echo: false,
    tmt: false,
    holter: false,
    angiography: false,
    cardiacEnzymes: false,
    lipidProfile: false,
    bnp: false,
    dDimer: false
  });

  const [clinicalNotes, setClinicalNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const handleComplete = (nextStatus: 'with-consultant' | 'sent-to-lab' | 'sent-to-pharmacy' | 'billing-pending') => {
    if (!selectedToken) return;
    updateTokenStatus(selectedToken, nextStatus);
    toast.success('Patient moved to next station');
    setSelectedToken(null);
  };

  const addBPReading = () => {
    const sys = parseInt(newBP.systolic);
    const dia = parseInt(newBP.diastolic);
    if (sys && dia) {
      setBpReadings(prev => [...prev, {
        id: Date.now().toString(),
        date: format(new Date(), 'PPp'),
        systolic: sys,
        diastolic: dia
      }]);
      setNewBP({ systolic: '', diastolic: '' });
    }
  };

  const removeBPReading = (id: string) => {
    setBpReadings(prev => prev.filter(r => r.id !== id));
  };

  const getBPCategory = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { label: 'Normal', color: 'text-green-600' };
    if (sys < 130 && dia < 80) return { label: 'Elevated', color: 'text-yellow-600' };
    if (sys < 140 || dia < 90) return { label: 'Stage 1 HTN', color: 'text-orange-600' };
    if (sys >= 140 || dia >= 90) return { label: 'Stage 2 HTN', color: 'text-red-600' };
    return { label: 'Unknown', color: 'text-muted-foreground' };
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-opd-cardiology/20">
            <Heart className="h-6 w-6 text-opd-cardiology" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Cardiology OPD</h2>
            <p className="text-muted-foreground">
              {isConsultant ? 'Consultant Cardiologist' : 'Junior Doctor Assessment'}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-opd-cardiology bg-opd-cardiology/10 text-opd-cardiology">
          {carQueue.length} Patients
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Queue Panel */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Patient Queue</CardTitle>
            <CardDescription>CAR Tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {carQueue.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No patients waiting</p>
              </div>
            ) : (
              carQueue.map((token) => (
                <button
                  key={token.id}
                  onClick={() => setSelectedToken(token.id)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition-all",
                    selectedToken === token.id
                      ? "border-opd-cardiology bg-opd-cardiology/5"
                      : "hover:border-opd-cardiology/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-opd-cardiology">
                      {token.tokenNumber}
                    </span>
                    {token.priority === 'urgent' && (
                      <Badge className="bg-status-urgent text-white text-xs">Urgent</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium">
                    {token.patient?.firstName} {token.patient?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{token.patient?.mrNumber}</p>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Clinical Forms */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cardiology Assessment
            </CardTitle>
            <CardDescription>
              {selectedPatient 
                ? `${selectedPatient.patient?.firstName} ${selectedPatient.patient?.lastName}`
                : 'Select a patient'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedPatient ? (
              <div className="py-16 text-center text-muted-foreground">
                <User className="mx-auto mb-4 h-16 w-16 opacity-30" />
                <p className="text-lg font-medium">No Patient Selected</p>
                <p className="text-sm">Select a patient from the queue</p>
              </div>
            ) : (
              <Tabs defaultValue="chestpain" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="chestpain">Chest Pain</TabsTrigger>
                  <TabsTrigger value="risks">Risk Factors</TabsTrigger>
                  <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                  <TabsTrigger value="bp">BP Trend</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>

                {/* Chest Pain Tab */}
                <TabsContent value="chestpain" className="space-y-4">
                  <div className="flex items-center space-x-2 rounded-lg border p-3">
                    <Checkbox 
                      id="chestpain-present"
                      checked={chestPain.present}
                      onCheckedChange={(c) => setChestPain(prev => ({...prev, present: !!c}))}
                    />
                    <Label htmlFor="chestpain-present" className="font-medium">Chest Pain Present</Label>
                  </div>

                  {chestPain.present && (
                    <div className="grid gap-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Character</Label>
                          <Select 
                            value={chestPain.character} 
                            onValueChange={(v: any) => setChestPain(prev => ({...prev, character: v}))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sharp">Sharp / Stabbing</SelectItem>
                              <SelectItem value="dull">Dull / Aching</SelectItem>
                              <SelectItem value="pressure">Pressure / Squeezing</SelectItem>
                              <SelectItem value="burning">Burning</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input 
                            placeholder="e.g., Central chest, Left side..."
                            value={chestPain.location}
                            onChange={(e) => setChestPain(prev => ({...prev, location: e.target.value}))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Radiation</Label>
                          <Input 
                            placeholder="e.g., Left arm, jaw, back..."
                            value={chestPain.radiation}
                            onChange={(e) => setChestPain(prev => ({...prev, radiation: e.target.value}))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input 
                            placeholder="e.g., 5 minutes, hours..."
                            value={chestPain.duration}
                            onChange={(e) => setChestPain(prev => ({...prev, duration: e.target.value}))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Triggers</Label>
                          <Input 
                            placeholder="e.g., Exertion, rest, eating..."
                            value={chestPain.triggers}
                            onChange={(e) => setChestPain(prev => ({...prev, triggers: e.target.value}))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Relief Factors</Label>
                          <Input 
                            placeholder="e.g., Rest, nitrates..."
                            value={chestPain.reliefFactors}
                            onChange={(e) => setChestPain(prev => ({...prev, reliefFactors: e.target.value}))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Pain Severity (0-10)</Label>
                        <div className="flex items-center gap-4">
                          <Slider 
                            value={[chestPain.severity]}
                            onValueChange={([v]) => setChestPain(prev => ({...prev, severity: v}))}
                            max={10}
                            step={1}
                            className="flex-1"
                          />
                          <Badge variant="outline" className="w-12 justify-center">
                            {chestPain.severity}/10
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cardiac Examination */}
                  <div className="rounded-lg border p-4">
                    <h5 className="mb-4 flex items-center gap-2 font-medium">
                      <Activity className="h-4 w-4" />
                      Cardiac Examination
                    </h5>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Heart Rate (bpm)</Label>
                        <Input 
                          type="number"
                          placeholder="e.g., 72"
                          value={cardiacExam.heartRate}
                          onChange={(e) => setCardiacExam(prev => ({...prev, heartRate: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Rhythm</Label>
                        <Select 
                          value={cardiacExam.rhythm} 
                          onValueChange={(v: any) => setCardiacExam(prev => ({...prev, rhythm: v}))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="irregular">Irregular</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Heart Sounds</Label>
                        <Select 
                          value={cardiacExam.heartSounds} 
                          onValueChange={(v: any) => setCardiacExam(prev => ({...prev, heartSounds: v}))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal S1 S2</SelectItem>
                            <SelectItem value="murmur">Murmur</SelectItem>
                            <SelectItem value="gallop">Gallop</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>JVP</Label>
                        <Select 
                          value={cardiacExam.jvp} 
                          onValueChange={(v: any) => setCardiacExam(prev => ({...prev, jvp: v}))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="raised">Raised</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Peripheral Pulses</Label>
                        <Select 
                          value={cardiacExam.peripheralPulses} 
                          onValueChange={(v: any) => setCardiacExam(prev => ({...prev, peripheralPulses: v}))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="diminished">Diminished</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Risk Factors Tab */}
                <TabsContent value="risks" className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries({
                      hypertension: 'Hypertension',
                      diabetes: 'Diabetes Mellitus',
                      dyslipidemia: 'Dyslipidemia',
                      smoking: 'Smoking',
                      familyHistory: 'Family History of CAD',
                      obesity: 'Obesity (BMI > 30)',
                      sedentaryLifestyle: 'Sedentary Lifestyle'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2 rounded-lg border p-3">
                        <Checkbox 
                          id={`risk-${key}`}
                          checked={riskFactors[key as keyof typeof riskFactors]}
                          onCheckedChange={(c) => setRiskFactors(prev => ({...prev, [key]: !!c}))}
                        />
                        <Label htmlFor={`risk-${key}`} className="flex-1 cursor-pointer">{label}</Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Symptoms Tab */}
                <TabsContent value="symptoms" className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center space-x-2 rounded-lg border p-3">
                      <Checkbox 
                        id="sym-dyspnea"
                        checked={symptoms.dyspnea}
                        onCheckedChange={(c) => setSymptoms(prev => ({...prev, dyspnea: !!c}))}
                      />
                      <Label htmlFor="sym-dyspnea" className="flex-1 cursor-pointer">Dyspnea (Breathlessness)</Label>
                    </div>
                    {symptoms.dyspnea && (
                      <div className="space-y-2">
                        <Label className="text-xs">NYHA Class</Label>
                        <Select 
                          value={symptoms.dyspneaClass} 
                          onValueChange={(v: any) => setSymptoms(prev => ({...prev, dyspneaClass: v}))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="I">Class I - No limitation</SelectItem>
                            <SelectItem value="II">Class II - Mild limitation</SelectItem>
                            <SelectItem value="III">Class III - Marked limitation</SelectItem>
                            <SelectItem value="IV">Class IV - Symptoms at rest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {Object.entries({
                      palpitations: 'Palpitations',
                      syncope: 'Syncope (Fainting)',
                      edema: 'Pedal Edema',
                      fatigue: 'Fatigue',
                      orthopnea: 'Orthopnea',
                      pnd: 'PND (Nocturnal Breathlessness)'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2 rounded-lg border p-3">
                        <Checkbox 
                          id={`sym-${key}`}
                          checked={symptoms[key as keyof typeof symptoms] as boolean}
                          onCheckedChange={(c) => setSymptoms(prev => ({...prev, [key]: !!c}))}
                        />
                        <Label htmlFor={`sym-${key}`} className="flex-1 cursor-pointer">{label}</Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* BP Trend Tab */}
                <TabsContent value="bp" className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h5 className="mb-4 flex items-center gap-2 font-medium">
                      <TrendingUp className="h-4 w-4" />
                      Blood Pressure Readings
                    </h5>
                    <div className="mb-4 flex gap-2">
                      <Input 
                        type="number"
                        placeholder="Systolic"
                        className="w-24"
                        value={newBP.systolic}
                        onChange={(e) => setNewBP(prev => ({...prev, systolic: e.target.value}))}
                      />
                      <span className="flex items-center text-muted-foreground">/</span>
                      <Input 
                        type="number"
                        placeholder="Diastolic"
                        className="w-24"
                        value={newBP.diastolic}
                        onChange={(e) => setNewBP(prev => ({...prev, diastolic: e.target.value}))}
                      />
                      <span className="flex items-center text-sm text-muted-foreground">mmHg</span>
                      <Button size="sm" onClick={addBPReading}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {bpReadings.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-4">No readings recorded</p>
                    ) : (
                      <div className="space-y-2">
                        {bpReadings.map((reading) => {
                          const category = getBPCategory(reading.systolic, reading.diastolic);
                          return (
                            <div key={reading.id} className="flex items-center justify-between rounded border p-2">
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-semibold">
                                  {reading.systolic}/{reading.diastolic}
                                </span>
                                <span className={cn("text-sm font-medium", category.color)}>
                                  {category.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{reading.date}</span>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-6 w-6"
                                  onClick={() => removeBPReading(reading.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders" className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries({
                      ecg: 'ECG (12-lead)',
                      echo: 'Echocardiography',
                      tmt: 'TMT (Treadmill Test)',
                      holter: 'Holter Monitor (24h)',
                      angiography: 'Coronary Angiography',
                      cardiacEnzymes: 'Cardiac Enzymes (Troponin)',
                      lipidProfile: 'Lipid Profile',
                      bnp: 'BNP / NT-proBNP',
                      dDimer: 'D-Dimer'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2 rounded-lg border p-3">
                        <Checkbox 
                          id={`order-${key}`}
                          checked={orders[key as keyof typeof orders]}
                          onCheckedChange={(c) => setOrders(prev => ({...prev, [key]: !!c}))}
                        />
                        <Label htmlFor={`order-${key}`} className="flex-1 cursor-pointer">{label}</Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Clinical Notes & Actions */}
                <div className="mt-6 space-y-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label>Clinical Notes</Label>
                    <Textarea 
                      placeholder="Enter clinical findings..."
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isConsultant ? 'Final Diagnosis' : 'Provisional Diagnosis'}</Label>
                    <Textarea 
                      placeholder="Enter diagnosis..."
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {!isConsultant && (
                      <Button onClick={() => handleComplete('with-consultant')}>
                        <Send className="mr-2 h-4 w-4" />
                        Forward to Cardiologist
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => handleComplete('sent-to-lab')}>
                      <FlaskConical className="mr-2 h-4 w-4" />
                      Send to Lab
                    </Button>
                    {isConsultant && (
                      <>
                        <Button variant="outline" onClick={() => handleComplete('sent-to-pharmacy')}>
                          <Pill className="mr-2 h-4 w-4" />
                          Send to Pharmacy
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
                </div>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
