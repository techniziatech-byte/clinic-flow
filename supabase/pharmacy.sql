
-- Medicines Master
CREATE TABLE public.medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    generic_name TEXT,
    brand TEXT,
    category TEXT NOT NULL, -- tablet, syrup, etc.
    strength TEXT,
    unit TEXT,
    manufacturer TEXT,
    hsn_code TEXT,
    selling_price DECIMAL(10,2) NOT NULL,
    purchase_price DECIMAL(10,2),
    reorder_level INTEGER DEFAULT 10,
    current_stock INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active', -- active, inactive
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Medicine Batches (For detailed stock tracking)
CREATE TABLE public.medicine_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medicine_id UUID REFERENCES public.medicines(id),
    batch_number TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    quantity INTEGER NOT NULL,
    purchase_price DECIMAL(10,2),
    supplier_id UUID, -- Assuming a supplier table exists or loose link
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Prescriptions (Linked to Visits)
CREATE TABLE public.prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visit_id UUID, -- Loose link to clinic visits
    patient_id UUID,
    doctor_id UUID,
    status TEXT DEFAULT 'pending', -- pending, dispensed, cancelled
    priority TEXT DEFAULT 'normal',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    dispensed_at TIMESTAMP WITH TIME ZONE,
    dispensed_by UUID
);

-- Prescription Items
CREATE TABLE public.prescription_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID REFERENCES public.prescriptions(id),
    medicine_id UUID REFERENCES public.medicines(id),
    dosage TEXT,
    frequency TEXT,
    duration TEXT,
    quantity INTEGER,
    notes TEXT
);

-- Pharmacy Sales / Invoices
CREATE TABLE public.pharmacy_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID REFERENCES public.prescriptions(id),
    visit_id UUID,
    patient_id UUID,
    total_amount DECIMAL(10,2),
    discount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2),
    payment_mode TEXT,
    status TEXT DEFAULT 'completed',
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Sale Items
CREATE TABLE public.pharmacy_sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID REFERENCES public.pharmacy_sales(id),
    medicine_id UUID REFERENCES public.medicines(id),
    batch_id UUID REFERENCES public.medicine_batches(id),
    quantity INTEGER,
    price_per_unit DECIMAL(10,2),
    total_price DECIMAL(10,2)
);

-- Create indexes
CREATE INDEX idx_medicines_name ON public.medicines(name);
CREATE INDEX idx_prescriptions_visit ON public.prescriptions(visit_id);
CREATE INDEX idx_pharmacy_sales_patient ON public.pharmacy_sales(patient_id);
