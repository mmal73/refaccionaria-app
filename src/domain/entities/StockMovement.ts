import { StockMovementType } from '../enums/StockMovementType';

/**
 * StockMovement Entity
 * Representa un registro histórico de un cambio en el inventario
 */
export class StockMovement {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly type: StockMovementType,
    public readonly reason: string,
    public readonly date: Date,
    public readonly userId?: string
  ) {
    if (quantity <= 0) {
      throw new Error('La cantidad del movimiento debe ser mayor a cero');
    }
  }

  /**
   * Crea una instancia de StockMovement desde persistencia
   */
  static fromPersistence(data: {
    id: string;
    productId: string;
    quantity: number;
    type: StockMovementType;
    reason: string;
    date: Date;
    userId?: string;
  }): StockMovement {
    return new StockMovement(
      data.id,
      data.productId,
      data.quantity,
      data.type,
      data.reason,
      data.date,
      data.userId
    );
  }

  /**
   * Convierte la entidad a un objeto plano para persistencia
   */
  toPersistence() {
    return {
      id: this.id,
      productId: this.productId,
      quantity: this.quantity,
      type: this.type,
      reason: this.reason,
      date: this.date,
      userId: this.userId,
    };
  }
}
