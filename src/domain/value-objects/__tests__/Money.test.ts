import { describe, it, expect } from 'vitest';
import { Money } from '../Money';

describe('Money Value Object', () => {
  describe('Creation and Validation', () => {
    it('should create a valid Money object', () => {
      const money = Money.create(100, 'MXN');
      
      expect(money.amount).toBe(100);
      expect(money.currency).toBe('MXN');
    });

    it('should default to MXN currency', () => {
      const money = Money.create(100);
      
      expect(money.currency).toBe('MXN');
    });

    it('should accept zero amount', () => {
      const money = Money.create(0, 'USD');
      
      expect(money.amount).toBe(0);
    });

    it('should throw error for negative amount', () => {
      expect(() => {
        Money.create(-50, 'MXN');
      }).toThrow('El monto no puede ser negativo');
    });

    it('should throw error for empty currency', () => {
      expect(() => {
        Money.create(100, '');
      }).toThrow('La moneda debe estar definida');
    });

    it('should throw error for whitespace-only currency', () => {
      expect(() => {
        Money.create(100, '   ');
      }).toThrow('La moneda debe estar definida');
    });

    it('should normalize currency to uppercase', () => {
      const money = Money.create(100, 'usd');
      
      expect(money.currency).toBe('USD');
    });

    it('should trim whitespace from currency', () => {
      const money = Money.create(100, '  EUR  ');
      
      expect(money.currency).toBe('EUR');
    });

    it('should handle decimal amounts', () => {
      const money = Money.create(99.99, 'MXN');
      
      expect(money.amount).toBe(99.99);
    });
  });

  describe('Arithmetic Operations - Add', () => {
    it('should add two Money objects with same currency', () => {
      const money1 = Money.create(100, 'MXN');
      const money2 = Money.create(50, 'MXN');
      
      const result = money1.add(money2);
      
      expect(result.amount).toBe(150);
      expect(result.currency).toBe('MXN');
    });

    it('should add zero amounts', () => {
      const money1 = Money.create(100, 'MXN');
      const money2 = Money.create(0, 'MXN');
      
      const result = money1.add(money2);
      
      expect(result.amount).toBe(100);
    });

    it('should add decimal amounts correctly', () => {
      const money1 = Money.create(10.50, 'MXN');
      const money2 = Money.create(20.75, 'MXN');
      
      const result = money1.add(money2);
      
      expect(result.amount).toBe(31.25);
    });

    it('should throw error when adding different currencies', () => {
      const money1 = Money.create(100, 'MXN');
      const money2 = Money.create(50, 'USD');
      
      expect(() => {
        money1.add(money2);
      }).toThrow('No se pueden sumar monedas diferentes: MXN y USD');
    });

    it('should not mutate original Money objects', () => {
      const money1 = Money.create(100, 'MXN');
      const money2 = Money.create(50, 'MXN');
      
      money1.add(money2);
      
      expect(money1.amount).toBe(100);
      expect(money2.amount).toBe(50);
    });
  });

  describe('Arithmetic Operations - Subtract', () => {
    it('should subtract two Money objects with same currency', () => {
      const money1 = Money.create(100, 'MXN');
      const money2 = Money.create(30, 'MXN');
      
      const result = money1.subtract(money2);
      
      expect(result.amount).toBe(70);
      expect(result.currency).toBe('MXN');
    });

    it('should allow subtraction resulting in zero', () => {
      const money1 = Money.create(100, 'MXN');
      const money2 = Money.create(100, 'MXN');
      
      const result = money1.subtract(money2);
      
      expect(result.amount).toBe(0);
    });

    it('should throw error when result would be negative', () => {
      const money1 = Money.create(50, 'MXN');
      const money2 = Money.create(100, 'MXN');
      
      expect(() => {
        money1.subtract(money2);
      }).toThrow('El monto no puede ser negativo');
    });

    it('should throw error when subtracting different currencies', () => {
      const money1 = Money.create(100, 'MXN');
      const money2 = Money.create(50, 'EUR');
      
      expect(() => {
        money1.subtract(money2);
      }).toThrow('No se pueden restar monedas diferentes: MXN y EUR');
    });

    it('should handle decimal subtraction', () => {
      const money1 = Money.create(50.75, 'MXN');
      const money2 = Money.create(20.25, 'MXN');
      
      const result = money1.subtract(money2);
      
      expect(result.amount).toBe(30.50);
    });

    it('should not mutate original Money objects', () => {
      const money1 = Money.create(100, 'MXN');
      const money2 = Money.create(30, 'MXN');
      
      money1.subtract(money2);
      
      expect(money1.amount).toBe(100);
      expect(money2.amount).toBe(30);
    });
  });

  describe('Arithmetic Operations - Multiply', () => {
    it('should multiply Money by a positive factor', () => {
      const money = Money.create(50, 'MXN');
      
      const result = money.multiply(3);
      
      expect(result.amount).toBe(150);
      expect(result.currency).toBe('MXN');
    });

    it('should multiply by zero', () => {
      const money = Money.create(100, 'MXN');
      
      const result = money.multiply(0);
      
      expect(result.amount).toBe(0);
    });

    it('should multiply by decimal factor', () => {
      const money = Money.create(100, 'MXN');
      
      const result = money.multiply(0.5);
      
      expect(result.amount).toBe(50);
    });

    it('should throw error when multiplying by negative factor', () => {
      const money = Money.create(100, 'MXN');
      
      expect(() => {
        money.multiply(-2);
      }).toThrow('El factor de multiplicación no puede ser negativo');
    });

    it('should preserve currency after multiplication', () => {
      const money = Money.create(100, 'USD');
      
      const result = money.multiply(2);
      
      expect(result.currency).toBe('USD');
    });

    it('should not mutate original Money object', () => {
      const money = Money.create(100, 'MXN');
      
      money.multiply(2);
      
      expect(money.amount).toBe(100);
    });

    it('should handle large multiplications', () => {
      const money = Money.create(1000, 'MXN');
      
      const result = money.multiply(1000);
      
      expect(result.amount).toBe(1000000);
    });
  });

  describe('Comparison Operations', () => {
    describe('equals', () => {
      it('should return true for equal Money objects', () => {
        const money1 = Money.create(100, 'MXN');
        const money2 = Money.create(100, 'MXN');
        
        expect(money1.equals(money2)).toBe(true);
      });

      it('should return false for different amounts', () => {
        const money1 = Money.create(100, 'MXN');
        const money2 = Money.create(50, 'MXN');
        
        expect(money1.equals(money2)).toBe(false);
      });

      it('should return false for different currencies', () => {
        const money1 = Money.create(100, 'MXN');
        const money2 = Money.create(100, 'USD');
        
        expect(money1.equals(money2)).toBe(false);
      });

      it('should return true for zero amounts with same currency', () => {
        const money1 = Money.create(0, 'MXN');
        const money2 = Money.create(0, 'MXN');
        
        expect(money1.equals(money2)).toBe(true);
      });
    });

    describe('isGreaterThan', () => {
      it('should return true when amount is greater', () => {
        const money1 = Money.create(100, 'MXN');
        const money2 = Money.create(50, 'MXN');
        
        expect(money1.isGreaterThan(money2)).toBe(true);
      });

      it('should return false when amount is less', () => {
        const money1 = Money.create(50, 'MXN');
        const money2 = Money.create(100, 'MXN');
        
        expect(money1.isGreaterThan(money2)).toBe(false);
      });

      it('should return false when amounts are equal', () => {
        const money1 = Money.create(100, 'MXN');
        const money2 = Money.create(100, 'MXN');
        
        expect(money1.isGreaterThan(money2)).toBe(false);
      });

      it('should throw error when comparing different currencies', () => {
        const money1 = Money.create(100, 'MXN');
        const money2 = Money.create(50, 'USD');
        
        expect(() => {
          money1.isGreaterThan(money2);
        }).toThrow('No se pueden comparar monedas diferentes: MXN y USD');
      });
    });

    describe('isLessThan', () => {
      it('should return true when amount is less', () => {
        const money1 = Money.create(50, 'MXN');
        const money2 = Money.create(100, 'MXN');
        
        expect(money1.isLessThan(money2)).toBe(true);
      });

      it('should return false when amount is greater', () => {
        const money1 = Money.create(100, 'MXN');
        const money2 = Money.create(50, 'MXN');
        
        expect(money1.isLessThan(money2)).toBe(false);
      });

      it('should return false when amounts are equal', () => {
        const money1 = Money.create(100, 'MXN');
        const money2 = Money.create(100, 'MXN');
        
        expect(money1.isLessThan(money2)).toBe(false);
      });

      it('should throw error when comparing different currencies', () => {
        const money1 = Money.create(100, 'MXN');
        const money2 = Money.create(50, 'EUR');
        
        expect(() => {
          money1.isLessThan(money2);
        }).toThrow('No se pueden comparar monedas diferentes: MXN y EUR');
      });
    });
  });

  describe('Serialization', () => {
    it('should convert to JSON format', () => {
      const money = Money.create(123.45, 'USD');
      
      const json = money.toJSON();
      
      expect(json).toEqual({
        amount: 123.45,
        currency: 'USD'
      });
    });

    it('should create from JSON format', () => {
      const json = { amount: 100, currency: 'MXN' };
      
      const money = Money.fromJSON(json);
      
      expect(money.amount).toBe(100);
      expect(money.currency).toBe('MXN');
    });

    it('should round-trip through JSON', () => {
      const original = Money.create(250.75, 'EUR');
      
      const json = original.toJSON();
      const restored = Money.fromJSON(json);
      
      expect(restored.equals(original)).toBe(true);
    });

    it('should format toString correctly', () => {
      const money = Money.create(100.5, 'MXN');
      
      const str = money.toString();
      
      expect(str).toBe('MXN 100.50');
    });

    it('should format toString with proper decimals', () => {
      const money = Money.create(99, 'USD');
      
      const str = money.toString();
      
      expect(str).toBe('USD 99.00');
    });
  });

  describe('Immutability', () => {
    it('should be immutable after creation', () => {
      const money = Money.create(100, 'MXN');
      
      // The private fields are readonly in TypeScript, so direct modification
      // won't affect the getter as long as we don't bypass the readonly
      // This test verifies that operations return new instances
      const doubled = money.multiply(2);
      
      expect(money.amount).toBe(100);
      expect(doubled.amount).toBe(200);
      expect(doubled).not.toBe(money);
    });

    it('should create new instances for operations', () => {
      const money1 = Money.create(100, 'MXN');
      const money2 = Money.create(50, 'MXN');
      
      const result = money1.add(money2);
      
      expect(result).not.toBe(money1);
      expect(result).not.toBe(money2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large amounts', () => {
      const money = Money.create(999999999.99, 'MXN');
      
      expect(money.amount).toBe(999999999.99);
    });

    it('should handle very small decimal amounts', () => {
      const money = Money.create(0.01, 'MXN');
      
      expect(money.amount).toBe(0.01);
    });

    it('should handle unusual but valid currency codes', () => {
      const money = Money.create(100, 'BTC');
      
      expect(money.currency).toBe('BTC');
    });

    it('should handle multiple decimal places in calculations', () => {
      const money1 = Money.create(10.333, 'MXN');
      const money2 = Money.create(20.667, 'MXN');
      
      const result = money1.add(money2);
      
      expect(result.amount).toBeCloseTo(31, 2);
    });
  });
});
