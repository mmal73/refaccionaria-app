import { describe, it, expect } from 'vitest';
import { SaleItem } from '../SaleItem';
import { Money } from '../../value-objects/Money';

describe('SaleItem Entity', () => {
  it('should create a valid sale item', () => {
    const price = Money.create(100, 'MXN');
    const item = SaleItem.create('item-1', 'prod-1', 'Test Product', 2, price);

    expect(item.id).toBe('item-1');
    expect(item.productId).toBe('prod-1');
    expect(item.productName).toBe('Test Product');
    expect(item.quantity).toBe(2);
    expect(item.unitPrice).toBe(price);
  });

  it('should calculate subtotal correctly', () => {
    const price = Money.create(150, 'MXN');
    const item = SaleItem.create('item-1', 'prod-1', 'Test Product', 3, price);

    expect(item.subtotal.amount).toBe(450);
    expect(item.subtotal.currency).toBe('MXN');
  });

  it('should throw error when quantity is zero', () => {
    const price = Money.create(100, 'MXN');
    expect(() => {
      SaleItem.create('item-1', 'prod-1', 'Test Product', 0, price);
    }).toThrow('La cantidad vendida debe ser mayor a cero');
  });

  it('should throw error when quantity is negative', () => {
    const price = Money.create(100, 'MXN');
    expect(() => {
      SaleItem.create('item-1', 'prod-1', 'Test Product', -1, price);
    }).toThrow('La cantidad vendida debe ser mayor a cero');
  });
});
