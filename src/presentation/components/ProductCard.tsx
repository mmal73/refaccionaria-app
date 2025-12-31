import React, { useState } from 'react';
import type { ProductResponseDTO } from '../../application';
import { StockMovementModal } from './StockMovementModal';
import { StockHistoryTable } from './StockHistoryTable';
import { useStockManagement } from '../hooks/useStockManagement';
import { type StockMovement } from '../../domain';

interface ProductCardProps {
  product: ProductResponseDTO;
  onAddToCart?: (product: ProductResponseDTO) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product: initialProduct,
  onAddToCart
}) => {
  const [product, setProduct] = useState(initialProduct);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const { getMovements, loading: loadingHistory } = useStockManagement();

  const isLowStock = product.stock < 10;
  const isCriticalStock = product.stock < 5;
  const isOutOfStock = product.stock === 0;

  const handleToggleHistory = async () => {
    if (!showHistory && movements.length === 0) {
      const data = await getMovements(product.id);
      setMovements(data);
    }
    setShowHistory(!showHistory);
  };

  const handleStockUpdate = (updatedProduct: ProductResponseDTO) => {
    setProduct(updatedProduct);
    if (showHistory) {
      getMovements(product.id).then(setMovements);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 ${isOutOfStock ? 'opacity-75' : ''}`}>
      {/* Imagen */}
      <div className="aspect-square relative overflow-hidden bg-gray-50 group">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Badges de Stock */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {isOutOfStock ? (
            <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase">
              Agotado
            </span>
          ) : isCriticalStock ? (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase animate-pulse">
              Crítico
            </span>
          ) : isLowStock ? (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase">
              Stock Bajo
            </span>
          ) : null}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1" title={product.name}>
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 h-8">
            {product.description || 'Sin descripción detallada disponible.'}
          </p>
        </div>

        <div className="flex items-center justify-between mb-4 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
          <div className="text-left">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Precio</p>
            <p className="text-lg font-black text-blue-600 leading-none">
              {new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: product.price.currency,
              }).format(product.price.amount)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Stock</p>
            <p className={`text-base font-black leading-none ${isOutOfStock ? 'text-gray-400' : isLowStock ? 'text-red-600' : 'text-green-600'}`}>
              {product.stock}
            </p>
          </div>
        </div>

        {/* Actions - Conditional based on screen/mode */}
        {onAddToCart ? (
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:bg-gray-400 disabled:scale-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Agregar al Carrito
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-1 py-2 px-3 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Stock
            </button>
            <button
              onClick={handleToggleHistory}
              className={`flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                showHistory 
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-inner' 
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {showHistory ? 'Cerrar' : 'Historial'}
            </button>
          </div>
        )}

        {/* Collapsible History (Only in Inventory mode) */}
        {!onAddToCart && showHistory && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Últimos Movimientos</h4>
            <StockHistoryTable movements={movements} loading={loadingHistory} />
          </div>
        )}
      </div>

      {/* Modal de Gestión (Only in Inventory mode) */}
      {!onAddToCart && (
        <StockMovementModal
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleStockUpdate}
        />
      )}
    </div>
  );
};
