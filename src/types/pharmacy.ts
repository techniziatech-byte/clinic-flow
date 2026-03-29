
import { UserRole } from './clinic';

export type MedicineCategory = 'tablet' | 'syrup' | 'injection' | 'ointment' | 'drops' | 'surgical' | 'other';

export interface Medicine {
    id: string;
    name: string;
    genericName?: string;
    brand?: string;
    category: MedicineCategory;
    strength?: string;
    unit?: string;
    manufacturer?: string;
    hsnCode?: string;
    sellingPrice: number;
    purchasePrice: number;
    reorderLevel: number;
    currentStock: number;
    batchNumber?: string; // Simplification: current active batch
    expiryDate?: string; // Simplification
    location?: string; // Rack/Shelf
    status: 'active' | 'inactive';
}

export interface PrescriptionItem {
    medicineId: string;
    medicineName: string;
    dosage: string; // e.g., "1-0-1"
    frequency: string;
    duration: string;
    quantity: number;
    notes?: string;
}

export interface Prescription {
    id: string;
    visitId: string;
    patientId: string;
    doctorId: string;
    tokenNumber: string; // For easy reference
    items: PrescriptionItem[];
    priority: 'normal' | 'emergency';
    status: 'pending' | 'dispensed' | 'cancelled';
    notes?: string;
    createdAt: string;
    dispensedAt?: string;
    dispensedBy?: string; // pharmacist ID
}

export interface PharmacySale {
    id: string;
    prescriptionId?: string; // Optional (OTC)
    visitId?: string;
    patientId?: string;
    patientName: string;
    items: {
        medicineId: string;
        medicineName: string;
        quantity: number;
        pricePerUnit: number;
        totalPrice: number;
        batchNumber: string;
    }[];
    totalAmount: number;
    discount: number;
    finalAmount: number;
    paymentMode: 'cash' | 'card' | 'upi';
    status: 'completed' | 'refunded';
    createdAt: string;
    createdBy: string;
}
