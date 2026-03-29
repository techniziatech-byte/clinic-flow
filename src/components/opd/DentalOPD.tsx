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
  FileText, 
  Clock,
  User,
  Send,
  FlaskConical,
  Pill
} from 'lucide-react';

// Tooth chart positions (FDI notation)
const UPPER_TEETH = ['18','17','16','15','14','13','12','11','21','22','23','24','25','26','27','28'];
const LOWER_TEETH = ['48','47','46','45','44','43','42','41','31','32','33','34','35','36','37','38'];

type ToothStatus = 'present' | 'missing' | 'decayed' | 'filled' | 'crown' | 'rct';

export function DentalOPD() {
  const { getTokensByOPD, updateTokenStatus, currentRole } = useClinicStore();
  
  const denQueue = getTokensByOPD('dental').filter(t => 
    t.status === 'with-junior' || t.status === 'with-consultant'
  );
  
  const isConsultant = currentRole === 'consultant' || currentRole === 'admin';
  
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const selectedPatient = denQueue.find(t => t.id === selectedToken);
  
  // Tooth Chart
  const [toothChart, setToothChart] = useState<Record<string, ToothStatus>>({});
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);

  // Complaints
  const [complaints, setComplaints] = useState({
    pain: false,
    painLocation: '',
    bleeding: false,
    sensitivity: false,
    looseness: false,
    swelling: false,
    badBreath: false
  });

  // Oral Hygiene Assessment
  const [oralHygiene, setOralHygiene] = useState({
    hygiene: 'fair' as 'good' | 'fair' | 'poor',
    gumHealth: 'healthy' as 'healthy' | 'gingivitis' | 'periodontitis',
    plaque: 'minimal' as 'none' | 'minimal' | 'moderate' | 'heavy'
  });

  // Planned Procedures
  const [procedures, setProcedures] = useState({
    extraction: false,
    extractionTeeth: '',
    filling: false,
    fillingTeeth: '',
    scaling: false,
    rootCanal: false,
    rootCanalTeeth: '',
    crown: false,
    crownTeeth: ''
  });

  // X-ray Orders
  const [xrayOrders, setXrayOrders] = useState({
    opg: false,
    iopa: false,
    cbct: false
  });

  const [clinicalNotes, setClinicalNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const handleComplete = (nextStatus: 'with-consultant' | 'sent-to-lab' | 'sent-to-pharmacy' | 'billing-pending') => {
    if (!selectedToken) return;
    updateTokenStatus(selectedToken, nextStatus);
    toast.success('Patient moved to next station');
    setSelectedToken(null);
  };

  const getToothColor = (status: ToothStatus | undefined) => {
    switch (status) {
      case 'missing': return 'bg-muted text-muted-foreground line-through';
      case 'decayed': return 'bg-red-500 text-white';
      case 'filled': return 'bg-blue-500 text-white';
      case 'crown': return 'bg-amber-500 text-white';
      case 'rct': return 'bg-purple-500 text-white';
      default: return 'bg-background border';
    }
  };

  const handleToothClick = (tooth: string) => {
    setSelectedTooth(tooth);
  };

  const setToothStatus = (status: ToothStatus) => {
    if (selectedTooth) {
      setToothChart(prev => ({...prev, [selectedTooth]: status}));
      setSelectedTooth(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-opd-dental/20 text-2xl">
            🦷
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Dental OPD</h2>
            <p className="text-muted-foreground">
              {isConsultant ? 'Consultant Panel' : 'Dental Assistant Screening'}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-opd-dental bg-opd-dental/10 text-opd-dental">
          {denQueue.length} Patients
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Queue Panel */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Patient Queue</CardTitle>
            <CardDescription>DEN Tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {denQueue.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No patients waiting</p>
              </div>
            ) : (
              denQueue.map((token) => (
                <button
                  key={token.id}
                  onClick={() => setSelectedToken(token.id)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition-all",
                    selectedToken === token.id
                      ? "border-opd-dental bg-opd-dental/5"
                      : "hover:border-opd-dental/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-opd-dental">
                      {token.tokenNumber}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {token.status === 'with-junior' ? 'Screening' : 'Dentist'}
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
              Dental Assessment
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
              <Tabs defaultValue="chart" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="chart">Tooth Chart</TabsTrigger>
                  <TabsTrigger value="complaints">Complaints</TabsTrigger>
                  <TabsTrigger value="hygiene">Oral Hygiene</TabsTrigger>
                  <TabsTrigger value="procedures">Procedures</TabsTrigger>
                  <TabsTrigger value="xray">X-Ray Orders</TabsTrigger>
                </TabsList>

                {/* Tooth Chart Tab */}
                <TabsContent value="chart" className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h5 className="font-medium">Dental Chart (FDI Notation)</h5>
                      {selectedTooth && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Tooth {selectedTooth}:</span>
                          <div className="flex gap-1">
                            {(['present', 'missing', 'decayed', 'filled', 'crown', 'rct'] as ToothStatus[]).map(status => (
                              <Button 
                                key={status}
                                size="sm"
                                variant="outline"
                                className={cn("h-7 text-xs capitalize", getToothColor(status))}
                                onClick={() => setToothStatus(status)}
                              >
                                {status === 'rct' ? 'RCT' : status}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Upper Teeth */}
                    <div className="mb-2 flex justify-center gap-1">
                      {UPPER_TEETH.map(tooth => (
                        <button
                          key={tooth}
                          onClick={() => handleToothClick(tooth)}
                          className={cn(
                            "h-10 w-7 rounded text-xs font-medium transition-all",
                            getToothColor(toothChart[tooth]),
                            selectedTooth === tooth && "ring-2 ring-primary"
                          )}
                        >
                          {tooth}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <div className="h-4 w-[80%] border-b-2 border-dashed border-muted-foreground/30" />
                    </div>
                    {/* Lower Teeth */}
                    <div className="mt-2 flex justify-center gap-1">
                      {LOWER_TEETH.map(tooth => (
                        <button
                          key={tooth}
                          onClick={() => handleToothClick(tooth)}
                          className={cn(
                            "h-10 w-7 rounded text-xs font-medium transition-all",
                            getToothColor(toothChart[tooth]),
                            selectedTooth === tooth && "ring-2 ring-primary"
                          )}
                        >
                          {tooth}
                        </button>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded border bg-background" />
                        <span>Present</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded bg-muted" />
                        <span>Missing</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded bg-red-500" />
                        <span>Decayed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded bg-blue-500" />
                        <span>Filled</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded bg-amber-500" />
                        <span>Crown</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded bg-purple-500" />
                        <span>RCT</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Complaints Tab */}
                <TabsContent value="complaints" className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center space-x-2 rounded-lg border p-3">
                      <Checkbox 
                        id="pain"
                        checked={complaints.pain}
                        onCheckedChange={(c) => setComplaints(prev => ({...prev, pain: !!c}))}
                      />
                      <Label htmlFor="pain" className="flex-1 cursor-pointer">Tooth Pain</Label>
                    </div>
                    {complaints.pain && (
                      <div className="space-y-2">
                        <Input 
                          placeholder="Pain location (tooth number)"
                          value={complaints.painLocation}
                          onChange={(e) => setComplaints(prev => ({...prev, painLocation: e.target.value}))}
                        />
                      </div>
                    )}
                    {Object.entries({
                      bleeding: 'Gum Bleeding',
                      sensitivity: 'Sensitivity to Hot/Cold',
                      looseness: 'Loose Teeth',
                      swelling: 'Swelling',
                      badBreath: 'Bad Breath (Halitosis)'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2 rounded-lg border p-3">
                        <Checkbox 
                          id={`comp-${key}`}
                          checked={complaints[key as keyof typeof complaints] as boolean}
                          onCheckedChange={(c) => setComplaints(prev => ({...prev, [key]: !!c}))}
                        />
                        <Label htmlFor={`comp-${key}`} className="flex-1 cursor-pointer">{label}</Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Oral Hygiene Tab */}
                <TabsContent value="hygiene" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Oral Hygiene</Label>
                      <Select 
                        value={oralHygiene.hygiene} 
                        onValueChange={(v: any) => setOralHygiene(prev => ({...prev, hygiene: v}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Gum Health</Label>
                      <Select 
                        value={oralHygiene.gumHealth} 
                        onValueChange={(v: any) => setOralHygiene(prev => ({...prev, gumHealth: v}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="healthy">Healthy</SelectItem>
                          <SelectItem value="gingivitis">Gingivitis</SelectItem>
                          <SelectItem value="periodontitis">Periodontitis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Plaque Accumulation</Label>
                      <Select 
                        value={oralHygiene.plaque} 
                        onValueChange={(v: any) => setOralHygiene(prev => ({...prev, plaque: v}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="heavy">Heavy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* Procedures Tab */}
                <TabsContent value="procedures" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-2 rounded-lg border p-3">
                      <Checkbox 
                        id="scaling"
                        checked={procedures.scaling}
                        onCheckedChange={(c) => setProcedures(prev => ({...prev, scaling: !!c}))}
                      />
                      <Label htmlFor="scaling" className="flex-1 cursor-pointer">Scaling & Polishing</Label>
                    </div>
                    
                    <div className="grid gap-2 rounded-lg border p-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="extraction"
                          checked={procedures.extraction}
                          onCheckedChange={(c) => setProcedures(prev => ({...prev, extraction: !!c}))}
                        />
                        <Label htmlFor="extraction" className="cursor-pointer">Extraction</Label>
                      </div>
                      {procedures.extraction && (
                        <Input 
                          placeholder="Teeth to extract (e.g., 18, 28)"
                          value={procedures.extractionTeeth}
                          onChange={(e) => setProcedures(prev => ({...prev, extractionTeeth: e.target.value}))}
                        />
                      )}
                    </div>

                    <div className="grid gap-2 rounded-lg border p-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filling"
                          checked={procedures.filling}
                          onCheckedChange={(c) => setProcedures(prev => ({...prev, filling: !!c}))}
                        />
                        <Label htmlFor="filling" className="cursor-pointer">Filling / Restoration</Label>
                      </div>
                      {procedures.filling && (
                        <Input 
                          placeholder="Teeth to fill (e.g., 36, 46)"
                          value={procedures.fillingTeeth}
                          onChange={(e) => setProcedures(prev => ({...prev, fillingTeeth: e.target.value}))}
                        />
                      )}
                    </div>

                    <div className="grid gap-2 rounded-lg border p-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="rootCanal"
                          checked={procedures.rootCanal}
                          onCheckedChange={(c) => setProcedures(prev => ({...prev, rootCanal: !!c}))}
                        />
                        <Label htmlFor="rootCanal" className="cursor-pointer">Root Canal Treatment</Label>
                      </div>
                      {procedures.rootCanal && (
                        <Input 
                          placeholder="Teeth for RCT"
                          value={procedures.rootCanalTeeth}
                          onChange={(e) => setProcedures(prev => ({...prev, rootCanalTeeth: e.target.value}))}
                        />
                      )}
                    </div>

                    <div className="grid gap-2 rounded-lg border p-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="crown"
                          checked={procedures.crown}
                          onCheckedChange={(c) => setProcedures(prev => ({...prev, crown: !!c}))}
                        />
                        <Label htmlFor="crown" className="cursor-pointer">Crown / Bridge</Label>
                      </div>
                      {procedures.crown && (
                        <Input 
                          placeholder="Teeth for crown/bridge"
                          value={procedures.crownTeeth}
                          onChange={(e) => setProcedures(prev => ({...prev, crownTeeth: e.target.value}))}
                        />
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* X-Ray Tab */}
                <TabsContent value="xray" className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries({
                      opg: 'OPG (Orthopantomogram)',
                      iopa: 'IOPA (Intraoral Periapical)',
                      cbct: 'CBCT (3D Imaging)'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2 rounded-lg border p-3">
                        <Checkbox 
                          id={`xray-${key}`}
                          checked={xrayOrders[key as keyof typeof xrayOrders]}
                          onCheckedChange={(c) => setXrayOrders(prev => ({...prev, [key]: !!c}))}
                        />
                        <Label htmlFor={`xray-${key}`} className="flex-1 cursor-pointer">{label}</Label>
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
                        Forward to Dentist
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => handleComplete('sent-to-lab')}>
                      <FlaskConical className="mr-2 h-4 w-4" />
                      Send for X-Ray
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
