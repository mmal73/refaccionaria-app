'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { 
  GetAllProductsUseCase, 
  SearchProductsUseCase, 
  CreateSaleUseCase 
} from '../../../application';
import { SupabaseProductRepository } from '../../../infrastructure/persistence/repositories/SupabaseProductRepository';
import { SupabaseSaleRepository } from '../../../infrastructure/persistence/repositories/SupabaseSaleRepository';
import { SupabaseStockMovementRepository } from '../../../infrastructure/persistence/repositories/SupabaseStockMovementRepository';

interface POSServices {
  getAllProducts: GetAllProductsUseCase;
  searchProducts: SearchProductsUseCase;
  createSale: CreateSaleUseCase;
}

const POSContext = createContext<POSServices | null>(null);

/**
 * POSProvider
 * Composition Root for POS dependencies.
 * Instantiates repositories and use cases once.
 */
export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const services = useMemo(() => {
    // 1. Instantiate Repositories
    const productRepo = new SupabaseProductRepository();
    const saleRepo = new SupabaseSaleRepository();
    const movementRepo = new SupabaseStockMovementRepository();

    // 2. Instantiate Use Cases
    return {
      getAllProducts: new GetAllProductsUseCase(productRepo),
      searchProducts: new SearchProductsUseCase(productRepo),
      createSale: new CreateSaleUseCase(saleRepo, productRepo, movementRepo),
    };
  }, []);

  return (
    <POSContext.Provider value={services}>
      {children}
    </POSContext.Provider>
  );
};

/**
 * usePOSServices
 * Hook to access injected use cases.
 */
export const usePOSServices = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOSServices must be used within a POSProvider');
  }
  return context;
};
