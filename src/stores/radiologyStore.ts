import { create } from 'zustand';
import { RadiologyOrder, RadiologyTest, RadiologyAppointment, RadiologyResult, Modality } from '@/types/radiology';
import * as db from '@/lib/supabaseData';

interface RadiologyState {
  orders: RadiologyOrder[];
  tests: RadiologyTest[];
  modalities: Modality[];
  appointments: RadiologyAppointment[];
  results: RadiologyResult[];
  initialized: boolean;

  initialize: () => Promise<void>;
  addOrder: (order: Omit<RadiologyOrder, 'id' | 'status' | 'orderDate'>) => Promise<void>;
  updateTestStatus: (orderId: string, testId: string, status: RadiologyOrder['tests'][0]['status']) => void;
  scheduleAppointment: (appointment: Omit<RadiologyAppointment, 'id' | 'status'>) => void;
  saveReport: (result: Omit<RadiologyResult, 'id' | 'createdAt'>) => void;
  getPendingOrders: () => RadiologyOrder[];
  getScheduledAppointments: () => RadiologyAppointment[];
}

export const useRadiologyStore = create<RadiologyState>((set, get) => ({
  orders: [],
  tests: [],
  modalities: [],
  appointments: [],
  results: [],
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;
    try {
      const [tests, modalities, orders] = await Promise.all([
        db.fetchRadiologyTests(),
        db.fetchRadiologyModalities(),
        db.fetchRadiologyOrders(),
      ]);
      set({
        tests: tests as RadiologyTest[],
        modalities: modalities as Modality[],
        orders: orders as RadiologyOrder[],
        initialized: true,
      });
    } catch (error) {
      console.error('Failed to load radiology data:', error);
      set({ initialized: true });
    }
  },

  addOrder: async (orderData) => {
    try {
      await db.addRadiologyOrder(orderData);
      const orders = await db.fetchRadiologyOrders();
      set({ orders: orders as RadiologyOrder[] });
    } catch (error) {
      console.error('Failed to add radiology order:', error);
    }
  },

  updateTestStatus: (orderId, testId, status) => set(state => ({
    orders: state.orders.map(o => {
      if (o.id === orderId) {
        const updatedTests = o.tests.map(t => t.testId === testId ? { ...t, status } : t);
        const allReported = updatedTests.every(t => t.status === 'reported');
        return { ...o, tests: updatedTests, status: allReported ? 'reported' : o.status };
      }
      return o;
    }),
  })),

  scheduleAppointment: (apptData) => set(state => {
    const newAppt: RadiologyAppointment = {
      ...apptData,
      id: crypto.randomUUID(),
      status: 'scheduled',
    };
    const updatedOrders = state.orders.map(o => {
      if (o.id === apptData.orderId) {
        return { ...o, tests: o.tests.map(t => t.testId === apptData.testId ? { ...t, status: 'scheduled' as const } : t) };
      }
      return o;
    });
    return { appointments: [newAppt, ...state.appointments], orders: updatedOrders };
  }),

  saveReport: (resultData) => set(state => {
    const newResult: RadiologyResult = {
      ...resultData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'final',
      finalizedAt: new Date().toISOString(),
    };
    const updatedOrders = state.orders.map(o => {
      if (o.id === resultData.orderId) {
        return { ...o, tests: o.tests.map(t => t.testId === resultData.testId ? { ...t, status: 'reported' as const } : t) };
      }
      return o;
    });
    return { results: [...state.results, newResult], orders: updatedOrders };
  }),

  getPendingOrders: () => get().orders.filter(o => o.status === 'pending' || o.status === 'scheduled'),
  getScheduledAppointments: () => get().appointments.filter(a => a.status === 'scheduled'),
}));
