import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../useCart';
import type { ProductResponseDTO } from '../../../application';

describe('useCart Hook', () => {
  const mockProduct: ProductResponseDTO = {
    id: 'p1',
    name: 'Product 1',
    price: { amount: 100, currency: 'MXN' },
    stock: 10,
    inventoryValue: { amount: 1000, currency: 'MXN' },
    hasLowStock: false,
    isOutOfStock: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('should start with an empty cart', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.isValidSale).toBe(false);
  });

  it('should add a product to the cart', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('p1');
    expect(result.current.items[0].cartQuantity).toBe(1);
    expect(result.current.total).toBe(100);
    expect(result.current.itemCount).toBe(1);
    expect(result.current.isValidSale).toBe(true);
  });

  it('should increase quantity if product is already in cart', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct);
    });

    expect(result.current.items[0].cartQuantity).toBe(2);
    expect(result.current.total).toBe(200);
  });

  it('should not exceed available stock when adding', () => {
    const { result } = renderHook(() => useCart());
    const lowStockProduct = { ...mockProduct, stock: 1 };
    
    act(() => {
      result.current.addToCart(lowStockProduct);
      result.current.addToCart(lowStockProduct);
    });

    expect(result.current.items[0].cartQuantity).toBe(1);
  });

  it('should update quantity manually', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct);
      result.current.updateQuantity('p1', 5);
    });

    expect(result.current.items[0].cartQuantity).toBe(5);
    expect(result.current.total).toBe(500);
  });

  it('should remove item if quantity updated to 0', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct);
      result.current.updateQuantity('p1', 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should remove product from cart', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct);
      result.current.removeFromCart('p1');
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should clear the entire cart', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart({ ...mockProduct, id: 'p2' });
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });
});
