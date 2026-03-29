-- Patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mr_number TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Visits table
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  opd_no TEXT NOT NULL,
  status TEXT CHECK (status IN ('registered', 'consulted', 'procedure_pending', 'procedure_paid', 'completed')) DEFAULT 'registered',
  procedure_fees DECIMAL(10,2),
  paid_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read patients" ON patients FOR SELECT USING (true);
CREATE POLICY "Public read visits" ON visits FOR SELECT USING (true);

