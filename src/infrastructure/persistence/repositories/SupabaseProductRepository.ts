/**
 * SupabaseProductRepository
 * Implementación del IProductRepository usando Supabase
 * 
 * Este archivo demuestra cómo:
 * 1. La capa INFRASTRUCTURE implementa interfaces del DOMAIN
 * 2. El DOMAIN no conoce Supabase (Inversión de Dependencias)
 * 3. Podemos cambiar de Firebase a Supabase sin tocar DOMAIN o APPLICATION
 */

import { type SupabaseClient } from '@supabase/supabase-js';
import { Product, Money, type IProductRepository } from '../../../domain';
import { getSupabaseClient, type Database } from '../supabase/client';

/**
 * Implementación de IProductRepository usando Supabase
 */
export class SupabaseProductRepository implements IProductRepository {
  private supabase: SupabaseClient<Database> = getSupabaseClient();
  private readonly tableName: 'products' = 'products';

  /**
   * Convierte una fila de Supabase a una entidad Product del dominio
   */
  private rowToProduct(row: Database['public']['Tables']['products']['Row']): Product {
    return Product.fromPersistence({
      id: row.id,
      name: row.name,
      price: {
        amount: row.price_amount,
        currency: row.price_currency,
      },
      stock: row.stock,
      description: row.description || undefined,
      category: row.category || undefined,
      imageUrl: row.image_url || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  /**
   * Convierte una entidad Product a formato de inserción de Supabase
   */
  private productToInsert(
    product: Product
  ): Database['public']['Tables']['products']['Insert'] {
    const data = product.toPersistence();
    return {
      id: data.id,
      name: data.name,
      price_amount: data.price.amount,
      price_currency: data.price.currency,
      stock: data.stock,
      description: data.description || null,
      category: data.category || null,
      image_url: data.imageUrl || null,
      created_at: data.createdAt.toISOString(),
      updated_at: data.updatedAt.toISOString(),
    };
  }

  /**
   * Guarda un producto (crear o actualizar)
   */
  async save(product: Product): Promise<void> {
    const data = this.productToInsert(product);

    const { error } = await this.supabase
      .from('products')
      .upsert(data as any, { onConflict: 'id' });

    if (error) {
      throw new Error(`Error al guardar producto: ${error.message}`);
    }
  }

  /**
   * Busca un producto por su ID
   */
  async findById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Error al buscar producto: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.rowToProduct(data);
  }

  /**
   * Busca todos los productos
   */
  async findAll(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }

    return data.map((row: Database['public']['Tables']['products']['Row']) => this.rowToProduct(row));
  }

  /**
   * Busca productos por categoría
   */
  async findByCategory(category: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Error al buscar por categoría: ${error.message}`);
    }

    return data.map((row: Database['public']['Tables']['products']['Row']) => this.rowToProduct(row));
  }

  /**
   * Busca productos con stock bajo (menos de 10 unidades)
   */
  async findLowStock(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .gt('stock', 0)
      .lt('stock', 10)
      .order('stock', { ascending: true });

    if (error) {
      throw new Error(`Error al buscar stock bajo: ${error.message}`);
    }

    return data.map((row: Database['public']['Tables']['products']['Row']) => this.rowToProduct(row));
  }

  /**
   * Busca productos agotados (stock = 0)
   */
  async findOutOfStock(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('stock', 0)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Error al buscar productos agotados: ${error.message}`);
    }

    return data.map((row: Database['public']['Tables']['products']['Row']) => this.rowToProduct(row));
  }

  /**
   * Busca productos por nombre (búsqueda parcial)
   */
  async searchByName(name: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .ilike('name', `%${name}%`)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Error al buscar por nombre: ${error.message}`);
    }

    return data.map((row: Database['public']['Tables']['products']['Row']) => this.rowToProduct(row));
  }

  /**
   * Elimina un producto por su ID
   */
  async delete(id: string): Promise<boolean> {
    const { error, count } = await this.supabase
      .from('products')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }

    return (count ?? 0) > 0;
  }

  /**
   * Verifica si existe un producto con el ID dado
   */
  async exists(id: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Error al verificar existencia: ${error.message}`);
    }

    return !!data;
  }
}
