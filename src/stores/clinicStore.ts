import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

interface Patient {
  id: string;
  mrNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
}

interface Visit {
  id: string;
  patientId: string;
  opdNo: string;
  status: 'registered' | 'consulted' | 'procedure_pending' | 'procedure_paid' | 'completed';
  procedureFees: number | null;
  paidAmount: number;
  createdAt: string;
}

interface ClinicState {
  patients: Patient[];
  visits: Visit[];
  loading: boolean;
  error: string | null;
  
  registerPatient: (data: Omit<Patient, 'id'>) => Promise<void>;
  createVisit: (data: Omit<Visit, 'id'>) => Promise<void>;
  updateVisitStatus: (id: string, status: Visit['status']) => Promise<void>;
  fetchPatients: () => Promise<void>;
  fetchVisits: () => Promise<void>;
  getWaitingPatients: () => Visit[];
  getProcedurePending: () => Visit[];
}

export const useClinicStore = create<ClinicState>()(
  persist(
    (set, get) => ({
      patients: [],
      visits: [],
      loading: false,
      error: null,

      registerPatient: async (data) => {
        set({ loading: true });
        try {
          const { data: newPatient, error } = await supabase
            .from('patients')
            .insert(data)
            .select()
            .single();
          if (error) throw error;
          set(state => ({ patients: [...state.patients, newPatient], loading: false }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      createVisit: async (data) => {
        set({ loading: true });
        try {
          const { data: newVisit, error } = await supabase
            .from('visits')
            .insert(data)
            .select()
            .single();
          if (error) throw error;
          set(state => ({ visits: [...state.visits, newVisit], loading: false }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateVisitStatus: async (id, status) => {
        set({ loading: true });
        try {
          const { error } = await supabase
            .from('visits')
            .update({ status })
            .eq('id', id);
          if (error) throw error;
          get().fetchVisits();
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      fetchPatients: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('patients')
            .select('*')
            .order('created_at', { ascending: false });
          if (error) throw error;
          set({ patients: data || [], loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      fetchVisits: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('visits')
            .select('*, patient:patients(*)')
            .order('created_at', { ascending: false });
          if (error) throw error;
          set({ visits: data || [], loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      getWaitingPatients: () => {
        return get().visits.filter(v => v.status === 'consulted');
      },

      getProcedurePending: () => {
        return get().visits.filter(v => v.status === 'procedure_pending');
      },
    }),
    {
      name: 'clinic-storage',
    }
  )
);

