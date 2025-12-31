import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { POSCart } from '../POSCart';
import type { CartItem } from '../../../hooks/useCart';

describe('POSCart Component', () => {
  const mockItems: CartItem[] = [
    {
      id: 'p1',
      name: 'Product 1',
      price: { amount: 100, currency: 'MXN' },
      stock: 10,
      cartQuantity: 2,
      inventoryValue: { amount: 1000, currency: 'MXN' },
      hasLowStock: false,
      isOutOfStock: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockProps = {
    items: [],
    onUpdateQuantity: vi.fn(),
    onRemoveItem: vi.fn(),
    onClearCart: vi.fn()
  };

  it('should render empty state correctly', () => {
    render(<POSCart {...mockProps} />);
    expect(screen.getByText('El carrito está vacío')).toBeInTheDocument();
  });

  it('should render items in cart', () => {
    render(<POSCart {...mockProps} items={mockItems} />);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Quantity
    // Check formatted price (Note: formatMoney uses NBSP or specific formatting, so we might need fuzzy match)
    expect(screen.getByText(/\$200/)).toBeInTheDocument(); // Total for this item
  });

  it('should call onUpdateQuantity when + or - clicked', () => {
    render(<POSCart {...mockProps} items={mockItems} />);
    
    const plusButton = screen.getByText('+');
    const minusButton = screen.getByText('-');

    fireEvent.click(plusButton);
    expect(mockProps.onUpdateQuantity).toHaveBeenCalledWith('p1', 3);

    fireEvent.click(minusButton);
    expect(mockProps.onUpdateQuantity).toHaveBeenCalledWith('p1', 1);
  });

  it('should call onRemoveItem when trash icon clicked', () => {
    render(<POSCart {...mockProps} items={mockItems} />);
    
    // The trash button has a specific class or we can find by svg/role
    // Let's use the button that contains the trash icon
    const removeButtons = screen.getAllByRole('button');
    // minus is index 1, plus is index 2, trash is index 3 in our mockItems map
    // Better to find by a more specific way if possible, or just index for now
    fireEvent.click(removeButtons[3]); 
    expect(mockProps.onRemoveItem).toHaveBeenCalledWith('p1');
  });

  it('should call onClearCart when "Vaciar" is clicked', () => {
    render(<POSCart {...mockProps} items={mockItems} />);
    
    const clearButton = screen.getByText('Vaciar');
    fireEvent.click(clearButton);
    expect(mockProps.onClearCart).toHaveBeenCalled();
  });

  it('should disable + button if quantity reaches stock', () => {
    const limitedItem = [{ ...mockItems[0], cartQuantity: 10, stock: 10 }];
    render(<POSCart {...mockProps} items={limitedItem} />);
    
    const plusButton = screen.getByText('+') as HTMLButtonElement;
    expect(plusButton).toBeDisabled();
  });
});
