import { type SupabaseClient } from '@supabase/supabase-js';
import { StockMovement, StockMovementType, type IStockMovementRepository } from '../../../domain';
import { getSupabaseClient, type Database } from '../supabase/client';

// Extendemos el tipo Database localmente si no está actualizado
type StockMovementRow = {
  id: string;
  product_id: string;
  quantity: number;
  type: string;
  reason: string;
  created_at: string;
  user_id: string | null;
};

/**
 * SupabaseStockMovementRepository
 * Implementación de IStockMovementRepository usando Supabase
 */
export class SupabaseStockMovementRepository implements IStockMovementRepository {
  private supabase: SupabaseClient<any> = getSupabaseClient();
  private readonly tableName = 'stock_movements';

  async save(movement: StockMovement): Promise<void> {
    const data = movement.toPersistence();
    
    const { error } = await this.supabase
      .from(this.tableName)
      .insert({
        id: data.id,
        product_id: data.productId,
        quantity: data.quantity,
        type: data.type,
        reason: data.reason,
        created_at: data.date.toISOString(),
        user_id: data.userId || null
      });

    if (error) {
      throw new Error(`Error al guardar movimiento de stock: ${error.message}`);
    }
  }

  async getByProductId(productId: string): Promise<StockMovement[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener movimientos de stock: ${error.message}`);
    }

    return (data as StockMovementRow[]).map(row => StockMovement.fromPersistence({
      id: row.id,
      productId: row.product_id,
      quantity: row.quantity,
      type: row.type as StockMovementType,
      reason: row.reason,
      date: new Date(row.created_at),
      userId: row.user_id || undefined
    }));
  }
}
