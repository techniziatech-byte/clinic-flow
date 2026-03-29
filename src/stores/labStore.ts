import { create } from 'zustand';
import { LabTest, LabOrder, LabSample, LabResult, LabInventoryItem } from '@/types/lab';
import * as db from '@/lib/supabaseData';

interface LabState {
  tests: LabTest[];
  orders: LabOrder[];
  samples: LabSample[];
  results: LabResult[];
  inventory: LabInventoryItem[];
  initialized: boolean;

  initialize: () => Promise<void>;
  addOrder: (order: Omit<LabOrder, 'id' | 'status' | 'orderDate'>) => Promise<void>;
  updateOrderStatus: (id: string, status: LabOrder['status']) => void;
  collectSample: (orderId: string, sampleType: string) => void;
  processSample: (sampleId: string) => void;
  submitResult: (orderId: string, testId: string, result: Partial<LabResult>) => void;
  verifyResult: (resultId: string) => void;
  getPendingOrders: () => LabOrder[];
  getPendingSamples: () => LabSample[];
  getTestsByDept: (dept: string) => LabTest[];
}

export const useLabStore = create<LabState>((set, get) => ({
  tests: [],
  orders: [],
  samples: [],
  results: [],
  inventory: [],
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;
    try {
      const [tests, orders, inventory] = await Promise.all([
        db.fetchLabTests(),
        db.fetchLabOrders(),
        db.fetchLabInventory(),
      ]);
      set({
        tests: tests as LabTest[],
        orders: orders as LabOrder[],
        inventory: inventory as LabInventoryItem[],
        initialized: true,
      });
    } catch (error) {
      console.error('Failed to load lab data:', error);
      set({ initialized: true });
    }
  },

  addOrder: async (orderData) => {
    try {
      await db.addLabOrder(orderData);
      const orders = await db.fetchLabOrders();
      set({ orders: orders as LabOrder[] });
    } catch (error) {
      console.error('Failed to add lab order:', error);
    }
  },

  updateOrderStatus: async (id, status) => {
    set(state => ({
      orders: state.orders.map(o => o.id === id ? { ...o, status } : o),
    }));
    try {
      await db.updateLabOrderStatus(id, status);
    } catch (error) {
      console.error('Failed to update lab order:', error);
    }
  },

  collectSample: (orderId, sampleType) => set(state => {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return state;
    const newSample: LabSample = {
      id: `SAMP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      orderId,
      testIds: order.tests.map((t: any) => t.testId),
      patientName: 'Unknown',
      sampleType: sampleType as any,
      collectedAt: new Date().toISOString(),
      status: 'collected',
    };
    return {
      samples: [...state.samples, newSample],
      orders: state.orders.map(o => o.id === orderId ? { ...o, status: 'collected' as const } : o),
    };
  }),

  processSample: (sampleId) => set(state => ({
    samples: state.samples.map(s =>
      s.id === sampleId ? { ...s, status: 'processing' as const, receivedAt: new Date().toISOString() } : s
    ),
  })),

  submitResult: (orderId, testId, resultData) => set(state => {
    const newResult: LabResult = {
      id: crypto.randomUUID(),
      orderId,
      testId,
      patientId: 'p1',
      value: '',
      units: '',
      referenceRange: '',
      isAbnormal: false,
      isCritical: false,
      ...resultData,
    };
    return { results: [...state.results, newResult] };
  }),

  verifyResult: (resultId) => set(state => ({
    results: state.results.map(r =>
      r.id === resultId ? { ...r, verifiedAt: new Date().toISOString() } : r
    ),
  })),

  getPendingOrders: () => get().orders.filter(o => o.status === 'pending'),
  getPendingSamples: () => get().samples.filter(s => s.status === 'collected' || s.status === 'received'),
  getTestsByDept: (dept) => get().tests.filter(t => t.department === dept),
}));
