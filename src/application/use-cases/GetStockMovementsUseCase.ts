import { type IStockMovementRepository, type StockMovement } from '../../domain';

/**
 * GetStockMovementsUseCase
 * Recupera el historial de movimientos de un producto
 */
export class GetStockMovementsUseCase {
  constructor(private readonly stockMovementRepository: IStockMovementRepository) {}

  async execute(productId: string): Promise<StockMovement[]> {
    const movements = await this.stockMovementRepository.getByProductId(productId);
    
    // Devolvemos ordenados por fecha descendente
    return movements.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
