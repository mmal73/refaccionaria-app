'use client';

import React from 'react';
import { ReceiptModal } from '../../presentation/components/ReceiptModal';
import { usePOSLogic } from '../../presentation/hooks/usePOSLogic';
import { 
  POSHeader, 
  POSCatalog, 
  POSCart, 
  POSPaymentPanel 
} from '../../presentation/components/pos';

/**
 * POS Page (Composition Root)
 * Ensambla la lógica y los componentes presentacionales.
 */
export default function POSPage() {
  const {
    products,
    searchTerm,
    isLoading,
    isProcessing,
    customerName,
    saleError,
    receiptData,
    isReceiptOpen,
    setSearchTerm,
    setCustomerName,
    handleCompleteSale,
    closeReceipt,
    cart
  } = usePOSLogic();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col h-screen overflow-hidden">
      <POSHeader 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      <main className="flex-1 flex overflow-hidden">
        <POSCatalog 
          products={products} 
          isLoading={isLoading} 
          onAddToCart={cart.addToCart} 
        />

        <aside className="w-[400px] bg-white border-l shadow-xl flex flex-col shrink-0">
          <POSCart 
            items={cart.items}
            onUpdateQuantity={cart.updateQuantity}
            onRemoveItem={cart.removeFromCart}
            onClearCart={cart.clearCart}
          />

          <POSPaymentPanel 
            customerName={customerName}
            onCustomerNameChange={setCustomerName}
            itemCount={cart.itemCount}
            total={cart.total}
            isValidSale={cart.isValidSale}
            isProcessing={isProcessing}
            onCompleteSale={handleCompleteSale}
            saleError={saleError}
          />
        </aside>
      </main>

      <ReceiptModal 
        isOpen={isReceiptOpen} 
        onClose={closeReceipt} 
        data={receiptData} 
      />
    </div>
  );
}
