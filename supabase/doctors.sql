-- Create doctors table
CREATE TABLE public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    qualification TEXT,
    specialization TEXT[] NOT NULL, -- Array of OPDType strings
    registration_number TEXT,
    contact_number TEXT,
    email TEXT,
    room_number TEXT,
    consultation_fee JSONB DEFAULT '{}'::jsonb, -- Key-value pair of OPDType -> Fee
    photo_url TEXT,
    is_junior BOOLEAN DEFAULT false,
    consultant_id UUID REFERENCES public.doctors(id),
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ -- For soft delete
);

-- Create schedules table
CREATE TABLE public.doctor_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    opd_type TEXT NOT NULL,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration INTEGER DEFAULT 15,
    max_patients INTEGER,
    break_start_time TIME,
    break_end_time TIME,
    is_emergency_override BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create leaves table
CREATE TABLE public.doctor_leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    substitute_doctor_id UUID REFERENCES public.doctors(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_doctors_specialization ON public.doctors USING GIN(specialization);
CREATE INDEX idx_doctor_schedules_day ON public.doctor_schedules(day_of_week);
CREATE INDEX idx_doctor_schedules_opd ON public.doctor_schedules(opd_type);

-- RLS Policies (Example: Public read, Admin write)
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_leaves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.doctor_schedules FOR SELECT USING (true);
