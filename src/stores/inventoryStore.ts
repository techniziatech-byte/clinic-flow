import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

interface RawMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

interface FinishedProduct {
  id: string;
  name: string;
  quantity: number;
  costPrice: number;
  sellPrice: number;
}

interface InventoryState {
  rawMaterials: RawMaterial[];
  finishedProducts: FinishedProduct[];
  loading: boolean;
  
  fetchInventory: () => Promise<void>;
  convertToFinished: (rawIds: string[], productData: Omit<FinishedProduct, 'id'>) => Promise<void>;
  updateStock: (id: string, quantity: number, type: 'raw' | 'finished') => Promise<void>;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      rawMaterials: [],
      finishedProducts: [],
      loading: false,

      fetchInventory: async () => {
        set({ loading: true });
        try {
          const [{ data: raw }, { data: finished }] = await Promise.all([
            supabase.from('raw_materials').select('*'),
            supabase.from('finished_products').select('*')
          ]);
          set({ rawMaterials: raw || [], finishedProducts: finished || [], loading: false });
        } catch (error) {
          console.error('Inventory fetch error:', error);
          set({ loading: false });
        }
      },

      convertToFinished: async (rawIds, productData) => {
        try {
          // Deduct raw materials
          for (const rawId of rawIds) {
            await supabase
              .from('raw_materials')
              .update({ quantity: supabase.rpc('decrement_quantity', { item_id: rawId, amount: 1 }) });
          }

          // Add finished product
          const { data, error } = await supabase
            .from('finished_products')
            .insert({ ...productData, quantity: 1 })
            .select()
            .single();
          if (error) throw error;
          
          get().fetchInventory();
        } catch (error) {
          console.error('Conversion error:', error);
        }
      },

      updateStock: async (id, quantity, type) => {
        const table = type === 'raw' ? 'raw_materials' : 'finished_products';
        const { error } = await supabase
          .from(table)
          .update({ quantity })
          .eq('id', id);
        if (error) console.error(error);
        else get().fetchInventory();
      },
    }),
    { name: 'inventory-storage' }
  )
);

