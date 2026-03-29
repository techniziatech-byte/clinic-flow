
-- =============================================
-- CLINIC OPD MANAGEMENT SYSTEM - FULL SCHEMA
-- =============================================

-- 1. PATIENTS
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mr_number TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to patients" ON public.patients FOR ALL USING (true) WITH CHECK (true);

-- 2. DOCTORS
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  qualification TEXT NOT NULL,
  specialization TEXT[] NOT NULL DEFAULT '{}',
  registration_number TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  email TEXT NOT NULL,
  room_number TEXT,
  consultation_fee JSONB NOT NULL DEFAULT '{}',
  photo_url TEXT,
  is_junior BOOLEAN NOT NULL DEFAULT false,
  consultant_id UUID REFERENCES public.doctors(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to doctors" ON public.doctors FOR ALL USING (true) WITH CHECK (true);

-- 3. DOCTOR SCHEDULES
CREATE TABLE public.doctor_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  opd_type TEXT NOT NULL,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration INT NOT NULL DEFAULT 15,
  max_patients INT NOT NULL DEFAULT 30,
  break_start_time TIME,
  break_end_time TIME,
  is_emergency_override BOOLEAN NOT NULL DEFAULT false
);
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to doctor_schedules" ON public.doctor_schedules FOR ALL USING (true) WITH CHECK (true);

-- 4. DOCTOR LEAVES
CREATE TABLE public.doctor_leaves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  substitute_doctor_id UUID REFERENCES public.doctors(id)
);
ALTER TABLE public.doctor_leaves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to doctor_leaves" ON public.doctor_leaves FOR ALL USING (true) WITH CHECK (true);

-- 5. TOKENS
CREATE TABLE public.tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_number TEXT NOT NULL,
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  opd_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered',
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent', 'vip')),
  visit_id UUID,
  consultant_id UUID REFERENCES public.doctors(id),
  junior_doctor_id UUID REFERENCES public.doctors(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to tokens" ON public.tokens FOR ALL USING (true) WITH CHECK (true);

-- 6. VISITS
CREATE TABLE public.visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  token_id UUID REFERENCES public.tokens(id),
  opd_type TEXT NOT NULL,
  consultation_fee NUMERIC NOT NULL DEFAULT 300,
  junior_notes TEXT,
  provisional_diagnosis TEXT,
  final_diagnosis TEXT,
  prescription JSONB,
  total_amount NUMERIC,
  paid_amount NUMERIC,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to visits" ON public.visits FOR ALL USING (true) WITH CHECK (true);

-- 7. VITALS
CREATE TABLE public.vitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visit_id UUID NOT NULL REFERENCES public.visits(id),
  blood_pressure TEXT,
  pulse INT,
  temperature NUMERIC,
  weight NUMERIC,
  height NUMERIC,
  spo2 INT,
  respiratory_rate INT,
  recorded_by TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vitals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to vitals" ON public.vitals FOR ALL USING (true) WITH CHECK (true);

-- 8. DEPARTMENTS
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon TEXT,
  tagline TEXT,
  hero_image TEXT,
  overview TEXT,
  diseases_treated TEXT[] DEFAULT '{}',
  capabilities TEXT[] DEFAULT '{}',
  services TEXT[] DEFAULT '{}',
  procedures TEXT[] DEFAULT '{}',
  doctor_ids TEXT[] DEFAULT '{}',
  technology JSONB DEFAULT '[]',
  patient_care JSONB DEFAULT '{}',
  contact JSONB DEFAULT '{}'
);
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to departments" ON public.departments FOR ALL USING (true) WITH CHECK (true);

-- 9. LAB TESTS (catalog)
CREATE TABLE public.lab_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  sample_type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  tat_hours INT NOT NULL DEFAULT 24,
  reference_range TEXT,
  units TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);
ALTER TABLE public.lab_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to lab_tests" ON public.lab_tests FOR ALL USING (true) WITH CHECK (true);

-- 10. LAB ORDERS
CREATE TABLE public.lab_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visit_id UUID REFERENCES public.visits(id),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id),
  order_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'normal',
  tests JSONB NOT NULL DEFAULT '[]',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  clinical_notes TEXT
);
ALTER TABLE public.lab_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to lab_orders" ON public.lab_orders FOR ALL USING (true) WITH CHECK (true);

