import { type Product, type IProductRepository } from '../../domain';
import { ProductMapper, type ProductResponseDTO } from '..';

/**
 * GetAllProductsUseCase
 * Caso de uso para obtener todos los productos del catálogo
 */
export class GetAllProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  /**
   * Ejecuta el caso de uso
   * @returns Lista de productos mapeados a DTOs
   */
  async execute(): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.findAll();
    return products.map(product => ProductMapper.toDTO(product));
  }
}
