import { describe, it, expect, beforeEach } from 'vitest';
import { Sale } from '../Sale';
import { SaleItem } from '../SaleItem';
import { Money } from '../../value-objects/Money';

describe('Sale Entity', () => {
  let price100: Money;
  let price50: Money;

  beforeEach(() => {
    price100 = Money.create(100, 'MXN');
    price50 = Money.create(50, 'MXN');
  });

  it('should create a sale with items', () => {
    const item1 = SaleItem.create('i1', 'p1', 'Product 1', 2, price100);
    const sale = new Sale('s1', new Date(), [item1], 'Customer Name');

    expect(sale.id).toBe('s1');
    expect(sale.customerName).toBe('Customer Name');
    expect(sale.items).toHaveLength(1);
    expect(sale.totalAmount.amount).toBe(200);
  });

  it('should calculate complex total correctly', () => {
    const item1 = SaleItem.create('i1', 'p1', 'Product 1', 2, price100); // 200
    const item2 = SaleItem.create('i2', 'p2', 'Product 2', 3, price50);  // 150
    const sale = new Sale('s1', new Date(), [item1, item2]);

    expect(sale.totalAmount.amount).toBe(350);
  });

  it('should merge items with same productId using addItem', () => {
    const item1 = SaleItem.create('i1', 'p1', 'Product 1', 2, price100);
    const item2 = SaleItem.create('i2', 'p1', 'Product 1', 3, price100);
    
    const sale = new Sale('s1', new Date(), [item1]);
    sale.addItem(item2);

    expect(sale.items).toHaveLength(1);
    expect(sale.items[0].quantity).toBe(5);
    expect(sale.totalAmount.amount).toBe(500);
  });

  it('should add new product as separate item using addItem', () => {
    const item1 = SaleItem.create('i1', 'p1', 'Product 1', 2, price100);
    const item2 = SaleItem.create('i2', 'p2', 'Product 2', 1, price50);
    
    const sale = new Sale('s1', new Date(), [item1]);
    sale.addItem(item2);

    expect(sale.items).toHaveLength(2);
    expect(sale.totalAmount.amount).toBe(250);
  });

  it('should remove item by productId', () => {
    const item1 = SaleItem.create('i1', 'p1', 'Product 1', 2, price100);
    const item2 = SaleItem.create('i2', 'p2', 'Product 2', 1, price50);
    
    const sale = new Sale('s1', new Date(), [item1, item2]);
    sale.removeItem('p1');

    expect(sale.items).toHaveLength(1);
    expect(sale.items[0].productId).toBe('p2');
    expect(sale.totalAmount.amount).toBe(50);
  });

  it('should calculate tax correctly', () => {
    const item1 = SaleItem.create('i1', 'p1', 'Product 1', 1, price100);
    const sale = new Sale('s1', new Date(), [item1]);

    const tax = sale.calculateTax(0.16);
    expect(tax.amount).toBe(16);
  });

  it('should return 0 total if no items', () => {
    const sale = new Sale('s1', new Date(), []);
    expect(sale.totalAmount.amount).toBe(0);
  });

  it('should immutabilize items array in getter', () => {
    const item1 = SaleItem.create('i1', 'p1', 'Product 1', 1, price100);
    const sale = new Sale('s1', new Date(), [item1]);
    
    const items = sale.items;
    (items as any).push(item1);
    
    expect(sale.items).toHaveLength(1);
  });
});
