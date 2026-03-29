import { useState } from 'react';
import { useClinicStore } from '@/stores/clinicStore';
import { OPD_CONFIGS, OPDType } from '@/types/clinic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Search, UserPlus, Printer, QrCode } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useDoctorStore } from '@/stores/doctorStore';

interface DoctorSelectionProps {
  opdType: OPDType;
  selectedDoctor: string | null;
  onSelect: (id: string) => void;
}

const DoctorSelection = ({ opdType, selectedDoctor, onSelect }: DoctorSelectionProps) => {
  const { getAvailableDoctors } = useDoctorStore();
  // In a real app, pass actual date/time. Here, we mock "now".
  const doctors = getAvailableDoctors(opdType, new Date(), "10:00");

  return (
    <div className="space-y-2">
      <Label>Assign Doctor (Simulated Shift: 10:00 AM)</Label>
      <Select value={selectedDoctor || undefined} onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Auto-assign available doctor" />
        </SelectTrigger>
        <SelectContent>
          {doctors.length > 0 ? (
            doctors.map(d => (
              <SelectItem key={d.id} value={d.id}>
                {d.name} {d.isJunior ? '(Junior)' : '(Consultant)'}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>No doctors available now</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

interface PatientRegistrationFormProps {
  onSuccess?: () => void;
}

export function PatientRegistrationForm({ onSuccess }: PatientRegistrationFormProps) {
  const { addPatient, createToken, findPatientByPhone, findPatientByMR, patients } = useClinicStore();

  const [step, setStep] = useState<'search' | 'register' | 'opd' | 'success'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [selectedOPD, setSelectedOPD] = useState<OPDType | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'vip'>('normal');
  const [autoCheckIn, setAutoCheckIn] = useState(true);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    phone: '',
    email: '',
    address: '',
  });

  const handleSearch = () => {
    const patient = findPatientByPhone(searchQuery) || findPatientByMR(searchQuery);
    if (patient) {
      setSelectedPatient(patient);
      setStep('opd');
      toast.success('Patient found!', {
        description: `${patient.firstName} ${patient.lastName} - ${patient.mrNumber}`,
      });
    } else {
      toast.info('No patient found', {
        description: 'Register as new patient',
      });
      setStep('register');
    }
  };

  const handleRegister = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.dateOfBirth) {
      toast.error('Please fill all required fields');
      return;
    }

    const newPatient = await addPatient(formData);
    setSelectedPatient(newPatient);
    setStep('opd');
    toast.success('Patient registered successfully!', {
      description: `MR Number: ${newPatient.mrNumber}`,
    });
  };

  const handleGenerateToken = async () => {
    if (!selectedPatient || !selectedOPD) return;

    const token = await createToken(selectedPatient.id, selectedOPD, priority, selectedDoctor || undefined);

    setGeneratedToken(token.tokenNumber);
    setStep('success');
    toast.success('Token generated!', {
      description: `Token: ${token.tokenNumber}`,
    });
  };

  const handleReset = () => {
    setStep('search');
    setSearchQuery('');
    setSelectedPatient(null);
    setSelectedOPD(null);
    setPriority('normal');
    setGeneratedToken(null);
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      phone: '',
      email: '',
      address: '',
    });
    onSuccess?.();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4">
        {['Search', 'Details', 'Select OPD', 'Token'].map((label, index) => {
          const stepIndex = ['search', 'register', 'opd', 'success'].indexOf(step);
          const isActive = index <= stepIndex;
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {index + 1}
              </div>
              <span className={cn(
                "hidden text-sm font-medium sm:inline",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {label}
              </span>
              {index < 3 && (
                <div className={cn(
                  "h-0.5 w-8",
                  isActive ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Search Step */}
      {step === 'search' && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Existing Patient
            </CardTitle>
            <CardDescription>
              Search by phone number or MR number
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter phone or MR number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
            <div className="text-center">
              <span className="text-sm text-muted-foreground">or</span>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setStep('register')}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Register New Patient
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Registration Step */}
      {step === 'register' && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              New Patient Registration
            </CardTitle>
            <CardDescription>
              Enter patient details to create MR record
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Ali"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Khan"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value as any })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+923001234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ali.khan@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="House 123, Street 4, Islamabad"
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep('search')}>
                Back
              </Button>
              <Button onClick={handleRegister}>
                Register & Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* OPD Selection Step */}
      {step === 'opd' && selectedPatient && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Select OPD Department</CardTitle>
            <CardDescription>
              Patient: {selectedPatient.firstName} {selectedPatient.lastName} ({selectedPatient.mrNumber})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {OPD_CONFIGS.map((opd) => (
                <button
                  key={opd.type}
                  onClick={() => { setSelectedOPD(opd.type); setSelectedDoctor(null); }}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                    selectedOPD === opd.type
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-3xl">{opd.icon}</span>
                  <span className="font-medium">{opd.name}</span>
                  <span className="text-sm text-muted-foreground">PKR {opd.consultationFee}</span>
                </button>
              ))}
            </div>

            {selectedOPD && (
              <div className="space-y-4 animate-fade-in">
                <DoctorSelection
                  opdType={selectedOPD}
                  selectedDoctor={selectedDoctor}
                  onSelect={setSelectedDoctor}
                />

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoCheckIn"
                    checked={autoCheckIn}
                    onCheckedChange={(c) => setAutoCheckIn(c === true)}
                  />
                  <Label htmlFor="autoCheckIn" className="cursor-pointer">
                    Check-in immediately (Set status to 'Waiting')
                  </Label>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep('search')}>
                Back
              </Button>
              <Button onClick={handleGenerateToken} disabled={!selectedOPD}>
                Generate Token
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Step */}
      {step === 'success' && generatedToken && selectedPatient && (
        <Card className="animate-scale-in">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-status-completed/10">
                <QrCode className="h-8 w-8 text-status-completed" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Token Generated!</h2>

              <div className="my-6 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6">
                <p className="text-sm text-muted-foreground">Token Number</p>
                <p className="token-display mt-2 text-primary">{generatedToken}</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{selectedPatient.mrNumber}</p>
              </div>

              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Slip
                </Button>
                <Button onClick={handleReset}>
                  New Registration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
