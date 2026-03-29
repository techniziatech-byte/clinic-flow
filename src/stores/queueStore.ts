import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

interface Token {
  id: string;
  token_number: string;
  patient_name: string;
  current_station: 'registration' | 'opd' | 'procedure' | 'pharmacy';
  payment_cleared: boolean;
  procedure_required: boolean;
  status: string;
}

interface QueueState {
  tokens: Token[];
  
  fetchTokens: () => Promise<void>;
  updateTokenStatus: (id: string, updates: Partial<Token>) => Promise<void>;
  getCurrentOPD: () => Token | null;
  getWaitingOPD: () => Token[];
  getPendingPayment: () => Token[];
  getProcedureQueue: () => Token[];
}

export const useQueueStore = create<QueueState>()(
  persist(
    (set, get) => ({
      tokens: [],

      fetchTokens: async () => {
        const { data } = await supabase
          .from('tokens')
          .select('*')
          .order('created_at');
        set({ tokens: data || [] });
      },

      updateTokenStatus: async (id, updates) => {
        const { error } = await supabase
          .from('tokens')
          .update(updates)
          .eq('id', id);
        if (!error) get().fetchTokens();
      },

      getCurrentOPD: () => get().tokens.find(t => t.current_station === 'opd' && t.payment_cleared),
      getWaitingOPD: () => get().tokens.filter(t => t.current_station === 'opd' && !t.payment_cleared === false),
      getPendingPayment: () => get().tokens.filter(t => t.procedure_required && !t.payment_cleared),
      getProcedureQueue: () => get().tokens.filter(t => t.current_station === 'procedure' && t.payment_cleared),
    }),
    { name: 'queue-storage' }
  )
);

