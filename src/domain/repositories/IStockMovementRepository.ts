import { StockMovement } from '../entities/StockMovement';

/**
 * IStockMovementRepository Interface
 * Define el contrato para la persistencia del historial de stock
 */
export interface IStockMovementRepository {
  /**
   * Guarda un nuevo movimiento de stock
   */
  save(movement: StockMovement): Promise<void>;

  /**
   * Recupera el historial de movimientos de un producto
   */
  getByProductId(productId: string): Promise<StockMovement[]>;
}
