'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ProductResponseDTO } from '../../application';
import { usePOSServices } from '../components/pos/POSContext';

/**
 * usePOSProducts
 * Maneja la carga y búsqueda de productos para el catálogo del POS.
 */
export function usePOSProducts() {
  const { getAllProducts, searchProducts } = usePOSServices();
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAllProducts.execute();
      setProducts(result);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getAllProducts]);

  const handleSearch = useCallback(async (query: string) => {
    if (query.trim().length === 0) {
      loadProducts();
      return;
    }
    if (query.trim().length < 2) return;

    setIsLoading(true);
    try {
      const result = await searchProducts.execute(query);
      setProducts(result);
    } catch (err) {
      console.error('Error searching products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchProducts, loadProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) handleSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, handleSearch]);

  return {
    products,
    searchTerm,
    setSearchTerm,
    isLoading,
    refreshProducts: loadProducts
  };
}
