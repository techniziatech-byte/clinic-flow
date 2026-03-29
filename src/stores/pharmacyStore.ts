import { create } from 'zustand';
import { Medicine, Prescription, PharmacySale } from '@/types/pharmacy';
import * as db from '@/lib/supabaseData';

interface PharmacyState {
  medicines: Medicine[];
  prescriptions: Prescription[];
  sales: PharmacySale[];
  initialized: boolean;

  initialize: () => Promise<void>;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => Promise<void>;
  updateMedicine: (id: string, updates: Partial<Medicine>) => Promise<void>;
  deleteMedicine: (id: string) => Promise<void>;
  createPrescription: (prescription: Omit<Prescription, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  dispensePrescription: (id: string, saleData: Omit<PharmacySale, 'id' | 'createdAt'>) => Promise<void>;
  getLowStockMedicines: () => Medicine[];
  searchMedicines: (query: string) => Medicine[];
}

export const usePharmacyStore = create<PharmacyState>((set, get) => ({
  medicines: [],
  prescriptions: [],
  sales: [],
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;
    try {
      const [medicines, prescriptions] = await Promise.all([
        db.fetchMedicines(),
        db.fetchPrescriptions(),
      ]);
      set({
        medicines: medicines as Medicine[],
        prescriptions: prescriptions as Prescription[],
        initialized: true,
      });
    } catch (error) {
      console.error('Failed to load pharmacy data:', error);
      set({ initialized: true });
    }
  },

  addMedicine: async (medicine) => {
    try {
      await db.addMedicine(medicine);
      const medicines = await db.fetchMedicines();
      set({ medicines: medicines as Medicine[] });
    } catch (error) {
      console.error('Failed to add medicine:', error);
    }
  },

  updateMedicine: async (id, updates) => {
    set(state => ({
      medicines: state.medicines.map(m => m.id === id ? { ...m, ...updates } : m),
    }));
    try {
      await db.updateMedicine(id, updates);
    } catch (error) {
      console.error('Failed to update medicine:', error);
    }
  },

  deleteMedicine: async (id) => {
    set(state => ({ medicines: state.medicines.filter(m => m.id !== id) }));
    try {
      await db.deleteMedicine(id);
    } catch (error) {
      console.error('Failed to delete medicine:', error);
    }
  },

  createPrescription: async (prescriptionData) => {
    try {
      await db.createPrescription(prescriptionData);
      const prescriptions = await db.fetchPrescriptions();
      set({ prescriptions: prescriptions as Prescription[] });
    } catch (error) {
      console.error('Failed to create prescription:', error);
    }
  },

  dispensePrescription: async (id, saleData) => {
    try {
      await db.dispensePrescription(id);
      await db.createPharmacySale(saleData);
      
      // Refresh data
      const [medicines, prescriptions] = await Promise.all([
        db.fetchMedicines(),
        db.fetchPrescriptions(),
      ]);
      set({
        medicines: medicines as Medicine[],
        prescriptions: prescriptions as Prescription[],
      });
    } catch (error) {
      console.error('Failed to dispense prescription:', error);
    }
  },

  getLowStockMedicines: () => get().medicines.filter(m => m.currentStock <= m.reorderLevel),
  searchMedicines: (query) => {
    const q = query.toLowerCase();
    return get().medicines.filter(m =>
      m.name.toLowerCase().includes(q) || m.genericName?.toLowerCase().includes(q)
    );
  },
}));
