
export type LabTestStatus = 'pending' | 'collected' | 'processing' | 'completed' | 'verified' | 'cancelled';
export type LabSampleType = 'blood' | 'urine' | 'stool' | 'sputum' | 'swab' | 'tissue';
export type LabDepartment = 'hematology' | 'biochemistry' | 'microbiology' | 'pathology' | 'serology';

export interface LabTest {
    id: string;
    code: string;
    name: string;
    department: LabDepartment;
    sampleType: LabSampleType;
    price: number;
    tatHours: number; // Turnaround time
    referenceRange?: string;
    units?: string;
    isActive: boolean;
}

export interface LabOrder {
    id: string;
    visitId?: string;
    patientId: string;
    doctorId: string;
    orderDate: string;
    status: LabTestStatus;
    priority: 'normal' | 'urgent';
    tests: {
        testId: string;
        testName: string;
        price: number;
        status: LabTestStatus;
        result?: string;
        notes?: string;
    }[];
    totalAmount: number;
    clinicalNotes?: string;
}

export interface LabSample {
    id: string; // Barcode ID
    orderId: string;
    testIds: string[];
    patientName: string;
    sampleType: LabSampleType;
    collectedAt?: string;
    collectedBy?: string;
    status: 'collected' | 'received' | 'processing' | 'stored' | 'disposed';
}

export interface LabResult {
    id: string;
    orderId: string;
    testId: string;
    patientId: string;
    value: string;
    units: string;
    referenceRange: string;
    isAbnormal: boolean;
    isCritical: boolean;
    technicianId?: string;
    pathologistId?: string;
    verifiedAt?: string;
    comments?: string;
}

export interface LabInventoryItem {
    id: string;
    name: string;
    type: 'reagent' | 'consumable' | 'equipment';
    quantity: number;
    unit: string;
    expiryDate: string;
    reorderLevel: number;
    supplier?: string;
}
