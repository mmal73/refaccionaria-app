import { type SupabaseClient } from '@supabase/supabase-js';
import { Sale, SaleItem, type ISaleRepository, Money } from '../../../domain';
import { getSupabaseClient } from '../supabase/client';

/**
 * SupabaseSaleRepository
 * Implementación de ISaleRepository usando Supabase.
 * Maneja la inserción de la cabecera (sales) y el detalle (sale_items).
 */
export class SupabaseSaleRepository implements ISaleRepository {
  private supabase: SupabaseClient<any> = getSupabaseClient();

  async save(sale: Sale): Promise<void> {
    // 1. Insertar la cabecera de la venta
    const { error: saleError } = await this.supabase
      .from('sales')
      .insert({
        id: sale.id,
        customer_name: sale.customerName || null,
        total_amount: sale.totalAmount.amount,
        currency: sale.totalAmount.currency,
        created_at: sale.date.toISOString(),
      });

    if (saleError) {
      throw new Error(`Error al guardar cabecera de venta: ${saleError.message}`);
    }

    // 2. Insertar los items de la venta
    const itemsData = sale.items.map(item => ({
      id: item.id,
      sale_id: sale.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      unit_price: item.unitPrice.amount,
      subtotal: item.subtotal.amount,
    }));

    const { error: itemsError } = await this.supabase
      .from('sale_items')
      .insert(itemsData);

    if (itemsError) {
      // Nota: En un entorno productivo querríamos un rollback real.
      // Aquí confiamos en RLS y validaciones previas o borramos la cabecera si falla.
      throw new Error(`Error al guardar items de venta: ${itemsError.message}`);
    }
  }

  async getById(id: string): Promise<Sale | null> {
    // Obtener cabecera e items en paralelo
    const [saleRes, itemsRes] = await Promise.all([
      this.supabase.from('sales').select('*').eq('id', id).maybeSingle(),
      this.supabase.from('sale_items').select('*').eq('sale_id', id)
    ]);

    if (saleRes.error || itemsRes.error) {
      throw new Error(`Error al recuperar venta: ${saleRes.error?.message || itemsRes.error?.message}`);
    }

    if (!saleRes.data) return null;

    const items = itemsRes.data.map((item: any) => new SaleItem(
      item.id,
      item.product_id,
      item.product_name,
      item.quantity,
      new Money(item.unit_price, saleRes.data.currency),
      new Money(item.subtotal, saleRes.data.currency)
    ));

    return Sale.fromPersistence({
      id: saleRes.data.id,
      date: new Date(saleRes.data.created_at),
      customerName: saleRes.data.customer_name || undefined,
      items
    });
  }
}
