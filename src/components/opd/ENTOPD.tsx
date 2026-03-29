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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  Ear, 
  FileText, 
  Clock,
  User,
  Send,
  FlaskConical,
  Pill,
  Circle
} from 'lucide-react';

export function ENTOPD() {
  const { getTokensByOPD, updateTokenStatus, currentRole } = useClinicStore();
  
  const entQueue = getTokensByOPD('ent').filter(t => 
    t.status === 'with-junior' || t.status === 'with-consultant'
  );
  
  const isConsultant = currentRole === 'consultant' || currentRole === 'admin';
  
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const selectedPatient = entQueue.find(t => t.id === selectedToken);
  
  // Ear Examination
  const [earExam, setEarExam] = useState({
    right: {
      tympanic: 'normal' as 'normal' | 'perforated' | 'retracted' | 'bulging',
      discharge: false,
      hearing: 'normal' as 'normal' | 'reduced' | 'absent',
      notes: ''
    },
    left: {
      tympanic: 'normal' as 'normal' | 'perforated' | 'retracted' | 'bulging',
      discharge: false,
      hearing: 'normal' as 'normal' | 'reduced' | 'absent',
      notes: ''
    }
  });

  // Nose Examination
  const [noseExam, setNoseExam] = useState({
    septum: 'central' as 'central' | 'deviated-left' | 'deviated-right',
    turbinates: 'normal' as 'normal' | 'hypertrophied' | 'atrophied',
    discharge: false,
    polyps: false,
    notes: ''
  });

  // Throat Examination
  const [throatExam, setThroatExam] = useState({
    tonsils: 'normal' as 'normal' | 'enlarged' | 'inflamed' | 'absent',
    pharynx: 'normal' as 'normal' | 'congested' | 'ulcerated',
    voice: 'normal' as 'normal' | 'hoarse' | 'aphonic',
    notes: ''
  });

  // Symptoms
  const [symptoms, setSymptoms] = useState({
    hearingLoss: false,
    tinnitus: false,
    vertigo: false,
    nasalBlock: false,
    sinusitis: false,
    snoring: false,
    soreThroat: false,
    dysphagia: false
  });

  // Orders
  const [orders, setOrders] = useState({
    audiometry: false,
    tympanometry: false,
    endoscopy: false,
    ctScan: false,
    throatSwab: false
  });

  const [clinicalNotes, setClinicalNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const handleComplete = (nextStatus: 'with-consultant' | 'sent-to-lab' | 'sent-to-pharmacy' | 'billing-pending') => {
    if (!selectedToken) return;
    updateTokenStatus(selectedToken, nextStatus);
    toast.success('Patient moved to next station');
    setSelectedToken(null);
  };

  const EarSection = ({ side, exam, onChange }: { 
    side: 'right' | 'left', 
    exam: typeof earExam.right, 
    onChange: (data: typeof earExam.right) => void 
  }) => (
    <div className="rounded-lg border p-4">
      <h5 className="mb-3 flex items-center gap-2 font-medium capitalize">
        <Circle className={cn("h-3 w-3", side === 'right' ? "fill-blue-500 text-blue-500" : "fill-red-500 text-red-500")} />
        {side} Ear
      </h5>
      <div className="grid gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Tympanic Membrane</Label>
          <Select value={exam.tympanic} onValueChange={(v: any) => onChange({...exam, tympanic: v})}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="perforated">Perforated</SelectItem>
              <SelectItem value="retracted">Retracted</SelectItem>
              <SelectItem value="bulging">Bulging</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Hearing</Label>
          <Select value={exam.hearing} onValueChange={(v: any) => onChange({...exam, hearing: v})}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="reduced">Reduced</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={`discharge-${side}`}
            checked={exam.discharge}
            onCheckedChange={(c) => onChange({...exam, discharge: !!c})}
          />
          <Label htmlFor={`discharge-${side}`} className="text-sm">Discharge Present</Label>
        </div>
        <Textarea 
          placeholder="Notes..."
          className="h-16 text-sm"
          value={exam.notes}
          onChange={(e) => onChange({...exam, notes: e.target.value})}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-opd-ent/20">
            <Ear className="h-6 w-6 text-opd-ent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">ENT OPD</h2>
            <p className="text-muted-foreground">
              {isConsultant ? 'Consultant Panel' : 'Junior Doctor Assessment'}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-opd-ent bg-opd-ent/10 text-opd-ent">
          {entQueue.length} Patients
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Queue Panel */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Patient Queue</CardTitle>
            <CardDescription>ENT Tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {entQueue.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No patients waiting</p>
              </div>
            ) : (
              entQueue.map((token) => (
                <button
                  key={token.id}
                  onClick={() => setSelectedToken(token.id)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition-all",
                    selectedToken === token.id
                      ? "border-opd-ent bg-opd-ent/5"
                      : "hover:border-opd-ent/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-opd-ent">
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
              ENT Assessment
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
              <Tabs defaultValue="ear" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="ear">Ear Exam</TabsTrigger>
                  <TabsTrigger value="nose">Nose Exam</TabsTrigger>
                  <TabsTrigger value="throat">Throat Exam</TabsTrigger>
                  <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>

                {/* Ear Tab */}
                <TabsContent value="ear" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <EarSection 
                      side="right" 
                      exam={earExam.right} 
                      onChange={(data) => setEarExam(prev => ({...prev, right: data}))}
                    />
                    <EarSection 
                      side="left" 
                      exam={earExam.left} 
                      onChange={(data) => setEarExam(prev => ({...prev, left: data}))}
                    />
                  </div>
                </TabsContent>

                {/* Nose Tab */}
                <TabsContent value="nose" className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h5 className="mb-4 font-medium">Nasal Examination</h5>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Septum</Label>
                        <Select 
                          value={noseExam.septum} 
                          onValueChange={(v: any) => setNoseExam(prev => ({...prev, septum: v}))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="central">Central</SelectItem>
                            <SelectItem value="deviated-left">Deviated Left</SelectItem>
                            <SelectItem value="deviated-right">Deviated Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Turbinates</Label>
                        <Select 
                          value={noseExam.turbinates} 
                          onValueChange={(v: any) => setNoseExam(prev => ({...prev, turbinates: v}))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="hypertrophied">Hypertrophied</SelectItem>
                            <SelectItem value="atrophied">Atrophied</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="nasal-discharge"
                          checked={noseExam.discharge}
                          onCheckedChange={(c) => setNoseExam(prev => ({...prev, discharge: !!c}))}
                        />
                        <Label htmlFor="nasal-discharge">Discharge Present</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="polyps"
                          checked={noseExam.polyps}
                          onCheckedChange={(c) => setNoseExam(prev => ({...prev, polyps: !!c}))}
                        />
                        <Label htmlFor="polyps">Polyps Present</Label>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label>Notes</Label>
                      <Textarea 
                        placeholder="Additional nasal findings..."
                        value={noseExam.notes}
                        onChange={(e) => setNoseExam(prev => ({...prev, notes: e.target.value}))}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Throat Tab */}
                <TabsContent value="throat" className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h5 className="mb-4 font-medium">Throat Examination</h5>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Tonsils</Label>
                        <Select 
                          value={throatExam.tonsils} 
                          onValueChange={(v: any) => setThroatExam(prev => ({...prev, tonsils: v}))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="enlarged">Enlarged</SelectItem>
                            <SelectItem value="inflamed">Inflamed</SelectItem>
                            <SelectItem value="absent">Absent (Post-op)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Pharynx</Label>
                        <Select 
                          value={throatExam.pharynx} 
                          onValueChange={(v: any) => setThroatExam(prev => ({...prev, pharynx: v}))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="congested">Congested</SelectItem>
                            <SelectItem value="ulcerated">Ulcerated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Voice</Label>
                        <Select 
                          value={throatExam.voice} 
                          onValueChange={(v: any) => setThroatExam(prev => ({...prev, voice: v}))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="hoarse">Hoarse</SelectItem>
                            <SelectItem value="aphonic">Aphonic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label>Notes</Label>
                      <Textarea 
                        placeholder="Additional throat findings..."
                        value={throatExam.notes}
                        onChange={(e) => setThroatExam(prev => ({...prev, notes: e.target.value}))}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Symptoms Tab */}
                <TabsContent value="symptoms" className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries({
                      hearingLoss: 'Hearing Loss',
                      tinnitus: 'Tinnitus (Ear Ringing)',
                      vertigo: 'Vertigo / Dizziness',
                      nasalBlock: 'Nasal Blockage',
                      sinusitis: 'Sinusitis Symptoms',
                      snoring: 'Snoring / Sleep Apnea',
                      soreThroat: 'Sore Throat',
                      dysphagia: 'Difficulty Swallowing'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2 rounded-lg border p-3">
                        <Checkbox 
                          id={`sym-${key}`}
                          checked={symptoms[key as keyof typeof symptoms]}
                          onCheckedChange={(c) => setSymptoms(prev => ({...prev, [key]: !!c}))}
                        />
                        <Label htmlFor={`sym-${key}`} className="flex-1 cursor-pointer">{label}</Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders" className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries({
                      audiometry: 'Audiometry (Hearing Test)',
                      tympanometry: 'Tympanometry',
                      endoscopy: 'Nasal Endoscopy',
                      ctScan: 'CT Scan (Sinuses/Temporal)',
                      throatSwab: 'Throat Swab Culture'
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
