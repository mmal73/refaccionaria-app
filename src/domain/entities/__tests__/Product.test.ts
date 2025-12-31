import { describe, it, expect } from '@jest/globals';
import { Product } from '../Product';
import { Money } from '../../value-objects/Money';

describe('Product Entity', () => {
  describe('Validation Rules', () => {
    it('should create a valid product', () => {
      const price = Money.create(100, 'MXN');
      const product = Product.create(
        'prod-1',
        'Valid Product',
        price,
        50,
        'A valid description',
        'Electronics',
        'https://example.com/image.jpg'
      );

      expect(product.id).toBe('prod-1');
      expect(product.name).toBe('Valid Product');
      expect(product.price).toBe(price);
      expect(product.stock).toBe(50);
      expect(product.description).toBe('A valid description');
      expect(product.category).toBe('Electronics');
      expect(product.imageUrl).toBe('https://example.com/image.jpg');
    });

    it('should throw error when ID is empty', () => {
      const price = Money.create(100, 'MXN');
      
      expect(() => {
        Product.create('', 'Product Name', price, 10);
      }).toThrow('El ID del producto es requerido');
    });

    it('should throw error when ID is only whitespace', () => {
      const price = Money.create(100, 'MXN');
      
      expect(() => {
        Product.create('   ', 'Product Name', price, 10);
      }).toThrow('El ID del producto es requerido');
    });

    it('should throw error when name is less than 3 characters', () => {
      const price = Money.create(100, 'MXN');
      
      expect(() => {
        Product.create('prod-1', 'AB', price, 10);
      }).toThrow('El nombre del producto debe tener al menos 3 caracteres');
    });

    it('should throw error when name is empty', () => {
      const price = Money.create(100, 'MXN');
      
      expect(() => {
        Product.create('prod-1', '', price, 10);
      }).toThrow('El nombre del producto debe tener al menos 3 caracteres');
    });

    it('should throw error when price is zero', () => {
      const price = Money.create(0, 'MXN');
      
      expect(() => {
        Product.create('prod-1', 'Product Name', price, 10);
      }).toThrow('El precio debe ser mayor a 0');
    });

    it('should throw error when price is negative', () => {
      // Money.create will throw before Product validates
      expect(() => {
        Money.create(-100, 'MXN');
      }).toThrow('El monto no puede ser negativo');
    });

    it('should throw error when stock is negative', () => {
      const price = Money.create(100, 'MXN');
      
      expect(() => {
        Product.create('prod-1', 'Product Name', price, -5);
      }).toThrow('El stock no puede ser negativo');
    });

    it('should accept stock of zero', () => {
      const price = Money.create(100, 'MXN');
      const product = Product.create('prod-1', 'Product Name', price, 0);
      
      expect(product.stock).toBe(0);
    });

    it('should trim whitespace from name', () => {
      const price = Money.create(100, 'MXN');
      const product = Product.create('prod-1', '  Product Name  ', price, 10);
      
      expect(product.name).toBe('Product Name');
    });

    it('should trim whitespace from optional fields', () => {
      const price = Money.create(100, 'MXN');
      const product = Product.create(
        ' prod-1 ',
        'Product Name',
        price,
        10,
        '  Description  ',
        '  Category  ',
        '  https://example.com/image.jpg  '
      );
      
      expect(product.id).toBe('prod-1');
      expect(product.description).toBe('Description');
      expect(product.category).toBe('Category');
      expect(product.imageUrl).toBe('https://example.com/image.jpg');
    });
  });

  describe('Stock Management', () => {
    let product: Product;

    beforeEach(() => {
      const price = Money.create(100, 'MXN');
      product = Product.create('prod-1', 'Test Product', price, 20);
    });

    describe('increaseStock', () => {
      it('should increase stock by the specified quantity', () => {
        product.increaseStock(10);
        expect(product.stock).toBe(30);
      });

      it('should throw error when quantity is zero', () => {
        expect(() => {
          product.increaseStock(0);
        }).toThrow('La cantidad a incrementar debe ser mayor a 0');
      });

      it('should throw error when quantity is negative', () => {
        expect(() => {
          product.increaseStock(-5);
        }).toThrow('La cantidad a incrementar debe ser mayor a 0');
      });

      it('should update the updatedAt timestamp', () => {
        const originalUpdatedAt = product.updatedAt;
        // Wait a bit to ensure timestamp difference
        setTimeout(() => {
          product.increaseStock(5);
          expect(product.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
        }, 10);
      });
    });

    describe('decreaseStock', () => {
      it('should decrease stock by the specified quantity', () => {
        product.decreaseStock(5);
        expect(product.stock).toBe(15);
      });

      it('should allow decreasing to zero', () => {
        product.decreaseStock(20);
        expect(product.stock).toBe(0);
      });

      it('should throw error when quantity is zero', () => {
        expect(() => {
          product.decreaseStock(0);
        }).toThrow('La cantidad a decrementar debe ser mayor a 0');
      });

      it('should throw error when quantity is negative', () => {
        expect(() => {
          product.decreaseStock(-5);
        }).toThrow('La cantidad a decrementar debe ser mayor a 0');
      });

      it('should throw error when quantity exceeds available stock', () => {
        expect(() => {
          product.decreaseStock(25);
        }).toThrow('Stock insuficiente. Disponible: 20, Solicitado: 25');
      });

      it('should update the updatedAt timestamp', () => {
        const originalUpdatedAt = product.updatedAt;
        setTimeout(() => {
          product.decreaseStock(5);
          expect(product.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
        }, 10);
      });
    });

    describe('Stock Status Checks', () => {
      it('should identify product as out of stock when stock is 0', () => {
        const price = Money.create(100, 'MXN');
        const outOfStockProduct = Product.create('prod-2', 'Out of Stock', price, 0);
        
        expect(outOfStockProduct.isOutOfStock()).toBe(true);
        expect(outOfStockProduct.hasLowStock()).toBe(false);
      });

      it('should identify product as having low stock when between 1-9 units', () => {
        const price = Money.create(100, 'MXN');
        
        for (let stock = 1; stock < 10; stock++) {
          const lowStockProduct = Product.create(`prod-${stock}`, 'Low Stock', price, stock);
          expect(lowStockProduct.hasLowStock()).toBe(true);
          expect(lowStockProduct.isOutOfStock()).toBe(false);
        }
      });

      it('should not identify product as low stock when at 10 or more units', () => {
        const price = Money.create(100, 'MXN');
        const normalStockProduct = Product.create('prod-3', 'Normal Stock', price, 10);
        
        expect(normalStockProduct.hasLowStock()).toBe(false);
        expect(normalStockProduct.isOutOfStock()).toBe(false);
      });

      it('should correctly check if there is enough stock', () => {
        expect(product.hasEnoughStock(10)).toBe(true);
        expect(product.hasEnoughStock(20)).toBe(true);
        expect(product.hasEnoughStock(21)).toBe(false);
        expect(product.hasEnoughStock(0)).toBe(true);
      });
    });

    describe('Multiple Stock Operations', () => {
      it('should handle multiple increase operations', () => {
        product.increaseStock(5);
        product.increaseStock(10);
        product.increaseStock(3);
        
        expect(product.stock).toBe(38);
      });

      it('should handle multiple decrease operations', () => {
        product.decreaseStock(5);
        product.decreaseStock(3);
        product.decreaseStock(2);
        
        expect(product.stock).toBe(10);
      });

      it('should handle mixed increase and decrease operations', () => {
        product.increaseStock(10);
        product.decreaseStock(5);
        product.increaseStock(15);
        product.decreaseStock(8);
        
        expect(product.stock).toBe(32);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle large stock values', () => {
      const price = Money.create(100, 'MXN');
      const product = Product.create('prod-1', 'Product', price, 1000000);
      
      expect(product.stock).toBe(1000000);
    });

    it('should handle very long product names', () => {
      const price = Money.create(100, 'MXN');
      const longName = 'A'.repeat(1000);
      const product = Product.create('prod-1', longName, price, 10);
      
      expect(product.name.length).toBe(1000);
    });

    it('should calculate inventory value correctly', () => {
      const price = Money.create(50, 'MXN');
      const product = Product.create('prod-1', 'Product', price, 10);
      
      const inventoryValue = product.calculateInventoryValue();
      expect(inventoryValue.amount).toBe(500);
      expect(inventoryValue.currency).toBe('MXN');
    });
  });
});
