import React from 'react';
import { ProductList } from '../ProductList';
import type { ProductResponseDTO } from '../../../application';

interface POSCatalogProps {
  products: ProductResponseDTO[];
  isLoading: boolean;
  onAddToCart: (product: ProductResponseDTO) => void;
}

export const POSCatalog: React.FC<POSCatalogProps> = ({ products, isLoading, onAddToCart }) => {
  return (
    <section className="flex-1 overflow-y-auto p-6 bg-gray-100/50">
      <ProductList products={products} isLoading={isLoading} onAddToCart={onAddToCart} />
    </section>
  );
};
