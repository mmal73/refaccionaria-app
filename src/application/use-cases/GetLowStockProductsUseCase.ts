import { type IProductRepository } from '../../domain';
import type { ProductResponseDTO } from '../dtos';
import { ProductMapper } from '../mappers';

/**
 * GetLowStockProductsUseCase
 * Caso de uso para obtener productos con stock bajo
 * 
 * Útil para alertas de inventario y reabastecimiento
 */
export class GetLowStockProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.findLowStock();
    return ProductMapper.toDTOList(products);
  }
}
