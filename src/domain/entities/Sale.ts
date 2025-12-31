import { Money } from '../value-objects/Money';
import { SaleItem } from './SaleItem';

/**
 * Sale Entity
 * Agregado que representa una transacción de venta completa
 */
export class Sale {
  private _items: SaleItem[];
  private _totalAmount: Money;

  constructor(
    public readonly id: string,
    public readonly date: Date,
    items: SaleItem[],
    public readonly customerName?: string
  ) {
    this._items = [...items];
    this._totalAmount = this.calculateTotal();
  }

  get items(): SaleItem[] {
    return [...this._items];
  }

  get totalAmount(): Money {
    return this._totalAmount;
  }

  /**
   * Agrega un item. Si el producto ya existe, suma la cantidad.
   */
  addItem(newItem: SaleItem): void {
    const existingItemIndex = this._items.findIndex(
      item => item.productId === newItem.productId
    );

    if (existingItemIndex >= 0) {
      const existingItem = this._items[existingItemIndex];
      const updatedItem = SaleItem.create(
        existingItem.id,
        existingItem.productId,
        existingItem.productName,
        existingItem.quantity + newItem.quantity,
        existingItem.unitPrice
      );
      this._items[existingItemIndex] = updatedItem;
    } else {
      this._items.push(newItem);
    }
    
    this._totalAmount = this.calculateTotal();
  }

  /**
   * Remueve un item de la venta por su ID de producto
   */
  removeItem(productId: string): void {
    this._items = this._items.filter(item => item.productId !== productId);
    this._totalAmount = this.calculateTotal();
  }

  /**
   * Calcula el impuesto (IVA 16% por defecto)
   */
  calculateTax(rate: number = 0.16): Money {
    return this._totalAmount.multiply(rate);
  }

  /**
   * Calcula el total de la venta sumando los subtotales de los items
   */
  private calculateTotal(): Money {
    if (this._items.length === 0) {
      return Money.create(0, 'MXN');
    }

    const currency = this._items[0].unitPrice.currency;
    const totalAmount = this._items.reduce(
      (sum, item) => sum + item.subtotal.amount,
      0
    );

    return Money.create(totalAmount, currency);
  }

  /**
   * Reconstruye una venta desde persistencia
   */
  static fromPersistence(data: {
    id: string;
    date: Date;
    items: SaleItem[];
    customerName?: string;
  }): Sale {
    return new Sale(data.id, data.date, data.items, data.customerName);
  }
}
