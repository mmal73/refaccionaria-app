import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePOSLogic } from '../usePOSLogic';
import * as useCartHook from '../useCart';
import * as usePOSProductsHook from '../usePOSProducts';
import * as usePOSSaleExecutionHook from '../usePOSSaleExecution';

// Mock the specialized hooks
vi.mock('../useCart');
vi.mock('../usePOSProducts');
vi.mock('../usePOSSaleExecution');

describe('usePOSLogic Orchestrator Hook', () => {
  const mockCart = {
    items: [],
    total: 0,
    isValidSale: false,
    clearCart: vi.fn()
  };

  const mockProducts = {
    products: [],
    searchTerm: '',
    isLoading: false,
    setSearchTerm: vi.fn(),
    refreshProducts: vi.fn()
  };

  const mockSaleExecution = {
    isProcessing: false,
    customerName: '',
    saleError: null,
    receiptData: null,
    isReceiptOpen: false,
    setCustomerName: vi.fn(),
    handleCompleteSale: vi.fn(),
    closeReceipt: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useCartHook.useCart as any).mockReturnValue(mockCart);
    (usePOSProductsHook.usePOSProducts as any).mockReturnValue(mockProducts);
    (usePOSSaleExecutionHook.usePOSSaleExecution as any).mockReturnValue(mockSaleExecution);
  });

  it('should compose and return all specialized states', () => {
    const { result } = renderHook(() => usePOSLogic());

    expect(result.current.products).toEqual(mockProducts.products);
    expect(result.current.cart.items).toEqual(mockCart.items);
    expect(result.current.isProcessing).toBe(false);
  });

  it('should orchestrate handleCompleteSale and refresh products on success', () => {
    const { result } = renderHook(() => usePOSLogic());
    
    // Simulate successful sale by calling the onSuccess callback passed to handleCompleteSale
    mockSaleExecution.handleCompleteSale.mockImplementation((onSuccess: () => void) => {
      onSuccess();
    });

    act(() => {
      result.current.handleCompleteSale();
    });

    expect(mockSaleExecution.handleCompleteSale).toHaveBeenCalled();
    expect(mockProducts.refreshProducts).toHaveBeenCalled();
  });
});