-- 11. LAB SAMPLES
CREATE TABLE public.lab_samples (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.lab_orders(id),
  test_ids TEXT[] DEFAULT '{}',
  patient_name TEXT,
  sample_type TEXT NOT NULL,
  collected_at TIMESTAMPTZ,
  collected_by TEXT,
  received_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'collected'
);
ALTER TABLE public.lab_samples ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to lab_samples" ON public.lab_samples FOR ALL USING (true) WITH CHECK (true);

-- 12. LAB RESULTS
CREATE TABLE public.lab_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.lab_orders(id),
  test_id UUID NOT NULL REFERENCES public.lab_tests(id),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  value TEXT,
  units TEXT,
  reference_range TEXT,
  is_abnormal BOOLEAN DEFAULT false,
  is_critical BOOLEAN DEFAULT false,
  technician_id TEXT,
  pathologist_id TEXT,
  verified_at TIMESTAMPTZ,
  comments TEXT
);
ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to lab_results" ON public.lab_results FOR ALL USING (true) WITH CHECK (true);

-- 13. LAB INVENTORY
CREATE TABLE public.lab_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  expiry_date DATE,
  reorder_level INT NOT NULL DEFAULT 10,
  supplier TEXT
);
ALTER TABLE public.lab_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to lab_inventory" ON public.lab_inventory FOR ALL USING (true) WITH CHECK (true);

-- 14. MEDICINES
CREATE TABLE public.medicines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  generic_name TEXT,
  brand TEXT,
  category TEXT NOT NULL DEFAULT 'tablet',
  strength TEXT,
  unit TEXT,
  manufacturer TEXT,
  hsn_code TEXT,
  selling_price NUMERIC NOT NULL DEFAULT 0,
  purchase_price NUMERIC NOT NULL DEFAULT 0,
  reorder_level INT NOT NULL DEFAULT 10,
  current_stock INT NOT NULL DEFAULT 0,
  batch_number TEXT,
  expiry_date DATE,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to medicines" ON public.medicines FOR ALL USING (true) WITH CHECK (true);

-- 15. PRESCRIPTIONS
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visit_id UUID REFERENCES public.visits(id),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id),
  token_number TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  dispensed_at TIMESTAMPTZ,
  dispensed_by TEXT
);
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to prescriptions" ON public.prescriptions FOR ALL USING (true) WITH CHECK (true);

-- 16. PHARMACY SALES
CREATE TABLE public.pharmacy_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID REFERENCES public.prescriptions(id),
  visit_id UUID REFERENCES public.visits(id),
  patient_id UUID REFERENCES public.patients(id),
  patient_name TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  final_amount NUMERIC NOT NULL DEFAULT 0,
  payment_mode TEXT NOT NULL DEFAULT 'cash',
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT
);
ALTER TABLE public.pharmacy_sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to pharmacy_sales" ON public.pharmacy_sales FOR ALL USING (true) WITH CHECK (true);

-- 17. RADIOLOGY TESTS (catalog)
CREATE TABLE public.radiology_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  modality TEXT NOT NULL,
  price NUMERIC NOT NULL,
  preparation_instructions TEXT
);
ALTER TABLE public.radiology_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to radiology_tests" ON public.radiology_tests FOR ALL USING (true) WITH CHECK (true);

-- 18. RADIOLOGY MODALITIES
CREATE TABLE public.radiology_modalities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  room_number TEXT,
  status TEXT NOT NULL DEFAULT 'active'
);
ALTER TABLE public.radiology_modalities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to radiology_modalities" ON public.radiology_modalities FOR ALL USING (true) WITH CHECK (true);

-- 19. RADIOLOGY ORDERS
CREATE TABLE public.radiology_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visit_id UUID NOT NULL REFERENCES public.visits(id),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id),
  order_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  priority TEXT NOT NULL DEFAULT 'routine',
  clinical_indications TEXT,
  tests JSONB NOT NULL DEFAULT '[]',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
);
ALTER TABLE public.radiology_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to radiology_orders" ON public.radiology_orders FOR ALL USING (true) WITH CHECK (true);

