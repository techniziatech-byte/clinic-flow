-- Dual Warehouse for Renew Clinic
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    category TEXT CHECK (category IN ('Raw', 'Finished')) DEFAULT 'Raw',
    warehouse_location TEXT CHECK (warehouse_location IN ('Warehouse_A', 'Warehouse_B')) DEFAULT 'Warehouse_A',
    quantity_on_hand INTEGER DEFAULT 0,
    unit_price DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS production_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finished_product_id UUID REFERENCES inventory(id),
    quantity_produced INTEGER NOT NULL,
    raw_materials_used JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON inventory FOR SELECT USING (true);
CREATE POLICY "Public read" ON production_logs FOR SELECT USING (true);
CREATE POLICY "Authenticated write" ON inventory FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write" ON production_logs FOR ALL USING (auth.role() = 'authenticated');
