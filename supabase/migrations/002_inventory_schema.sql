-- Raw Materials (Warehouse A)
CREATE TABLE raw_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  unit TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Finished Products (Warehouse B)
CREATE TABLE finished_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  cost_price DECIMAL(10,2),
  sell_price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE finished_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read inventory" ON raw_materials FOR SELECT USING (true);
CREATE POLICY "Public read inventory" ON finished_products FOR SELECT USING (true);