-- 20. RADIOLOGY APPOINTMENTS
CREATE TABLE public.radiology_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.radiology_orders(id),
  test_id UUID NOT NULL REFERENCES public.radiology_tests(id),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  modality_id UUID NOT NULL REFERENCES public.radiology_modalities(id),
  scheduled_time TIMESTAMPTZ NOT NULL,
  technician_id TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled'
);
ALTER TABLE public.radiology_appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to radiology_appointments" ON public.radiology_appointments FOR ALL USING (true) WITH CHECK (true);

-- 21. RADIOLOGY RESULTS
CREATE TABLE public.radiology_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.radiology_orders(id),
  test_id UUID NOT NULL REFERENCES public.radiology_tests(id),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  radiologist_id TEXT,
  report_content TEXT,
  image_urls TEXT[] DEFAULT '{}',
  findings TEXT,
  impression TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finalized_at TIMESTAMPTZ
);
ALTER TABLE public.radiology_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to radiology_results" ON public.radiology_results FOR ALL USING (true) WITH CHECK (true);

-- 22. BILLING ITEMS
CREATE TABLE public.billing_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visit_id UUID NOT NULL REFERENCES public.visits(id),
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.billing_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to billing_items" ON public.billing_items FOR ALL USING (true) WITH CHECK (true);

-- 23. TOKEN COUNTERS (for auto-increment per OPD per day)
CREATE TABLE public.token_counters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opd_type TEXT NOT NULL,
  counter_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_number INT NOT NULL DEFAULT 0,
  UNIQUE(opd_type, counter_date)
);
ALTER TABLE public.token_counters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to token_counters" ON public.token_counters FOR ALL USING (true) WITH CHECK (true);

-- 24. MR NUMBER COUNTER
CREATE TABLE public.mr_counter (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INT NOT NULL UNIQUE,
  last_number INT NOT NULL DEFAULT 0
);
ALTER TABLE public.mr_counter ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to mr_counter" ON public.mr_counter FOR ALL USING (true) WITH CHECK (true);

-- Function to get next token number
CREATE OR REPLACE FUNCTION public.get_next_token_number(p_opd_type TEXT, p_prefix TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_number INT;
BEGIN
  INSERT INTO public.token_counters (opd_type, counter_date, last_number)
  VALUES (p_opd_type, CURRENT_DATE, 1)
  ON CONFLICT (opd_type, counter_date)
  DO UPDATE SET last_number = token_counters.last_number + 1
  RETURNING last_number INTO v_number;
  
  RETURN p_prefix || '-' || LPAD(v_number::TEXT, 3, '0');
END;
$$;

-- Function to get next MR number
CREATE OR REPLACE FUNCTION public.get_next_mr_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_year INT;
  v_number INT;
BEGIN
  v_year := EXTRACT(YEAR FROM CURRENT_DATE)::INT;
  
  INSERT INTO public.mr_counter (year, last_number)
  VALUES (v_year, 1)
  ON CONFLICT (year)
  DO UPDATE SET last_number = mr_counter.last_number + 1
  RETURNING last_number INTO v_number;
  
  RETURN 'MR-' || v_year || '-' || LPAD(v_number::TEXT, 6, '0');
END;
$$;

-- Create indexes for performance
CREATE INDEX idx_tokens_patient_id ON public.tokens(patient_id);
CREATE INDEX idx_tokens_opd_type ON public.tokens(opd_type);
CREATE INDEX idx_tokens_status ON public.tokens(status);
CREATE INDEX idx_visits_patient_id ON public.visits(patient_id);
CREATE INDEX idx_visits_token_id ON public.visits(token_id);
CREATE INDEX idx_vitals_visit_id ON public.vitals(visit_id);
CREATE INDEX idx_lab_orders_patient_id ON public.lab_orders(patient_id);
CREATE INDEX idx_lab_orders_visit_id ON public.lab_orders(visit_id);
CREATE INDEX idx_prescriptions_visit_id ON public.prescriptions(visit_id);
CREATE INDEX idx_radiology_orders_visit_id ON public.radiology_orders(visit_id);
CREATE INDEX idx_billing_items_visit_id ON public.billing_items(visit_id);
CREATE INDEX idx_patients_phone ON public.patients(phone);
CREATE INDEX idx_patients_mr_number ON public.patients(mr_number);
