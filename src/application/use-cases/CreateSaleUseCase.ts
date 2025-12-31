import { 
  type ISaleRepository, 
  type IProductRepository, 
  type IStockMovementRepository,
  Sale,
  SaleItem,
  StockMovement,
  StockMovementType
} from '../../domain';

export interface CreateSaleItemDTO {
  productId: string;
  quantity: number;
}

export interface CreateSaleDTO {
  customerName?: string;
  items: CreateSaleItemDTO[];
}

/**
 * CreateSaleUseCase
 * Coordina el proceso de una venta: validación de stock, actualización de inventario y persistencia.
 */
export class CreateSaleUseCase {
  constructor(
    private readonly saleRepository: ISaleRepository,
    private readonly productRepository: IProductRepository,
    private readonly stockMovementRepository: IStockMovementRepository
  ) {}

  async execute(dto: CreateSaleDTO): Promise<string> {
    const saleId = crypto.randomUUID();
    const saleDate = new Date();
    const saleItems: SaleItem[] = [];

    // 1. Procesar cada item solicitado
    for (const itemDTO of dto.items) {
      // Obtener producto desde la DB por seguridad (precio actual)
      const product = await this.productRepository.findById(itemDTO.productId);
      
      if (!product) {
        throw new Error(`Producto con ID ${itemDTO.productId} no encontrado`);
      }

      // 2. Validar stock
      if (!product.hasEnoughStock(itemDTO.quantity)) {
        throw new Error(`Stock insuficiente para el producto ${product.name}. Disponible: ${product.stock}, Solicitado: ${itemDTO.quantity}`);
      }

      // 3. Restar stock del producto (Domain logic)
      product.removeStock(itemDTO.quantity);

      // 4. Crear movimiento de stock (Sale Exit)
      const movement = new StockMovement(
        crypto.randomUUID(),
        product.id,
        itemDTO.quantity,
        StockMovementType.OUT,
        `Venta #${saleId.substring(0, 8)}`,
        saleDate
      );

      // 5. Crear Item de Venta
      const saleItem = SaleItem.create(
        crypto.randomUUID(),
        product.id,
        product.name,
        itemDTO.quantity,
        product.price
      );

      saleItems.push(saleItem);

      // 6. Persistir cambios de stock y movimiento
      // En una DB real, todo esto debería estar en la misma transacción que la venta.
      await this.productRepository.save(product);
      await this.stockMovementRepository.save(movement);
    }

    // 7. Crear y Guardar la Venta
    const sale = new Sale(
      saleId,
      saleDate,
      saleItems,
      dto.customerName
    );

    await this.saleRepository.save(sale);

    return sale.id;
  }
}
