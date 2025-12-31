import { type SupabaseClient } from '@supabase/supabase-js';
import { 
  type IDashboardRepository, 
  type DashboardStats, 
  Sale, 
  SaleItem, 
  Money 
} from '../../../domain';
import { getSupabaseClient } from '../supabase/client';

/**
 * SupabaseDashboardRepository
 * Implementación de métricas de negocio combinando funciones RPC y consultas estándar.
 */
export class SupabaseDashboardRepository implements IDashboardRepository {
  private supabase: SupabaseClient<any> = getSupabaseClient();

  async getStats(): Promise<DashboardStats> {
    // 1. Obtener métricas rápidas vía RPC
    const { data: rpcData, error: rpcError } = await this.supabase.rpc('get_dashboard_stats');
    if (rpcError) throw new Error(`RPC Error: ${rpcError.message}`);

    // 2. Obtener últimas 5 ventas con sus ítems
    const { data: salesData, error: salesError } = await this.supabase
      .from('sales')
      .select(`
        *,
        sale_items (*)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (salesError) throw new Error(`Sales Error: ${salesError.message}`);

    // Mapear ventas recientes
    const recentSales = salesData.map((s: any) => {
      const items = s.sale_items.map((i: any) => new SaleItem(
        i.id,
        i.product_id,
        i.product_name,
        i.quantity,
        Money.create(i.unit_price, s.currency),
        Money.create(i.subtotal, s.currency)
      ));
      return Sale.fromPersistence({
        id: s.id,
        date: new Date(s.created_at),
        customerName: s.customer_name || undefined,
        items
      });
    });

    // 3. Obtener productos más vendidos (Basado en sale_items)
    // Agregamos en el cliente para mayor flexibilidad, aunque se podría hacer en SQL.
    const { data: topItemsData, error: topItemsError } = await this.supabase
      .from('sale_items')
      .select('product_name, quantity')
      .limit(50); // Muestra de los últimos ítems vendidos

    if (topItemsError) throw new Error(`Top Items Error: ${topItemsError.message}`);

    const topSellingMap = new Map<string, number>();
    topItemsData?.forEach((item: any) => {
      const current = topSellingMap.get(item.product_name) || 0;
      topSellingMap.set(item.product_name, current + item.quantity);
    });

    const topSellingProducts = Array.from(topSellingMap.entries())
      .map(([name, totalSold]) => ({ name, totalSold }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    // 4. Obtener productos con stock bajo (Reutilizando lógica o consulta directa)
    const { data: lowStockData, error: lowStockError } = await this.supabase
      .from('products')
      .select('id, name, stock, category')
      .lte('stock', 5)
      .order('stock', { ascending: true })
      .limit(10);

    if (lowStockError) throw new Error(`Low Stock Error: ${lowStockError.message}`);

    return {
      totalInventoryValue: rpcData.totalInventoryValue,
      lowStockCount: rpcData.lowStockCount,
      totalProducts: rpcData.totalProducts,
      recentSales,
      topSellingProducts,
      lowStockProducts: lowStockData || []
    };
  }
}
