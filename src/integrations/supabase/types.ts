export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      billing_items: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string
          id: string
          quantity: number
          total: number
          visit_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description: string
          id?: string
          quantity?: number
          total: number
          visit_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string
          id?: string
          quantity?: number
          total?: number
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_items_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          capabilities: string[] | null
          contact: Json | null
          diseases_treated: string[] | null
          doctor_ids: string[] | null
          hero_image: string | null
          icon: string | null
          id: string
          name: string
          overview: string | null
          patient_care: Json | null
          procedures: string[] | null
          services: string[] | null
          slug: string
          tagline: string | null
          technology: Json | null
        }
        Insert: {
          capabilities?: string[] | null
          contact?: Json | null
          diseases_treated?: string[] | null
          doctor_ids?: string[] | null
          hero_image?: string | null
          icon?: string | null
          id?: string
          name: string
          overview?: string | null
          patient_care?: Json | null
          procedures?: string[] | null
          services?: string[] | null
          slug: string
          tagline?: string | null
          technology?: Json | null
        }
        Update: {
          capabilities?: string[] | null
          contact?: Json | null
          diseases_treated?: string[] | null
          doctor_ids?: string[] | null
          hero_image?: string | null
          icon?: string | null
          id?: string
          name?: string
          overview?: string | null
          patient_care?: Json | null
          procedures?: string[] | null
          services?: string[] | null
          slug?: string
          tagline?: string | null
          technology?: Json | null
        }
        Relationships: []
      }
      doctor_leaves: {
        Row: {
          doctor_id: string
          end_date: string
          id: string
          reason: string | null
          start_date: string
          substitute_doctor_id: string | null
        }
        Insert: {
          doctor_id: string
          end_date: string
          id?: string
          reason?: string | null
          start_date: string
          substitute_doctor_id?: string | null
        }
        Update: {
          doctor_id?: string
          end_date?: string
          id?: string
          reason?: string | null
          start_date?: string
          substitute_doctor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_leaves_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doctor_leaves_substitute_doctor_id_fkey"
            columns: ["substitute_doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_schedules: {
        Row: {
          break_end_time: string | null
          break_start_time: string | null
          day_of_week: number
          doctor_id: string
          end_time: string
          id: string
          is_emergency_override: boolean
          max_patients: number
          opd_type: string
          slot_duration: number
          start_time: string
        }
        Insert: {
          break_end_time?: string | null
          break_start_time?: string | null
          day_of_week: number
          doctor_id: string
          end_time: string
          id?: string
          is_emergency_override?: boolean
          max_patients?: number
          opd_type: string
          slot_duration?: number
          start_time: string
        }
        Update: {
          break_end_time?: string | null
          break_start_time?: string | null
          day_of_week?: number
          doctor_id?: string
          end_time?: string
          id?: string
          is_emergency_override?: boolean
          max_patients?: number
          opd_type?: string
          slot_duration?: number
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_schedules_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          consultant_id: string | null
          consultation_fee: Json
          contact_number: string
          created_at: string
          email: string
          id: string
          is_junior: boolean
          name: string
          photo_url: string | null
          qualification: string
          registration_number: string
          room_number: string | null
          specialization: string[]
          status: string
          updated_at: string
        }
        Insert: {
          consultant_id?: string | null
          consultation_fee?: Json
          contact_number: string
          created_at?: string
          email: string
          id?: string
          is_junior?: boolean
          name: string
          photo_url?: string | null
          qualification: string
          registration_number: string
          room_number?: string | null
          specialization?: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          consultant_id?: string | null
          consultation_fee?: Json
          contact_number?: string
          created_at?: string
          email?: string
          id?: string
          is_junior?: boolean
          name?: string
          photo_url?: string | null
          qualification?: string
          registration_number?: string
          room_number?: string | null
          specialization?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctors_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_inventory: {
        Row: {
          expiry_date: string | null
          id: string
          name: string
          quantity: number
          reorder_level: number
          supplier: string | null
          type: string
          unit: string
        }
        Insert: {
          expiry_date?: string | null
          id?: string
          name: string
          quantity?: number
          reorder_level?: number
          supplier?: string | null
          type: string
          unit: string
        }
        Update: {
          expiry_date?: string | null
          id?: string
          name?: string
          quantity?: number
          reorder_level?: number
          supplier?: string | null
          type?: string
          unit?: string
        }
        Relationships: []
      }
      lab_orders: {
        Row: {
          clinical_notes: string | null
          doctor_id: string
          id: string
          order_date: string
          patient_id: string
          priority: string
          status: string
          tests: Json
          total_amount: number
          visit_id: string | null
        }
        Insert: {
          clinical_notes?: string | null
          doctor_id: string
          id?: string
          order_date?: string
          patient_id: string
          priority?: string
          status?: string
          tests?: Json
          total_amount?: number
          visit_id?: string | null
        }
        Update: {
          clinical_notes?: string | null
          doctor_id?: string
          id?: string
          order_date?: string
          patient_id?: string
          priority?: string
          status?: string
          tests?: Json
          total_amount?: number
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_orders_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_orders_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_results: {
        Row: {
          comments: string | null
          id: string
          is_abnormal: boolean | null
          is_critical: boolean | null
          order_id: string
          pathologist_id: string | null
          patient_id: string
          reference_range: string | null
          technician_id: string | null
          test_id: string
          units: string | null
          value: string | null
          verified_at: string | null
        }
        Insert: {
          comments?: string | null
          id?: string
          is_abnormal?: boolean | null
          is_critical?: boolean | null
          order_id: string
          pathologist_id?: string | null
          patient_id: string
          reference_range?: string | null
          technician_id?: string | null
          test_id: string
          units?: string | null
          value?: string | null
          verified_at?: string | null
        }
        Update: {
          comments?: string | null
          id?: string
          is_abnormal?: boolean | null
          is_critical?: boolean | null
          order_id?: string
          pathologist_id?: string | null
          patient_id?: string
          reference_range?: string | null
          technician_id?: string | null
          test_id?: string
          units?: string | null
          value?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_results_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "lab_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_results_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "lab_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_samples: {
        Row: {
          collected_at: string | null
          collected_by: string | null
          id: string
          order_id: string
          patient_name: string | null
          received_at: string | null
          sample_type: string
          status: string
          test_ids: string[] | null
        }
        Insert: {
          collected_at?: string | null
          collected_by?: string | null
          id?: string
          order_id: string
          patient_name?: string | null
          received_at?: string | null
          sample_type: string
          status?: string
          test_ids?: string[] | null
        }
        Update: {
          collected_at?: string | null
          collected_by?: string | null
          id?: string
          order_id?: string
          patient_name?: string | null
          received_at?: string | null
          sample_type?: string
          status?: string
          test_ids?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_samples_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "lab_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_tests: {
        Row: {
          code: string
          department: string
          id: string
          is_active: boolean
          name: string
          price: number
          reference_range: string | null
          sample_type: string
          tat_hours: number
          units: string | null
        }
        Insert: {
          code: string
          department: string
          id?: string
          is_active?: boolean
          name: string
          price: number
          reference_range?: string | null
          sample_type: string
          tat_hours?: number
          units?: string | null
        }
        Update: {
          code?: string
          department?: string
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          reference_range?: string | null
          sample_type?: string
          tat_hours?: number
          units?: string | null
        }
        Relationships: []
      }
      medicines: {
        Row: {
          batch_number: string | null
          brand: string | null
          category: string
          current_stock: number
          expiry_date: string | null
          generic_name: string | null
          hsn_code: string | null
          id: string
          location: string | null
          manufacturer: string | null
          name: string
          purchase_price: number
          reorder_level: number
          selling_price: number
          status: string
          strength: string | null
          unit: string | null
        }
        Insert: {
          batch_number?: string | null
          brand?: string | null
          category?: string
          current_stock?: number
          expiry_date?: string | null
          generic_name?: string | null
          hsn_code?: string | null
          id?: string
          location?: string | null
          manufacturer?: string | null
          name: string
          purchase_price?: number
          reorder_level?: number
          selling_price?: number
          status?: string
          strength?: string | null
          unit?: string | null
        }
        Update: {
          batch_number?: string | null
          brand?: string | null
          category?: string
          current_stock?: number
          expiry_date?: string | null
          generic_name?: string | null
          hsn_code?: string | null
          id?: string
          location?: string | null
          manufacturer?: string | null
          name?: string
          purchase_price?: number
          reorder_level?: number
          selling_price?: number
          status?: string
          strength?: string | null
          unit?: string | null
        }
        Relationships: []
      }
      mr_counter: {
        Row: {
          id: string
          last_number: number
          year: number
        }
        Insert: {
          id?: string
          last_number?: number
          year: number
        }
        Update: {
          id?: string
          last_number?: number
          year?: number
        }
        Relationships: []
      }
      patients: {
        Row: {
          address: string | null
          created_at: string
          date_of_birth: string
          email: string | null
          first_name: string
          gender: string
          id: string
          last_name: string
          mr_number: string
          phone: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          date_of_birth: string
          email?: string | null
          first_name: string
          gender: string
          id?: string
          last_name: string
          mr_number: string
          phone: string
        }
        Update: {
          address?: string | null
          created_at?: string
          date_of_birth?: string
          email?: string | null
          first_name?: string
          gender?: string
          id?: string
          last_name?: string
          mr_number?: string
          phone?: string
        }
        Relationships: []
      }
      pharmacy_sales: {
        Row: {
          created_at: string
          created_by: string | null
          discount: number
          final_amount: number
          id: string
          items: Json
          patient_id: string | null
          patient_name: string
          payment_mode: string
          prescription_id: string | null
          status: string
          total_amount: number
          visit_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          discount?: number
          final_amount?: number
          id?: string
          items?: Json
          patient_id?: string | null
          patient_name: string
          payment_mode?: string
          prescription_id?: string | null
          status?: string
          total_amount?: number
          visit_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          discount?: number
          final_amount?: number
          id?: string
          items?: Json
          patient_id?: string | null
          patient_name?: string
          payment_mode?: string
          prescription_id?: string | null
          status?: string
          total_amount?: number
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pharmacy_sales_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pharmacy_sales_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pharmacy_sales_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          dispensed_at: string | null
          dispensed_by: string | null
          doctor_id: string
          id: string
          items: Json
          notes: string | null
          patient_id: string
          priority: string
          status: string
          token_number: string | null
          visit_id: string | null
        }
        Insert: {
          created_at?: string
          dispensed_at?: string | null
          dispensed_by?: string | null
          doctor_id: string
          id?: string
          items?: Json
          notes?: string | null
          patient_id: string
          priority?: string
          status?: string
          token_number?: string | null
          visit_id?: string | null
        }
        Update: {
          created_at?: string
          dispensed_at?: string | null
          dispensed_by?: string | null
          doctor_id?: string
          id?: string
          items?: Json
          notes?: string | null
          patient_id?: string
          priority?: string
          status?: string
          token_number?: string | null
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      radiology_appointments: {
        Row: {
          id: string
          modality_id: string
          order_id: string
          patient_id: string
          scheduled_time: string
          status: string
          technician_id: string | null
          test_id: string
        }
        Insert: {
          id?: string
          modality_id: string
          order_id: string
          patient_id: string
          scheduled_time: string
          status?: string
          technician_id?: string | null
          test_id: string
        }
        Update: {
          id?: string
          modality_id?: string
          order_id?: string
          patient_id?: string
          scheduled_time?: string
          status?: string
          technician_id?: string | null
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "radiology_appointments_modality_id_fkey"
            columns: ["modality_id"]
            isOneToOne: false
            referencedRelation: "radiology_modalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "radiology_appointments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "radiology_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "radiology_appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "radiology_appointments_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "radiology_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      radiology_modalities: {
        Row: {
          id: string
          name: string
          room_number: string | null
          status: string
          type: string
        }
        Insert: {
          id?: string
          name: string
          room_number?: string | null
          status?: string
          type: string
        }
        Update: {
          id?: string
          name?: string
          room_number?: string | null
          status?: string
          type?: string
        }
        Relationships: []
      }
      radiology_orders: {
        Row: {
          clinical_indications: string | null
          doctor_id: string
          id: string
          order_date: string
          patient_id: string
          priority: string
          status: string
          tests: Json
          total_amount: number
          visit_id: string
        }
        Insert: {
          clinical_indications?: string | null
          doctor_id: string
          id?: string
          order_date?: string
          patient_id: string
          priority?: string
          status?: string
          tests?: Json
          total_amount?: number
          visit_id: string
        }
        Update: {
          clinical_indications?: string | null
          doctor_id?: string
          id?: string
          order_date?: string
          patient_id?: string
          priority?: string
          status?: string
          tests?: Json
          total_amount?: number
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "radiology_orders_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "radiology_orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "radiology_orders_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      radiology_results: {
        Row: {
          created_at: string
          finalized_at: string | null
          findings: string | null
          id: string
          image_urls: string[] | null
          impression: string | null
          order_id: string
          patient_id: string
          radiologist_id: string | null
          report_content: string | null
          status: string
          test_id: string
        }
        Insert: {
          created_at?: string
          finalized_at?: string | null
          findings?: string | null
          id?: string
          image_urls?: string[] | null
          impression?: string | null
          order_id: string
          patient_id: string
          radiologist_id?: string | null
          report_content?: string | null
          status?: string
          test_id: string
        }
        Update: {
          created_at?: string
          finalized_at?: string | null
          findings?: string | null
          id?: string
          image_urls?: string[] | null
          impression?: string | null
          order_id?: string
          patient_id?: string
          radiologist_id?: string | null
          report_content?: string | null
          status?: string
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "radiology_results_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "radiology_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "radiology_results_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "radiology_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "radiology_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      radiology_tests: {
        Row: {
          code: string
          id: string
          modality: string
          name: string
          preparation_instructions: string | null
          price: number
        }
        Insert: {
          code: string
          id?: string
          modality: string
          name: string
          preparation_instructions?: string | null
          price: number
        }
        Update: {
          code?: string
          id?: string
          modality?: string
          name?: string
          preparation_instructions?: string | null
          price?: number
        }
        Relationships: []
      }
      token_counters: {
        Row: {
          counter_date: string
          id: string
          last_number: number
          opd_type: string
        }
        Insert: {
          counter_date?: string
          id?: string
          last_number?: number
          opd_type: string
        }
        Update: {
          counter_date?: string
          id?: string
          last_number?: number
          opd_type?: string
        }
        Relationships: []
      }
      tokens: {
        Row: {
          consultant_id: string | null
          created_at: string
          id: string
          junior_doctor_id: string | null
          opd_type: string
          patient_id: string
          priority: string
          status: string
          token_number: string
          updated_at: string
          visit_id: string | null
        }
        Insert: {
          consultant_id?: string | null
          created_at?: string
          id?: string
          junior_doctor_id?: string | null
          opd_type: string
          patient_id: string
          priority?: string
          status?: string
          token_number: string
          updated_at?: string
          visit_id?: string | null
        }
        Update: {
          consultant_id?: string | null
          created_at?: string
          id?: string
          junior_doctor_id?: string | null
          opd_type?: string
          patient_id?: string
          priority?: string
          status?: string
          token_number?: string
          updated_at?: string
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tokens_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tokens_junior_doctor_id_fkey"
            columns: ["junior_doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tokens_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          completed_at: string | null
          consultation_fee: number
          created_at: string
          final_diagnosis: string | null
          id: string
          junior_notes: string | null
          opd_type: string
          paid_amount: number | null
          patient_id: string
          prescription: Json | null
          provisional_diagnosis: string | null
          status: string
          token_id: string | null
          total_amount: number | null
        }
        Insert: {
          completed_at?: string | null
          consultation_fee?: number
          created_at?: string
          final_diagnosis?: string | null
          id?: string
          junior_notes?: string | null
          opd_type: string
          paid_amount?: number | null
          patient_id: string
          prescription?: Json | null
          provisional_diagnosis?: string | null
          status?: string
          token_id?: string | null
          total_amount?: number | null
        }
        Update: {
          completed_at?: string | null
          consultation_fee?: number
          created_at?: string
          final_diagnosis?: string | null
          id?: string
          junior_notes?: string | null
          opd_type?: string
          paid_amount?: number | null
          patient_id?: string
          prescription?: Json | null
          provisional_diagnosis?: string | null
          status?: string
          token_id?: string | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      vitals: {
        Row: {
          blood_pressure: string | null
          height: number | null
          id: string
          pulse: number | null
          recorded_at: string
          recorded_by: string | null
          respiratory_rate: number | null
          spo2: number | null
          temperature: number | null
          visit_id: string
          weight: number | null
        }
        Insert: {
          blood_pressure?: string | null
          height?: number | null
          id?: string
          pulse?: number | null
          recorded_at?: string
          recorded_by?: string | null
          respiratory_rate?: number | null
          spo2?: number | null
          temperature?: number | null
          visit_id: string
          weight?: number | null
        }
        Update: {
          blood_pressure?: string | null
          height?: number | null
          id?: string
          pulse?: number | null
          recorded_at?: string
          recorded_by?: string | null
          respiratory_rate?: number | null
          spo2?: number | null
          temperature?: number | null
          visit_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vitals_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_next_mr_number: { Args: never; Returns: string }
      get_next_token_number: {
        Args: { p_opd_type: string; p_prefix: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
