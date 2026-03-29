
-- Modalities Master
CREATE TABLE public.modalities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    room_number TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Radiology Tests Catalog
CREATE TABLE public.radiology_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    modality TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    preparation_instructions TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Radiology Orders
CREATE TABLE public.radiology_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visit_id UUID REFERENCES public.visits(id),
    patient_id UUID REFERENCES public.patients(id),
    doctor_id UUID REFERENCES public.doctors(id),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    priority TEXT DEFAULT 'routine',
    clinical_indications TEXT,
    total_amount DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'pending'
);

-- Order Details (Tests within an order)
CREATE TABLE public.radiology_order_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.radiology_orders(id),
    test_id UUID REFERENCES public.radiology_tests(id),
    price DECIMAL(10,2),
    status TEXT DEFAULT 'pending'
);

-- Appointments / Scheduling
CREATE TABLE public.radiology_appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_test_id UUID REFERENCES public.radiology_order_tests(id),
    modality_id UUID REFERENCES public.modalities(id),
    scheduled_time TIMESTAMP WITH TIME ZONE,
    technician_id UUID,
    status TEXT DEFAULT 'scheduled'
);

-- Reports
CREATE TABLE public.radiology_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_test_id UUID REFERENCES public.radiology_order_tests(id),
    radiologist_id UUID,
    report_content TEXT,
    findings TEXT,
    impression TEXT,
    status TEXT DEFAULT 'draft',
    image_urls TEXT[], -- Array of image URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    finalized_at TIMESTAMP WITH TIME ZONE
);
