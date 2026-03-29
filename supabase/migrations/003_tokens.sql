-- Tokens table
CREATE TABLE tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_number TEXT UNIQUE NOT NULL,
  patient_name TEXT NOT NULL,
  current_station TEXT CHECK (current_station IN ('registration', 'opd', 'procedure', 'pharmacy')) DEFAULT 'registration',
  payment_cleared BOOLEAN DEFAULT false,
  procedure_required BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'check-in',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable realtime
ALTER TABLE tokens REPLICA IDENTITY FULL;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tokens" ON tokens FOR SELECT USING (true);
