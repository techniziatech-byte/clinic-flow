export type OPDType = 'gynecology' | 'pediatrics' | 'ent' | 'dental' | 'general' | 'cardiology';

export type TokenStatus =
  | 'registered'
  | 'waiting-for-vitals'
  | 'in-vitals'
  | 'waiting-for-junior'
  | 'with-junior'
  | 'waiting-for-consultant'
  | 'with-consultant'
  | 'sent-to-lab'
  | 'waiting-for-radiology'
  | 'in-radiology'
  | 'sent-to-pharmacy'
  | 'billing-pending'
  | 'completed';

export type UserRole =
  | 'reception'
  | 'nurse'
  | 'junior-doctor'
  | 'consultant'
  | 'lab'
  | 'pharmacy'
  | 'cashier'
  | 'manager'
  | 'admin';

export interface Patient {
  id: string;
  mrNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address?: string;
  createdAt: string;
}

export interface Token {
  id: string;
  tokenNumber: string;
  patientId: string;
  patient?: Patient;
  opdType: OPDType;
  status: TokenStatus;
  priority: 'normal' | 'urgent' | 'vip';
  visitId: string;
  consultantId?: string;
  juniorDoctorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Visit {
  id: string;
  patientId: string;
  tokenId: string;
  opdType: OPDType;
  consultationFee: number;
  vitals?: Vitals;
  juniorNotes?: string;
  provisionalDiagnosis?: string;
  finalDiagnosis?: string;
  prescription?: Prescription;
  labOrders?: LabOrder[];
  pharmacyOrders?: PharmacyOrder[];
  billingItems?: BillingItem[];
  totalAmount?: number;
  paidAmount?: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface Vitals {
  id: string;
  visitId: string;
  bloodPressure: string;
  pulse: number;
  temperature: number;
  weight: number;
  height: number;
  spo2: number;
  respiratoryRate: number;
  recordedBy: string;
  recordedAt: string;
}

export interface Prescription {
  id: string;
  visitId: string;
  medicines: PrescribedMedicine[];
  notes?: string;
  prescribedBy: string;
  prescribedAt: string;
}

export interface PrescribedMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface LabOrder {
  id: string;
  visitId: string;
  testName: string;
  status: 'ordered' | 'sample-collected' | 'processing' | 'completed';
  result?: string;
  reportUrl?: string;
  orderedBy: string;
  orderedAt: string;
  completedAt?: string;
}

export interface PharmacyOrder {
  id: string;
  visitId: string;
  medicines: DispensedMedicine[];
  status: 'pending' | 'dispensed';
  dispensedBy?: string;
  dispensedAt?: string;
}

export interface DispensedMedicine {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface BillingItem {
  id: string;
  visitId: string;
  description: string;
  category: 'consultation' | 'lab' | 'pharmacy' | 'procedure';
  amount: number;
  quantity: number;
  total: number;
}

export interface OPDConfig {
  type: OPDType;
  name: string;
  prefix: string;
  consultationFee: number;
  color: string;
  icon: string;
}

export const OPD_CONFIGS: OPDConfig[] = [
  { type: 'gynecology', name: 'Gynecology', prefix: 'GYN', consultationFee: 500, color: 'opd-gynecology', icon: '👩‍⚕️' },
  { type: 'pediatrics', name: 'Pediatrics', prefix: 'PED', consultationFee: 400, color: 'opd-pediatrics', icon: '👶' },
  { type: 'ent', name: 'ENT', prefix: 'ENT', consultationFee: 450, color: 'opd-ent', icon: '👂' },
  { type: 'dental', name: 'Dental', prefix: 'DEN', consultationFee: 350, color: 'opd-dental', icon: '🦷' },
  { type: 'general', name: 'General Medicine', prefix: 'GEN', consultationFee: 300, color: 'opd-general', icon: '🏥' },
  { type: 'cardiology', name: 'Cardiology', prefix: 'CAR', consultationFee: 600, color: 'opd-cardiology', icon: '❤️' },
];

export const TOKEN_STATUS_LABELS: Record<TokenStatus, string> = {
  'registered': 'Registered',
  'waiting-for-vitals': 'Waiting for Vitals',
  'in-vitals': 'In Vitals',
  'waiting-for-junior': 'Waiting for Jr. Dr',
  'with-junior': 'With Jr. Doctor',
  'waiting-for-consultant': 'Waiting for Consultant',
  'with-consultant': 'With Consultant',
  'sent-to-lab': 'Sent to Lab',
  'waiting-for-radiology': 'Waiting for Radiology',
  'in-radiology': 'In Radiology',
  'sent-to-pharmacy': 'Sent to Pharmacy',
  'billing-pending': 'Billing Pending',
  'completed': 'Completed',
};
