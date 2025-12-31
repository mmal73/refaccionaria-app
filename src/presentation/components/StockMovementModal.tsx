'use client';

import React, { useState } from 'react';
import { StockMovementType } from '../../domain';
import { useStockManagement } from '../hooks/useStockManagement';
import { type ProductResponseDTO } from '../../application';

interface StockMovementModalProps {
  product: ProductResponseDTO;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProduct: ProductResponseDTO) => void;
}

export const StockMovementModal: React.FC<StockMovementModalProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [type, setType] = useState<StockMovementType>(StockMovementType.IN);
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  
  const { updateStock, loading, error, setError } = useStockManagement();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (quantity <= 0) {
      setError('La cantidad debe ser mayor a cero');
      return;
    }

    if (!reason.trim()) {
      setError('La razón del movimiento es obligatoria');
      return;
    }

    const result = await updateStock({
      productId: product.id,
      quantity,
      type,
      reason,
    });

    if (result) {
      onSuccess(result);
      onClose();
      // Reset form
      setQuantity(0);
      setReason('');
      setType(StockMovementType.IN);
    }
  };

  const getStyleByType = (t: StockMovementType) => {
    switch (t) {
      case StockMovementType.IN:
        return 'bg-green-100 text-green-700 border-green-200';
      case StockMovementType.OUT:
        return 'bg-red-100 text-red-700 border-red-200';
      case StockMovementType.ADJUSTMENT:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gestionar Stock</h2>
            <p className="text-sm text-gray-500">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tipo de Movimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Movimiento
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(StockMovementType) as Array<keyof typeof StockMovementType>).map((key) => {
                const value = StockMovementType[key];
                const active = type === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setType(value)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      active 
                        ? `${getStyleByType(value)} ring-2 ring-offset-1` 
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {value === StockMovementType.IN ? 'ENTRADA' : value === StockMovementType.OUT ? 'SALIDA' : 'AJUSTE'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cantidad */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>

          {/* Razón */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Razón / Comentario
            </label>
            <textarea
              id="reason"
              rows={3}
              placeholder="Ej: Compra a proveedor, Ajuste inventario anual..."
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2 text-sm font-bold text-white rounded-lg transition-all shadow-md ${
                type === StockMovementType.IN 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : type === StockMovementType.OUT 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-700 hover:bg-gray-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : 'Guardar Movimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
