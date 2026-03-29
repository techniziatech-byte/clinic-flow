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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  Heart, 
  Calendar, 
  Baby, 
  FileText, 
  Clock,
  User,
  Send,
  FlaskConical,
  Pill,
  Calculator
} from 'lucide-react';
import { addDays, differenceInWeeks, format, parseISO } from 'date-fns';

export function GynecologyOPD() {
  const { getTokensByOPD, updateTokenStatus, currentRole, patients } = useClinicStore();
  
  const gynQueue = getTokensByOPD('gynecology').filter(t => 
    t.status === 'with-junior' || t.status === 'with-consultant'
  );
  
  const isConsultant = currentRole === 'consultant' || currentRole === 'admin';
  
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const selectedPatient = gynQueue.find(t => t.id === selectedToken);
  
  // LMP/EDD Calculator
  const [lmp, setLmp] = useState('');
  const eddCalculation = useMemo(() => {
    if (!lmp) return null;
    try {
      const lmpDate = parseISO(lmp);
      const edd = addDays(lmpDate, 280);
      const gestationalWeeks = differenceInWeeks(new Date(), lmpDate);
      return {
        edd: format(edd, 'PPP'),
        gestationalAge: `${gestationalWeeks} weeks`,
        trimester: gestationalWeeks <= 12 ? 1 : gestationalWeeks <= 27 ? 2 : 3
      };
    } catch {
      return null;
    }
  }, [lmp]);

  // Obstetric History
  const [obstetricHistory, setObstetricHistory] = useState({
    gravida: 0,
    para: 0,
    abortions: 0,
    living: 0
  });

  // Menstrual History
  const [menstrualHistory, setMenstrualHistory] = useState({
    cycleLength: 28,
    cycleDuration: 5,
    regularity: 'regular' as 'regular' | 'irregular',
    dysmenorrhea: false
  });

  // Risk Factors
  const [riskFactors, setRiskFactors] = useState({
    previousCSection: false,
    gestationalDiabetes: false,
    preeclampsia: false,
    multiplePregnancy: false,
    advancedMaternalAge: false,
    anemia: false,
    thyroidDisorder: false
  });

  // Lab Orders
  const [labOrders, setLabOrders] = useState({
    cbc: false,
    hcg: false,
    hormonalProfile: false,
    thyroidProfile: false,
    urineRoutine: false,
    ultrasound: false,
    papSmear: false
  });

  const [clinicalNotes, setClinicalNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const handleComplete = (nextStatus: 'with-consultant' | 'sent-to-lab' | 'sent-to-pharmacy' | 'billing-pending') => {
    if (!selectedToken) return;
    updateTokenStatus(selectedToken, nextStatus);
    toast.success('Patient moved to next station');
    setSelectedToken(null);
    resetForm();
  };

  const resetForm = () => {
    setLmp('');
    setObstetricHistory({ gravida: 0, para: 0, abortions: 0, living: 0 });
    setMenstrualHistory({ cycleLength: 28, cycleDuration: 5, regularity: 'regular', dysmenorrhea: false });
    setRiskFactors({
      previousCSection: false,
      gestationalDiabetes: false,
      preeclampsia: false,
      multiplePregnancy: false,
      advancedMaternalAge: false,
      anemia: false,
      thyroidDisorder: false
    });
    setLabOrders({
      cbc: false,
      hcg: false,
      hormonalProfile: false,
      thyroidProfile: false,
      urineRoutine: false,
      ultrasound: false,
      papSmear: false
    });
    setClinicalNotes('');
    setDiagnosis('');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-opd-gynecology/20">
            <Heart className="h-6 w-6 text-opd-gynecology" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gynecology OPD</h2>
            <p className="text-muted-foreground">
              {isConsultant ? 'Consultant Panel' : 'Junior Doctor Assessment'}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-opd-gynecology bg-opd-gynecology/10 text-opd-gynecology">
          {gynQueue.length} Patients
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Queue Panel */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Patient Queue</CardTitle>
            <CardDescription>GYN Tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {gynQueue.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No patients waiting</p>
              </div>
            ) : (
              gynQueue.map((token) => (
                <button
                  key={token.id}
                  onClick={() => setSelectedToken(token.id)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition-all",
                    selectedToken === token.id
                      ? "border-opd-gynecology bg-opd-gynecology/5"
                      : "hover:border-opd-gynecology/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-opd-gynecology">
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
              Clinical Assessment
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
              <Tabs defaultValue="pregnancy" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="pregnancy">Pregnancy</TabsTrigger>
                  <TabsTrigger value="obstetric">Obstetric Hx</TabsTrigger>
                  <TabsTrigger value="menstrual">Menstrual Hx</TabsTrigger>
                  <TabsTrigger value="risks">Risk Factors</TabsTrigger>
                  <TabsTrigger value="orders">Lab Orders</TabsTrigger>
                </TabsList>

                {/* LMP/EDD Tab */}
                <TabsContent value="pregnancy" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Last Menstrual Period (LMP)
                      </Label>
                      <Input 
                        type="date" 
                        value={lmp} 
                        onChange={(e) => setLmp(e.target.value)}
                      />
                    </div>
                    {eddCalculation && (
                      <Card className="bg-opd-gynecology/5 border-opd-gynecology/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 text-opd-gynecology">
                            <Calculator className="h-5 w-5" />
                            <span className="font-semibold">Calculated Values</span>
                          </div>
                          <div className="mt-3 grid gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">EDD:</span>
                              <span className="font-medium">{eddCalculation.edd}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Gestational Age:</span>
                              <span className="font-medium">{eddCalculation.gestationalAge}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Trimester:</span>
                              <Badge variant="outline">{eddCalculation.trimester}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                {/* Obstetric History Tab */}
                <TabsContent value="obstetric" className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-4 flex items-center gap-2 font-semibold">
                      <Baby className="h-5 w-5" />
                      Obstetric History (GPAL)
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Gravida (G)</Label>
                        <Input 
                          type="number" 
                          min={0}
                          value={obstetricHistory.gravida}
                          onChange={(e) => setObstetricHistory(prev => ({...prev, gravida: parseInt(e.target.value) || 0}))}
                        />
                        <p className="text-xs text-muted-foreground">Total pregnancies</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Para (P)</Label>
                        <Input 
                          type="number" 
                          min={0}
                          value={obstetricHistory.para}
                          onChange={(e) => setObstetricHistory(prev => ({...prev, para: parseInt(e.target.value) || 0}))}
                        />
                        <p className="text-xs text-muted-foreground">Live births</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Abortions (A)</Label>
                        <Input 
                          type="number" 
                          min={0}
                          value={obstetricHistory.abortions}
                          onChange={(e) => setObstetricHistory(prev => ({...prev, abortions: parseInt(e.target.value) || 0}))}
                        />
                        <p className="text-xs text-muted-foreground">Miscarriages</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Living (L)</Label>
                        <Input 
                          type="number" 
                          min={0}
                          value={obstetricHistory.living}
                          onChange={(e) => setObstetricHistory(prev => ({...prev, living: parseInt(e.target.value) || 0}))}
                        />
                        <p className="text-xs text-muted-foreground">Living children</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Menstrual History Tab */}
                <TabsContent value="menstrual" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Cycle Length (days)</Label>
                      <Input 
                        type="number" 
                        value={menstrualHistory.cycleLength}
                        onChange={(e) => setMenstrualHistory(prev => ({...prev, cycleLength: parseInt(e.target.value) || 28}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration (days)</Label>
                      <Input 
                        type="number" 
                        value={menstrualHistory.cycleDuration}
                        onChange={(e) => setMenstrualHistory(prev => ({...prev, cycleDuration: parseInt(e.target.value) || 5}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Regularity</Label>
                      <Select 
                        value={menstrualHistory.regularity}
                        onValueChange={(v: 'regular' | 'irregular') => setMenstrualHistory(prev => ({...prev, regularity: v}))}
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
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox 
                        id="dysmenorrhea"
                        checked={menstrualHistory.dysmenorrhea}
                        onCheckedChange={(c) => setMenstrualHistory(prev => ({...prev, dysmenorrhea: !!c}))}
                      />
                      <Label htmlFor="dysmenorrhea">Dysmenorrhea (Painful periods)</Label>
                    </div>
                  </div>
                </TabsContent>

                {/* Risk Factors Tab */}
                <TabsContent value="risks" className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries({
                      previousCSection: 'Previous C-Section',
                      gestationalDiabetes: 'Gestational Diabetes',
                      preeclampsia: 'Pre-eclampsia History',
                      multiplePregnancy: 'Multiple Pregnancy',
                      advancedMaternalAge: 'Advanced Maternal Age (>35)',
                      anemia: 'Anemia',
                      thyroidDisorder: 'Thyroid Disorder'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2 rounded-lg border p-3">
                        <Checkbox 
                          id={key}
                          checked={riskFactors[key as keyof typeof riskFactors]}
                          onCheckedChange={(c) => setRiskFactors(prev => ({...prev, [key]: !!c}))}
                        />
                        <Label htmlFor={key} className="flex-1 cursor-pointer">{label}</Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Lab Orders Tab */}
                <TabsContent value="orders" className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries({
                      cbc: 'Complete Blood Count (CBC)',
                      hcg: 'HCG (Pregnancy Test)',
                      hormonalProfile: 'Hormonal Profile',
                      thyroidProfile: 'Thyroid Profile',
                      urineRoutine: 'Urine Routine',
                      ultrasound: 'Ultrasound',
                      papSmear: 'Pap Smear'
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
