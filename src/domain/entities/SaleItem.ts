import { Money } from '../value-objects/Money';

/**
 * SaleItem Entity
 * Representa un producto dentro de una venta específica
 */
export class SaleItem {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly productName: string,
    public readonly quantity: number,
    public readonly unitPrice: Money
  ) {
    if (quantity <= 0) {
      throw new Error('La cantidad vendida debe ser mayor a cero');
    }
  }

  /**
   * Getter para el subtotal calculado
   */
  get subtotal(): Money {
    return this.unitPrice.multiply(this.quantity);
  }

  /**
   * Crea un SaleItem con validaciones iniciales
   */
  static create(
    id: string,
    productId: string,
    productName: string,
    quantity: number,
    unitPrice: Money
  ): SaleItem {
    return new SaleItem(id, productId, productName, quantity, unitPrice);
  }
}
