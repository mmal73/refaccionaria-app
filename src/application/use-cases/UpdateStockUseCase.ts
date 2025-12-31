import { 
  type IProductRepository, 
  type IStockMovementRepository,
  StockMovement,
  StockMovementType
} from '../../domain';
import { ProductMapper, type ProductResponseDTO } from '..';

export interface UpdateStockDTO {
  productId: string;
  quantity: number;
  type: StockMovementType;
  reason: string;
  userId?: string;
}

/**
 * UpdateStockUseCase
 * Orquesta la actualización de stock de un producto y su registro histórico
 */
export class UpdateStockUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly stockMovementRepository: IStockMovementRepository
  ) {}

  async execute(dto: UpdateStockDTO): Promise<ProductResponseDTO> {
    // 1. Obtener el producto
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new Error(`Producto con ID ${dto.productId} no encontrado`);
    }

    // 2. Ejecutar lógica de dominio según el tipo de movimiento
    if (dto.type === StockMovementType.IN) {
      product.addStock(dto.quantity);
    } else if (dto.type === StockMovementType.OUT) {
      product.removeStock(dto.quantity);
    } else if (dto.type === StockMovementType.ADJUSTMENT) {
      // Para ajuste, calculamos la diferencia
      // Si queremos establecer un nuevo valor, la entidad necesitaría un setStock
      // Pero el prompt dice llamar a add o remove
      // Supondremos que quantity en ADJUSTMENT es la diferencia relativa
      if (dto.quantity > 0) {
        product.addStock(dto.quantity);
      } else if (dto.quantity < 0) {
        product.removeStock(Math.abs(dto.quantity));
      }
    }

    // 3. Crear el movimiento de stock
    const movement = new StockMovement(
      crypto.randomUUID(),
      dto.productId,
      Math.abs(dto.quantity),
      dto.type,
      dto.reason,
      new Date(),
      dto.userId
    );

    // 4. Persistir ambos (En una DB real querríamos una transacción)
    await this.productRepository.save(product);
    await this.stockMovementRepository.save(movement);

    return ProductMapper.toDTO(product);
  }
}
