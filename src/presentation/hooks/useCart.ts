'use client';

import { useState, useCallback, useMemo } from 'react';
import type { ProductResponseDTO } from '../../application';
import { Sale, SaleItem, Money } from '../../domain';

export interface CartItem extends ProductResponseDTO {
  cartQuantity: number;
}

/**
 * useCart Hook
 * Gestiona el estado del carrito de compras para el POS
 * Centraliza la lógica de negocio y validaciones
 */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  // Instancia temporal de Sale para cálculos consistentes con el dominio
  const tempSale = useMemo(() => {
    const saleItems = items.map(item => SaleItem.create(
      item.id,
      item.id,
      item.name,
      item.cartQuantity,
      Money.create(item.price.amount, item.price.currency)
    ));
    return Sale.fromPersistence({
      id: 'temp',
      date: new Date(),
      items: saleItems
    });
  }, [items]);

  const addToCart = useCallback((product: ProductResponseDTO) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        if (existingItem.cartQuantity >= product.stock) {
          return currentItems; // No hay más stock
        }
        return currentItems.map(item => 
          item.id === product.id 
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }
      
      return [...currentItems, { ...product, cartQuantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(currentItems => {
      const item = currentItems.find(i => i.id === productId);
      if (!item) return currentItems;

      if (quantity <= 0) {
        return currentItems.filter(i => i.id !== productId);
      }

      // No permitir exceder el stock
      const newQuantity = Math.min(quantity, item.stock);
      
      return currentItems.map(i => 
        i.id === productId ? { ...i, cartQuantity: newQuantity } : i
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Propiedades derivadas del Dominio
  const total = tempSale.totalAmount.amount;
  const itemCount = items.reduce((sum, item) => sum + item.cartQuantity, 0);
  const isValidSale = items.length > 0 && total > 0;

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    isValidSale
  };
}
