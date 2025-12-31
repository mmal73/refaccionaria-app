import { Sale } from '../entities/Sale';

/**
 * ISaleRepository Interface
 * Define el contrato para la persistencia de ventas
 */
export interface ISaleRepository {
  /**
   * Guarda una venta completa (incluyendo sus items)
   */
  save(sale: Sale): Promise<void>;

  /**
   * Recupera una venta por su ID
   */
  getById(id: string): Promise<Sale | null>;
}
