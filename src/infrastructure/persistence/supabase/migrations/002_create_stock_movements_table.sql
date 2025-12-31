-- ============================================
-- CREAR TABLA STOCK_MOVEMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  type TEXT NOT NULL CHECK (type IN ('IN', 'OUT', 'ADJUSTMENT')),
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id TEXT -- Opcional por ahora
);

-- ============================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - MODO DESARROLLO
-- ============================================

ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- LECTURA PÚBLICA (desarrollo)
CREATE POLICY "Allow public read access movements" ON stock_movements
  FOR SELECT
  USING (true);

-- ESCRITURA ANÓNIMA (desarrollo)
CREATE POLICY "Allow anonymous insert movements" ON stock_movements
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- ============================================

COMMENT ON TABLE stock_movements IS 'Historial de movimientos de inventario';
COMMENT ON COLUMN stock_movements.product_id IS 'Referencia al producto';
COMMENT ON COLUMN stock_movements.type IS 'Tipo de movimiento: IN, OUT, ADJUSTMENT';
