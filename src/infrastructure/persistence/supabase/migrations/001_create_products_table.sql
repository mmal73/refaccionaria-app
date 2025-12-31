-- Migration: Create products table
-- Description: Creates the products table with all necessary fields
-- Run this in your Supabase SQL Editor

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) >= 3),
  price_amount NUMERIC(10, 2) NOT NULL CHECK (price_amount > 0),
  price_currency TEXT NOT NULL DEFAULT 'MXN',
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  description TEXT,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies (ajusta según tus necesidades de autenticación)
-- Política para lectura pública (puedes cambiarla según tus necesidades)
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  USING (true);

-- Política para inserción (solo usuarios autenticados)
CREATE POLICY "Allow authenticated insert" ON products
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Política para actualización (solo usuarios autenticados)
CREATE POLICY "Allow authenticated update" ON products
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Política para eliminación (solo usuarios autenticados)
CREATE POLICY "Allow authenticated delete" ON products
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Comentarios para documentación
COMMENT ON TABLE products IS 'Tabla de productos de la refaccionaria';
COMMENT ON COLUMN products.id IS 'Identificador único del producto';
COMMENT ON COLUMN products.name IS 'Nombre del producto (mínimo 3 caracteres)';
COMMENT ON COLUMN products.price_amount IS 'Monto del precio (debe ser mayor a 0)';
COMMENT ON COLUMN products.price_currency IS 'Moneda del precio (ej: MXN, USD)';
COMMENT ON COLUMN products.stock IS 'Cantidad en inventario (no puede ser negativo)';
COMMENT ON COLUMN products.description IS 'Descripción del producto (opcional)';
COMMENT ON COLUMN products.category IS 'Categoría del producto (opcional)';
COMMENT ON COLUMN products.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN products.updated_at IS 'Fecha de última actualización';
