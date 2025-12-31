'use client';

import { useState } from 'react';
import { usePOSServices } from '../components/pos/POSContext';
import type { CartItem } from './useCart';
import type { ReceiptDTO } from '../../application';

/**
 * usePOSSaleExecution
 * Maneja el proceso de cobro y generación de recibos.
 */
export function usePOSSaleExecution(cart: {
  items: CartItem[];
  total: number;
  isValidSale: boolean;
  clearCart: () => void;
}) {
  const { createSale } = usePOSServices();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [saleError, setSaleError] = useState<string | null>(null);
  
  const [receiptData, setReceiptData] = useState<ReceiptDTO | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const handleCompleteSale = async (onSuccess?: () => void) => {
    if (!cart.isValidSale || isProcessing) return;

    setIsProcessing(true);
    setSaleError(null);

    try {
      const saleId = await createSale.execute({
        customerName: customerName.trim() || undefined,
        items: cart.items.map(item => ({
          productId: item.id,
          quantity: item.cartQuantity
        }))
      });

      // Map to DTO (Application Layer logic)
      const receipt: ReceiptDTO = {
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
      };

      setReceiptData(receipt);
      setIsReceiptOpen(true);
      
      // Cleanup
      cart.clearCart();
      setCustomerName('');
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setSaleError(err instanceof Error ? err.message : 'Error inesperado al procesar la venta');
    } finally {
      setIsProcessing(false);
    }
  };

  const closeReceipt = () => setIsReceiptOpen(false);

  return {
    customerName,
    setCustomerName,
    isProcessing,
    saleError,
    receiptData,
    isReceiptOpen,
    handleCompleteSale,
    closeReceipt
  };
}
