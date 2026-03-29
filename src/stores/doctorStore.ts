import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { Doctor } from '@/types/doctor';

interface DoctorState {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  
  fetchDoctors: () => Promise<void>;
  addDoctor: (data: Omit<Doctor, 'id' | 'created_at'>) => Promise<void>;
  updateDoctor: (id: string, data: Partial<Doctor>) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
}

export const useDoctorStore = create<DoctorState>()(
  persist(
    (set, get) => ({
      doctors: [],
      loading: false,
      error: null,

      fetchDoctors: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('doctors')
            .select('*')
            .order('name');
          if (error) throw error;
          set({ doctors: data || [], loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      addDoctor: async (data) => {
        set({ loading: true });
        try {
          const { error } = await supabase
            .from('doctors')
            .insert(data);
          if (error) throw error;
          get().fetchDoctors(); // Refresh list
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateDoctor: async (id, data) => {
        set({ loading: true });
        try {
          const { error } = await supabase
            .from('doctors')
            .update(data)
            .eq('id', id);
          if (error) throw error;
          get().fetchDoctors();
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      deleteDoctor: async (id) => {
        set({ loading: true });
        try {
          const { error } = await supabase
            .from('doctors')
            .delete()
            .eq('id', id);
          if (error) throw error;
          get().fetchDoctors();
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },
    }),
    {
      name: 'doctor-storage',
    }
  )
);

