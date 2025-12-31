import { type IProductRepository } from '../../domain';
import type { ProductResponseDTO } from '../dtos';
import { ProductMapper } from '../mappers';

/**
 * GetProductByIdUseCase
 * Caso de uso para obtener un producto por su ID
 */
export class GetProductByIdUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<ProductResponseDTO | null> {
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      return null;
    }

    return ProductMapper.toDTO(product);
  }
}
