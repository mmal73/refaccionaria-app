/**
 * Inventory Page
 * Página para visualizar y buscar productos
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ProductList } from '../../presentation/components';
import { SupabaseProductRepository } from '../../infrastructure/persistence/repositories/SupabaseProductRepository';
import { GetAllProductsUseCase, SearchProductsUseCase, type ProductResponseDTO } from '../../application';

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos iniciales
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const repository = new SupabaseProductRepository();
      const useCase = new GetAllProductsUseCase(repository);
      const result = await useCase.execute();
      setProducts(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar productos
  const handleSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      if (query.trim().length === 0) {
        loadProducts();
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const repository = new SupabaseProductRepository();
      const useCase = new SearchProductsUseCase(repository);
      const result = await useCase.execute(query);
      setProducts(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la búsqueda');
    } finally {
      setIsLoading(false);
    }
  }, [loadProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Debounce para búsqueda (simplificado)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, handleSearch]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Inventario de Productos
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Gestiona y visualiza todos tus productos en un solo lugar.
            </p>
          </div>
          
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Product List */}
        <ProductList products={products} isLoading={isLoading} />
      </div>
    </div>
  );
}
