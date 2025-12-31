'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from './useCart';
import { 
  GetAllProductsUseCase, 
  SearchProductsUseCase, 
  CreateSaleUseCase,
  type ProductResponseDTO 
} from '../../application';
import { SupabaseProductRepository } from '../../infrastructure/persistence/repositories/SupabaseProductRepository';
import { SupabaseSaleRepository } from '../../infrastructure/persistence/repositories/SupabaseSaleRepository';
import { SupabaseStockMovementRepository } from '../../infrastructure/persistence/repositories/SupabaseStockMovementRepository';

/**
 * usePOSLogic Hook
 * Encapsula toda la lógica de estado, efectos y handlers del Punto de Venta.
 */
export function usePOSLogic() {
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [saleError, setSaleError] = useState<string | null>(null);
  
  // Recibo State
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Cart Logic (Shared hook)
  const cart = useCart();

  // Load Products
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const repo = new SupabaseProductRepository();
      const useCase = new GetAllProductsUseCase(repo);
      const result = await useCase.execute();
      setProducts(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search Products
  const handleSearch = useCallback(async (query: string) => {
    if (query.trim().length === 0) {
      loadProducts();
      return;
    }
    if (query.trim().length < 2) return;

    setIsLoading(true);
    try {
      const repo = new SupabaseProductRepository();
      const useCase = new SearchProductsUseCase(repo);
      const result = await useCase.execute(query);
      setProducts(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [loadProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) handleSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, handleSearch]);

  const handleCompleteSale = async () => {
    if (!cart.isValidSale) return;

    setIsProcessing(true);
    setSaleError(null);

    try {
      const saleRepo = new SupabaseSaleRepository();
      const productRepo = new SupabaseProductRepository();
      const movementRepo = new SupabaseStockMovementRepository();
      const useCase = new CreateSaleUseCase(saleRepo, productRepo, movementRepo);

      const saleId = await useCase.execute({
        customerName: customerName.trim() || undefined,
        items: cart.items.map(item => ({
          productId: item.id,
          quantity: item.cartQuantity
        }))
      });

      // Prepare Receipt Data
      setReceiptData({
        saleId,
        date: new Date(),
        customerName: customerName || undefined,
        items: cart.items.map(item => ({
          productName: item.name,
          quantity: item.cartQuantity,
          unitPrice: item.price.amount,
          subtotal: item.price.amount * item.cartQuantity
        })),
        total: cart.total,
        currency: 'MXN'
      });

      setIsReceiptOpen(true);
      cart.clearCart();
      setCustomerName('');
      loadProducts(); // Fresh stock after sale
    } catch (err) {
      setSaleError(err instanceof Error ? err.message : 'Error al procesar la venta');
    } finally {
      setIsProcessing(false);
    }
  };

  const closeReceipt = () => setIsReceiptOpen(false);

  return {
    // State
    products,
    searchTerm,
    isLoading,
    isProcessing,
    customerName,
    saleError,
    receiptData,
    isReceiptOpen,
    
    // Actions
    setSearchTerm,
    setCustomerName,
    handleCompleteSale,
    closeReceipt,
    
    // Cart Actions (Pass through)
    cart
  };
}
