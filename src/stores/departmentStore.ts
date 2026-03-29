import { create } from 'zustand';
import { Department } from '@/types/department';
import * as db from '@/lib/supabaseData';

interface DepartmentState {
  departments: Department[];
  initialized: boolean;
  initialize: () => Promise<void>;
  getDepartmentBySlug: (slug: string) => Department | undefined;
  addDepartment: (dept: Department) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
}

// Fallback departments used when DB is empty
const fallbackDepartments: Department[] = [
  {
    id: 'dept-1', slug: 'orthopaedics', name: 'Orthopaedics', icon: 'Bone',
    tagline: 'Restoring Mobility, Enhancing Life',
    heroImage: 'https://images.pexels.com/photos/7446995/pexels-photo-7446995.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    overview: 'Our Orthopaedics department specializes in the diagnosis, correction, prevention, and treatment of patients with skeletal deformities.',
    diseasesTreated: ['Arthritis', 'Fractures', 'Spinal Deformities', 'Sports Injuries'],
    capabilities: ['Joint Replacement', 'Arthroscopy', 'Spine Surgery'],
    services: ['Total Knee Replacement', 'Hip Replacement', 'Shoulder Surgery'],
    procedures: ['ACL Reconstruction', 'Meniscus Repair'],
    doctorIds: [],
    technology: [{ name: 'Robotic Surgery System', description: 'For precise joint replacements' }],
    patientCare: { protocols: ['Infection Control'], approach: 'Holistic rehabilitation', rehabSupport: 'Dedicated physio team' },
    contact: { phone: '+1234567890', whatsapp: '+1234567890', location: 'Block A, 1st Floor' },
  },
  {
    id: 'dept-2', slug: 'cardiology', name: 'Cardiology', icon: 'Heart',
    tagline: 'Advanced Heart Care for a Healthy Life',
    heroImage: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    overview: 'Comprehensive cardiac care ranging from preventive checks to complex interventions.',
    diseasesTreated: ['Coronary Artery Disease', 'Heart Failure', 'Arrhythmia'],
    capabilities: ['Interventional Cardiology', 'Electrophysiology'],
    services: ['Angiography', 'Angioplasty', 'Pacemaker Implantation'],
    procedures: ['Coronary Stenting', 'Ablation Therapy'],
    doctorIds: [],
    technology: [{ name: 'Cath Lab', description: 'State-of-the-art flat panel cath lab' }],
    patientCare: { protocols: ['Rapid Response'], approach: 'Patient-first cardiac care', rehabSupport: 'Cardiac rehabilitation' },
    contact: { phone: '+1234567891', whatsapp: '+1234567891', location: 'Block B, Ground Floor' },
  },
];

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  departments: fallbackDepartments,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;
    try {
      const departments = await db.fetchDepartments();
      set({
        departments: departments.length > 0 ? departments as Department[] : fallbackDepartments,
        initialized: true,
      });
    } catch (error) {
      console.error('Failed to load departments:', error);
      set({ initialized: true });
    }
  },

  getDepartmentBySlug: (slug) => get().departments.find(d => d.slug === slug),
  addDepartment: (dept) => set(state => ({ departments: [...state.departments, dept] })),
  updateDepartment: (id, dept) => set(state => ({
    departments: state.departments.map(d => d.id === id ? { ...d, ...dept } : d),
  })),
  deleteDepartment: (id) => set(state => ({
    departments: state.departments.filter(d => d.id !== id),
  })),
}));
