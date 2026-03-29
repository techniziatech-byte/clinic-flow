import { useState, useMemo } from 'react';
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
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  Baby, 
  FileText, 
  Clock,
  User,
  Send,
  FlaskConical,
  Pill,
  TrendingUp,
  Syringe,
  Scale
} from 'lucide-react';
import { differenceInMonths, differenceInYears, parseISO } from 'date-fns';

export function PediatricsOPD() {
  const { getTokensByOPD, updateTokenStatus, currentRole, patients } = useClinicStore();
  
  const pedQueue = getTokensByOPD('pediatrics').filter(t => 
    t.status === 'with-junior' || t.status === 'with-consultant'
  );
  
  const isConsultant = currentRole === 'consultant' || currentRole === 'admin';
  
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const selectedPatient = pedQueue.find(t => t.id === selectedToken);
  
  // Child's Age Calculation
  const [dob, setDob] = useState('');
  const ageCalculation = useMemo(() => {
    if (!dob) return null;
    try {
      const dobDate = parseISO(dob);
      const years = differenceInYears(new Date(), dobDate);
      const months = differenceInMonths(new Date(), dobDate) % 12;
      return { years, months, total: `${years}y ${months}m` };
    } catch {
      return null;
    }
  }, [dob]);

  // Growth Parameters
  const [growth, setGrowth] = useState({
    weight: '',
    height: '',
    headCircumference: ''
  });

  // Calculate BMI and percentiles (simplified)
  const growthMetrics = useMemo(() => {
    const w = parseFloat(growth.weight);
    const h = parseFloat(growth.height);
    if (!w || !h) return null;
    const heightM = h / 100;
    const bmi = w / (heightM * heightM);
    return {
      bmi: bmi.toFixed(1),
      weightPercentile: Math.min(95, Math.max(5, Math.round(w * 2))), // Simplified
      heightPercentile: Math.min(95, Math.max(5, Math.round(h * 0.6))) // Simplified
    };
  }, [growth.weight, growth.height]);

  // Feeding History
  const [feeding, setFeeding] = useState({
    type: 'breastfed' as 'breastfed' | 'formula' | 'mixed' | 'solid',
    notes: ''
  });

  // Immunization Record
  const [immunizations, setImmunizations] = useState({
    bcg: false,
    opv: false,
    dpt: false,
    hepatitisB: false,
    mmr: false,
    varicella: false,
    hib: false,
    rotavirus: false
  });

  // Developmental Milestones
  const [milestones, setMilestones] = useState({
    motor: '',
    language: '',
    social: ''
  });

  // Lab Orders
  const [labOrders, setLabOrders] = useState({
    cbc: false,
    urineRoutine: false,
    stoolExam: false,
    bloodSugar: false,
    serumElectrolytes: false
  });

  const [clinicalNotes, setClinicalNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const handleComplete = (nextStatus: 'with-consultant' | 'sent-to-lab' | 'sent-to-pharmacy' | 'billing-pending') => {
    if (!selectedToken) return;
    updateTokenStatus(selectedToken, nextStatus);
    toast.success('Patient moved to next station');
    setSelectedToken(null);
  };

  const immunizationLabels: Record<string, string> = {
    bcg: 'BCG (Birth)',
    opv: 'OPV (Polio)',
    dpt: 'DPT (Diphtheria, Pertussis, Tetanus)',
    hepatitisB: 'Hepatitis B',
    mmr: 'MMR (Measles, Mumps, Rubella)',
    varicella: 'Varicella (Chickenpox)',
    hib: 'Hib (Haemophilus influenzae)',
    rotavirus: 'Rotavirus'
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-opd-pediatrics/20">
            <Baby className="h-6 w-6 text-opd-pediatrics" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Pediatrics OPD</h2>
            <p className="text-muted-foreground">
              {isConsultant ? 'Consultant Panel' : 'Junior Doctor Assessment'}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-opd-pediatrics bg-opd-pediatrics/10 text-opd-pediatrics">
          {pedQueue.length} Patients
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Queue Panel */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Patient Queue</CardTitle>
            <CardDescription>PED Tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {pedQueue.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No patients waiting</p>
              </div>
            ) : (
              pedQueue.map((token) => (
                <button
                  key={token.id}
                  onClick={() => setSelectedToken(token.id)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition-all",
                    selectedToken === token.id
                      ? "border-opd-pediatrics bg-opd-pediatrics/5"
                      : "hover:border-opd-pediatrics/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-opd-pediatrics">
                      {token.tokenNumber}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {token.status === 'with-junior' ? 'Jr. Dr' : 'Consultant'}
                    </Badge>
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
              Pediatric Assessment
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
              <Tabs defaultValue="growth" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="growth">Growth</TabsTrigger>
                  <TabsTrigger value="feeding">Feeding</TabsTrigger>
                  <TabsTrigger value="immunization">Immunization</TabsTrigger>
                  <TabsTrigger value="development">Development</TabsTrigger>
                  <TabsTrigger value="orders">Lab Orders</TabsTrigger>
                </TabsList>

                {/* Growth Tab */}
                <TabsContent value="growth" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input 
                        type="date" 
                        value={dob} 
                        onChange={(e) => setDob(e.target.value)}
                      />
                      {ageCalculation && (
                        <p className="text-sm text-muted-foreground">
                          Age: <span className="font-semibold text-foreground">{ageCalculation.total}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-4 flex items-center gap-2 font-semibold">
                      <Scale className="h-5 w-5" />
                      Growth Parameters
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Weight (kg)</Label>
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="e.g., 15.5"
                          value={growth.weight}
                          onChange={(e) => setGrowth(prev => ({...prev, weight: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Height (cm)</Label>
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="e.g., 95"
                          value={growth.height}
                          onChange={(e) => setGrowth(prev => ({...prev, height: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Head Circumference (cm)</Label>
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="e.g., 48"
                          value={growth.headCircumference}
                          onChange={(e) => setGrowth(prev => ({...prev, headCircumference: e.target.value}))}
                        />
                      </div>
                    </div>
                  </div>

                  {growthMetrics && (
                    <Card className="bg-opd-pediatrics/5 border-opd-pediatrics/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-opd-pediatrics">
                          <TrendingUp className="h-5 w-5" />
                          <span className="font-semibold">Growth Metrics</span>
                        </div>
                        <div className="mt-3 grid gap-4 sm:grid-cols-3">
                          <div>
                            <p className="text-sm text-muted-foreground">BMI</p>
                            <p className="text-lg font-semibold">{growthMetrics.bmi}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Weight Percentile</p>
                            <div className="flex items-center gap-2">
                              <Progress value={growthMetrics.weightPercentile} className="h-2" />
                              <span className="text-sm font-medium">{growthMetrics.weightPercentile}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Height Percentile</p>
                            <div className="flex items-center gap-2">
                              <Progress value={growthMetrics.heightPercentile} className="h-2" />
                              <span className="text-sm font-medium">{growthMetrics.heightPercentile}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Feeding Tab */}
                <TabsContent value="feeding" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Feeding Type</Label>
                      <Select 
                        value={feeding.type}
                        onValueChange={(v) => setFeeding(prev => ({...prev, type: v as any}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breastfed">Exclusively Breastfed</SelectItem>
                          <SelectItem value="formula">Formula Fed</SelectItem>
                          <SelectItem value="mixed">Mixed Feeding</SelectItem>
                          <SelectItem value="solid">Solid Foods / Weaning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Feeding Notes</Label>
                      <Textarea 
                        placeholder="Enter feeding history, frequency, any issues..."
                        value={feeding.notes}
                        onChange={(e) => setFeeding(prev => ({...prev, notes: e.target.value}))}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Immunization Tab */}
                <TabsContent value="immunization" className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-4 flex items-center gap-2 font-semibold">
                      <Syringe className="h-5 w-5" />
                      Immunization Record
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Object.entries(immunizationLabels).map(([key, label]) => (
                        <div key={key} className="flex items-center space-x-2 rounded-lg border p-3">
                          <Checkbox 
                            id={`imm-${key}`}
                            checked={immunizations[key as keyof typeof immunizations]}
                            onCheckedChange={(c) => setImmunizations(prev => ({...prev, [key]: !!c}))}
                          />
                          <Label htmlFor={`imm-${key}`} className="flex-1 cursor-pointer text-sm">{label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Development Tab */}
                <TabsContent value="development" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Motor Milestones</Label>
                      <Textarea 
                        placeholder="e.g., Sitting, crawling, walking, running - achieved ages..."
                        value={milestones.motor}
                        onChange={(e) => setMilestones(prev => ({...prev, motor: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Language Milestones</Label>
                      <Textarea 
                        placeholder="e.g., First words, sentences, vocabulary..."
                        value={milestones.language}
                        onChange={(e) => setMilestones(prev => ({...prev, language: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Social Milestones</Label>
                      <Textarea 
                        placeholder="e.g., Eye contact, social smile, stranger anxiety, play behavior..."
                        value={milestones.social}
                        onChange={(e) => setMilestones(prev => ({...prev, social: e.target.value}))}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Lab Orders Tab */}
                <TabsContent value="orders" className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries({
                      cbc: 'Complete Blood Count (CBC)',
                      urineRoutine: 'Urine Routine',
                      stoolExam: 'Stool Examination',
                      bloodSugar: 'Blood Sugar',
                      serumElectrolytes: 'Serum Electrolytes'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2 rounded-lg border p-3">
                        <Checkbox 
                          id={`lab-${key}`}
                          checked={labOrders[key as keyof typeof labOrders]}
                          onCheckedChange={(c) => setLabOrders(prev => ({...prev, [key]: !!c}))}
                        />
                        <Label htmlFor={`lab-${key}`} className="flex-1 cursor-pointer">{label}</Label>
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
                        Forward to Consultant
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
