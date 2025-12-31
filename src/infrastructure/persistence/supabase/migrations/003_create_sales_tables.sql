-- ============================================
-- TABLAS PARA EL MÓDULO DE VENTAS
-- ============================================

-- Tabla de Ventas (Cabecera)
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY,
  customer_name TEXT,
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  currency TEXT NOT NULL DEFAULT 'MXN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de Items de Venta (Detalle)
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC NOT NULL CHECK (unit_price >= 0),
  subtotal NUMERIC NOT NULL CHECK (subtotal >= 0),
  product_name TEXT -- Copia denormalizada para histórico
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);

-- ============================================
-- RLS (MODO DESARROLLO)
-- ============================================

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read sales" ON sales FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert sales" ON sales FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read sale_items" ON sale_items FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert sale_items" ON sale_items FOR INSERT WITH CHECK (true);
