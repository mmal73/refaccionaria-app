'use client';

import { useCart } from './useCart';
import { usePOSProducts } from './usePOSProducts';
import { usePOSSaleExecution } from './usePOSSaleExecution';

/**
 * usePOSLogic (Orchestrator)
 * Compone los hooks especializados para entregar el contrato que la UI espera.
 * Sigue el patrón Facade.
 */
export function usePOSLogic() {
  const cart = useCart();
  const productsHook = usePOSProducts();
  const saleExecution = usePOSSaleExecution({
    items: cart.items,
    total: cart.total,
    isValidSale: cart.isValidSale,
    clearCart: cart.clearCart
  });

  const handleCompleteSale = () => {
    saleExecution.handleCompleteSale(() => {
      productsHook.refreshProducts(); // Recargar stock tras venta exitosa
    });
  };

  return {
    // Product State
    products: productsHook.products,
    searchTerm: productsHook.searchTerm,
    isLoading: productsHook.isLoading,
    setSearchTerm: productsHook.setSearchTerm,
    
    // Sale Execution state
    isProcessing: saleExecution.isProcessing,
    customerName: saleExecution.customerName,
    saleError: saleExecution.saleError,
    receiptData: saleExecution.receiptData,
    isReceiptOpen: saleExecution.isReceiptOpen,
    setCustomerName: saleExecution.setCustomerName,
    handleCompleteSale,
    closeReceipt: saleExecution.closeReceipt,
    
    // Global Cart
    cart
  };
}
