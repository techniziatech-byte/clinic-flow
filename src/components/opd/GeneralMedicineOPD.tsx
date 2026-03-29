import { useState } from 'react';
import { useClinicStore } from '@/stores/clinicStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  Stethoscope,
  FileText, 
  Clock,
  User,
  Send,
  FlaskConical,
  Pill,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { OPD_CONFIGS } from '@/types/clinic';

export function GeneralMedicineOPD() {
  const { getTokensByOPD, updateTokenStatus, currentRole } = useClinicStore();
  
  const genQueue = getTokensByOPD('general').filter(t => 
    t.status === 'with-junior' || t.status === 'with-consultant'
  );
  
  const isConsultant = currentRole === 'consultant' || currentRole === 'admin';
  
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const selectedPatient = genQueue.find(t => t.id === selectedToken);
  
  // System-wise Examination
  const [systemExam, setSystemExam] = useState({
    cardiovascular: { normal: true, notes: '' },
    respiratory: { normal: true, notes: '' },
    gastrointestinal: { normal: true, notes: '' },
    neurological: { normal: true, notes: '' },
    musculoskeletal: { normal: true, notes: '' },
    genitourinary: { normal: true, notes: '' },
    skin: { normal: true, notes: '' }
  });

  // Chronic Conditions
  const [chronicConditions, setChronicConditions] = useState({
    diabetes: false,
    hypertension: false,
    asthma: false,
    copd: false,
    thyroid: false,
    cardiac: false,
    renal: false,
    hepatic: false,
    other: ''
  });

  // Lifestyle Assessment
  const [lifestyle, setLifestyle] = useState({
    smoking: 'never' as 'never' | 'current' | 'former',
    alcohol: 'never' as 'never' | 'occasional' | 'regular' | 'heavy',
    exercise: 'sedentary' as 'sedentary' | 'light' | 'moderate' | 'active',
    diet: '',
    sleep: ''
  });

  // Allergies
  const [allergies, setAllergies] = useState('');

  // Referral
  const [referral, setReferral] = useState({
    needed: false,
    to: ''
  });

  // Lab Orders
  const [labOrders, setLabOrders] = useState({
    cbc: false,
    bloodSugar: false,
    lipidProfile: false,
    liverFunction: false,
    renalFunction: false,
    thyroidProfile: false,
    urineRoutine: false,
    ecg: false,
    chestXray: false
  });

  const [clinicalNotes, setClinicalNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const handleComplete = (nextStatus: 'with-consultant' | 'sent-to-lab' | 'sent-to-pharmacy' | 'billing-pending') => {
    if (!selectedToken) return;
    updateTokenStatus(selectedToken, nextStatus);
    toast.success('Patient moved to next station');
    setSelectedToken(null);
  };

  const systemLabels: Record<string, string> = {
    cardiovascular: 'Cardiovascular System',
    respiratory: 'Respiratory System',
    gastrointestinal: 'Gastrointestinal System',
    neurological: 'Neurological System',
    musculoskeletal: 'Musculoskeletal System',
    genitourinary: 'Genitourinary System',
    skin: 'Skin & Integumentary'
  };

  const specialtyOPDs = OPD_CONFIGS.filter(c => c.type !== 'general');

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-opd-general/20">
            <Stethoscope className="h-6 w-6 text-opd-general" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">General Medicine OPD</h2>
            <p className="text-muted-foreground">
              {isConsultant ? 'Consultant Physician' : 'Junior Doctor Assessment'}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-opd-general bg-opd-general/10 text-opd-general">
          {genQueue.length} Patients
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Queue Panel */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Patient Queue</CardTitle>
            <CardDescription>GEN Tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {genQueue.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No patients waiting</p>
              </div>
            ) : (
              genQueue.map((token) => (
                <button
                  key={token.id}
                  onClick={() => setSelectedToken(token.id)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition-all",
                    selectedToken === token.id
                      ? "border-opd-general bg-opd-general/5"
                      : "hover:border-opd-general/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-opd-general">
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
              General Medical Assessment
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
              <Tabs defaultValue="system" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="system">System Exam</TabsTrigger>
                  <TabsTrigger value="chronic">Chronic</TabsTrigger>
                  <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
                  <TabsTrigger value="referral">Referral</TabsTrigger>
                  <TabsTrigger value="orders">Lab Orders</TabsTrigger>
                </TabsList>

                {/* System-wise Exam Tab */}
                <TabsContent value="system" className="space-y-4">
                  <div className="grid gap-3">
                    {Object.entries(systemLabels).map(([key, label]) => {
                      const exam = systemExam[key as keyof typeof systemExam];
                      return (
                        <div key={key} className="rounded-lg border p-3">
                          <div className="flex items-center justify-between">
                            <Label className="font-medium">{label}</Label>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`${key}-normal`}
                                  checked={exam.normal}
                                  onCheckedChange={(c) => setSystemExam(prev => ({
                                    ...prev, 
                                    [key]: {...prev[key as keyof typeof systemExam], normal: !!c}
                                  }))}
                                />
                                <Label htmlFor={`${key}-normal`} className="text-sm">Normal</Label>
                              </div>
                            </div>
                          </div>
                          {!exam.normal && (
                            <Textarea 
                              className="mt-2 h-16"
                              placeholder={`Abnormal findings for ${label}...`}
                              value={exam.notes}
                              onChange={(e) => setSystemExam(prev => ({
                                ...prev,
                                [key]: {...prev[key as keyof typeof systemExam], notes: e.target.value}
                              }))}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Chronic Conditions Tab */}
                <TabsContent value="chronic" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Known Allergies
                    </Label>
                    <Textarea 
                      placeholder="List any known allergies (drugs, food, environmental)..."
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries({
                      diabetes: 'Diabetes Mellitus',
                      hypertension: 'Hypertension',
                      asthma: 'Asthma',
                      copd: 'COPD',
                      thyroid: 'Thyroid Disorder',
                      cardiac: 'Cardiac Disease',
                      renal: 'Chronic Kidney Disease',
                      hepatic: 'Liver Disease'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2 rounded-lg border p-3">
                        <Checkbox 
                          id={`chronic-${key}`}
                          checked={chronicConditions[key as keyof typeof chronicConditions] as boolean}
                          onCheckedChange={(c) => setChronicConditions(prev => ({...prev, [key]: !!c}))}
                        />
                        <Label htmlFor={`chronic-${key}`} className="flex-1 cursor-pointer">{label}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label>Other Conditions</Label>
                    <Input 
                      placeholder="Other chronic conditions..."
                      value={chronicConditions.other}
                      onChange={(e) => setChronicConditions(prev => ({...prev, other: e.target.value}))}
                    />
                  </div>
                </TabsContent>

                {/* Lifestyle Tab */}
                <TabsContent value="lifestyle" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Smoking</Label>
                      <Select 
                        value={lifestyle.smoking} 
                        onValueChange={(v: any) => setLifestyle(prev => ({...prev, smoking: v}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="current">Current Smoker</SelectItem>
                          <SelectItem value="former">Former Smoker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Alcohol</Label>
                      <Select 
                        value={lifestyle.alcohol} 
                        onValueChange={(v: any) => setLifestyle(prev => ({...prev, alcohol: v}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="occasional">Occasional</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="heavy">Heavy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Exercise</Label>
                      <Select 
                        value={lifestyle.exercise} 
                        onValueChange={(v: any) => setLifestyle(prev => ({...prev, exercise: v}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary</SelectItem>
                          <SelectItem value="light">Light Activity</SelectItem>
                          <SelectItem value="moderate">Moderate Exercise</SelectItem>
                          <SelectItem value="active">Highly Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Diet Habits</Label>
                      <Textarea 
                        placeholder="Describe diet habits..."
                        value={lifestyle.diet}
                        onChange={(e) => setLifestyle(prev => ({...prev, diet: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sleep Pattern</Label>
                      <Textarea 
                        placeholder="Hours of sleep, quality, any issues..."
                        value={lifestyle.sleep}
                        onChange={(e) => setLifestyle(prev => ({...prev, sleep: e.target.value}))}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Referral Tab */}
                <TabsContent value="referral" className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="referral-needed"
                        checked={referral.needed}
                        onCheckedChange={(c) => setReferral(prev => ({...prev, needed: !!c}))}
                      />
                      <Label htmlFor="referral-needed" className="font-medium">
                        <ArrowRight className="mr-1 inline h-4 w-4" />
                        Referral to Specialty OPD Required
                      </Label>
                    </div>
                    
                    {referral.needed && (
                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        {specialtyOPDs.map(opd => (
                          <button
                            key={opd.type}
                            onClick={() => setReferral(prev => ({...prev, to: opd.type}))}
                            className={cn(
                              "rounded-lg border p-3 text-left transition-all",
                              referral.to === opd.type
                                ? "border-primary bg-primary/5"
                                : "hover:border-primary/50"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{opd.icon}</span>
                              <span className="font-medium">{opd.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Lab Orders Tab */}
                <TabsContent value="orders" className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries({
                      cbc: 'Complete Blood Count (CBC)',
                      bloodSugar: 'Blood Sugar (Fasting/PP)',
                      lipidProfile: 'Lipid Profile',
                      liverFunction: 'Liver Function Test (LFT)',
                      renalFunction: 'Renal Function Test (RFT)',
                      thyroidProfile: 'Thyroid Profile',
                      urineRoutine: 'Urine Routine',
                      ecg: 'ECG',
                      chestXray: 'Chest X-Ray'
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
