import { Money, type IProductRepository } from '../../domain';
import type { UpdateStockDTO } from '../dtos';

/**
 * UpdateStockUseCase
 * Caso de uso para actualizar el stock de un producto
 * 
 * Responsabilidades:
 * - Validar que el producto existe
 * - Incrementar o decrementar el stock según la operación
 * - Persistir los cambios
 */
export class UpdateStockUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(dto: UpdateStockDTO): Promise<void> {
    // 1. Buscar el producto
    const product = await this.productRepository.findById(dto.productId);
    
    if (!product) {
      throw new Error(`Producto no encontrado con ID: ${dto.productId}`);
    }

    // 2. Actualizar el stock según la operación
    if (dto.operation === 'increase') {
      product.increaseStock(dto.quantity);
    } else {
      product.decreaseStock(dto.quantity);
    }

    // 3. Persistir los cambios
    await this.productRepository.save(product);
  }
}
