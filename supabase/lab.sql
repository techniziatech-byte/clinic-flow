
-- Lab Tests Catalog
CREATE TABLE public.lab_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    sample_type TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    tat_hours INTEGER,
    reference_range TEXT,
    units TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Lab Orders
CREATE TABLE public.lab_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visit_id UUID REFERENCES public.visits(id),
    patient_id UUID REFERENCES public.patients(id),
    doctor_id UUID REFERENCES public.doctors(id),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'normal',
    clinical_notes TEXT,
    total_amount DECIMAL(10,2) DEFAULT 0
);

-- Lab Order Tests (Detail)
CREATE TABLE public.lab_order_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.lab_orders(id),
    test_id UUID REFERENCES public.lab_tests(id),
    price DECIMAL(10,2),
    status TEXT DEFAULT 'pending',
    result_value TEXT,
    is_abnormal BOOLEAN DEFAULT FALSE,
    is_critical BOOLEAN DEFAULT FALSE,
    verified_by UUID,
    verified_at TIMESTAMP WITH TIME ZONE
);

-- Lab Samples
CREATE TABLE public.lab_samples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.lab_orders(id),
    barcode TEXT UNIQUE NOT NULL,
    sample_type TEXT NOT NULL,
    collected_at TIMESTAMP WITH TIME ZONE,
    received_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'collected',
    notes TEXT
);

-- Reagent Inventory
CREATE TABLE public.lab_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    unit TEXT,
    expiry_date DATE,
    reorder_level INTEGER DEFAULT 5,
    supplier TEXT
);
