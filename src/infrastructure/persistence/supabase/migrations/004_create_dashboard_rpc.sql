-- ============================================
-- FUNCIÓN PARA MÉTRICAS DE DASHBOARD
-- ============================================

CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    total_val NUMERIC;
    low_stock_count INTEGER;
    total_prod_count INTEGER;
    result JSON;
BEGIN
    -- 1. Calcular valor total del inventario (precio * stock)
    SELECT COALESCE(SUM(price_amount * stock), 0)
    INTO total_val
    FROM products;

    -- 2. Conteo de stock bajo (umbral <= 5)
    SELECT COUNT(*)
    INTO low_stock_count
    FROM products
    WHERE stock <= 5;

    -- 3. Conteo total de productos
    SELECT COUNT(*)
    INTO total_prod_count
    FROM products;

    -- 4. Construir JSON de respuesta
    result := json_build_object(
        'totalInventoryValue', total_val,
        'lowStockCount', low_stock_count,
        'totalProducts', total_prod_count
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;
