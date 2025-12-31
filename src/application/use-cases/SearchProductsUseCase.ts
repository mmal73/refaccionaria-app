import { type Product, type IProductRepository } from '../../domain';
import { ProductMapper, type ProductResponseDTO } from '..';

/**
 * SearchProductsUseCase
 * Caso de uso para buscar productos por un término de búsqueda general
 */
export class SearchProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param query - Término de búsqueda (mínimo 2 caracteres)
   * @returns Lista de productos que coinciden con el término
   */
  async execute(query: string): Promise<ProductResponseDTO[]> {
    // Validar query básica
    if (!query || query.trim().length < 2) {
      return [];
    }

    const products = await this.productRepository.search(query.trim());
    return products.map(product => ProductMapper.toDTO(product));
  }
}
