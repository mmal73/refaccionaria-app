import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { POSCatalog } from '../POSCatalog';
import type { ProductResponseDTO } from '../../../application';

describe('POSCatalog Component', () => {
  const mockProducts: ProductResponseDTO[] = [
    {
      id: 'p1',
      name: 'Product 1',
      price: { amount: 100, currency: 'MXN' },
      stock: 10,
      inventoryValue: { amount: 1000, currency: 'MXN' },
      hasLowStock: false,
      isOutOfStock: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p2',
      name: 'Product 2',
      price: { amount: 200, currency: 'MXN' },
      stock: 0,
       inventoryValue: { amount: 0, currency: 'MXN' },
      hasLowStock: false,
      isOutOfStock: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockProps = {
    products: [],
    isLoading: false,
    onAddToCart: vi.fn()
  };

  it('should render loading state', () => {
    render(<POSCatalog {...mockProps} isLoading={true} />);
    // ProductList renders pulses when loading
    const pulses = document.querySelectorAll('.animate-pulse');
    expect(pulses.length).toBeGreaterThan(0);
  });

  it('should render empty state if no products found', () => {
    render(<POSCatalog {...mockProps} />);
    expect(screen.getByText('No se encontraron productos')).toBeInTheDocument();
  });

  it('should render products', () => {
    render(<POSCatalog {...mockProps} products={mockProducts} />);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('should call onAddToCart when "Agregar" button is clicked', () => {
    render(<POSCatalog {...mockProps} products={mockProducts} />);
    
    // Find button for Product 1 (Product 2 is out of stock so button might be disabled)
    const addButtons = screen.getAllByText('Agregar al Carrito');
    fireEvent.click(addButtons[0]);
    
    expect(mockProps.onAddToCart).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('should disable "Agregar" button if product is out of stock', () => {
    render(<POSCatalog {...mockProps} products={mockProducts} />);
    
    const addButtons = screen.getAllByText('Agregar al Carrito') as HTMLButtonElement[];
    // Index 1 corresponds to Product 2 which is out of stock
    expect(addButtons[1]).toBeDisabled();
  });
});
