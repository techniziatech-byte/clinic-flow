
import { OPDType } from './clinic';

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialization: OPDType[]; // Array since mapped to multiple OPDs
  registrationNumber: string;
  contactNumber: string;
  email: string;
  roomNumber: string;
  consultationFee: Record<OPDType, number>; // Fee per OPD
  photoUrl?: string;
  isJunior: boolean;
  consultantId?: string; // If junior, linked to consultant
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  opdType: OPDType;
  dayOfWeek: number; // 0-6 (Sun-Sat) or 1-7 (Mon-Sun) - standardized to 0=Sun
  startTime: string; // "09:00"
  endTime: string; // "13:00"
  slotDuration: number; // minutes
  maxPatients: number;
  breakStartTime?: string;
  breakEndTime?: string;
  isEmergencyOverride: boolean;
}

export interface DoctorLeave {
  id: string;
  doctorId: string;
  startDate: string;
  endDate: string;
  reason: string;
  substituteDoctorId?: string;
}
