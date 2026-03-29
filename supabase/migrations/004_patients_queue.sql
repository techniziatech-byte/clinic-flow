-- Patients & Queue for Renew Dermatology Clinic
CREATE TABLE IF NOT EXISTS patients_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_no SERIAL,
    patient_name TEXT NOT NULL,
    mobile_no TEXT,
    visit_type TEXT CHECK (visit_type IN ('Consultation', 'Procedure')) DEFAULT 'Consultation',
    current_status TEXT CHECK (current_status IN ('waiting_pay', 'in_queue', 'with_doctor', 'discharged', 'procedure_pending')) DEFAULT 'waiting_pay',
    consultation_paid BOOLEAN DEFAULT false,
    procedure_paid BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE patients_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON patients_queue FOR SELECT USING (true);
CREATE POLICY "Authenticated write" ON patients_queue FOR ALL USING (auth.role() = 'authenticated');
