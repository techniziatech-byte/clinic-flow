
export type ModalityType = 'X-RAY' | 'ULTRASOUND' | 'CT' | 'MRI' | 'DOPPLER' | 'MAMMOGRAPHY';
export type RadiologyStatus = 'pending' | 'scheduled' | 'waiting' | 'in-procedure' | 'images-uploaded' | 'reported' | 'cancelled';
export type PriorityLevel = 'routine' | 'urgent' | 'emergency';

export interface Modality {
    id: string;
    name: string;
    type: ModalityType;
    roomNumber: string;
    status: 'active' | 'maintenance';
}

export interface RadiologyTest {
    id: string;
    code: string;
    name: string;
    modality: ModalityType;
    price: number;
    preparationInstructions?: string;
}

export interface RadiologyOrder {
    id: string;
    visitId: string;
    patientId: string;
    doctorId: string; // Ordering doctor
    orderDate: string;
    priority: PriorityLevel;
    clinicalIndications?: string;
    tests: {
        testId: string;
        testName: string;
        modality: ModalityType;
        price: number;
        status: RadiologyStatus;
    }[];
    totalAmount: number;
    status: RadiologyStatus; // Overall status
}

export interface RadiologyAppointment {
    id: string;
    orderId: string;
    testId: string;
    patientId: string;
    modalityId: string;
    scheduledTime: string;
    technicianId?: string;
    status: 'scheduled' | 'checked-in' | 'completed' | 'cancelled';
}

export interface RadiologyResult {
    id: string;
    orderId: string;
    testId: string;
    patientId: string;
    radiologistId: string;
    reportContent: string;
    imageUrls: string[];
    findings: string;
    impression: string;
    status: 'draft' | 'final';
    createdAt: string;
    finalizedAt?: string;
}
