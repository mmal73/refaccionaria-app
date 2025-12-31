import React from 'react';
import { formatMoney } from '../../../shared/utils/formatters';
import type { CartItem } from '../../hooks/useCart';

interface POSCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const POSCart: React.FC<POSCartProps> = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}) => {
  return (
    <aside className="w-[400px] bg-white border-l shadow-xl flex flex-col shrink-0">
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Carrito de Venta
        </h2>
        <button 
          onClick={onClearCart}
          className="text-[10px] font-black text-red-400 hover:text-red-500 uppercase tracking-widest"
          disabled={items.length === 0}
        >
          Vaciar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <div className="bg-gray-100 p-8 rounded-full mb-4">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">El carrito está vacío</p>
            <p className="text-xs text-gray-400 mt-1">Selecciona productos del catálogo</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:border-blue-100 transition-colors group">
              <div className="w-12 h-12 bg-gray-50 rounded-lg shrink-0 overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                <p className="text-[10px] text-gray-400 mb-2">{formatMoney(item.price.amount, item.price.currency)} / unidad</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.cartQuantity - 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm text-gray-500 transition-all font-bold"
                    >
                      -
                    </button>
                    <span className="text-xs font-black min-w-[20px] text-center">{item.cartQuantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.cartQuantity + 1)}
                      disabled={item.cartQuantity >= item.stock}
                      className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm text-gray-500 transition-all font-bold disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs font-black text-gray-900">{formatMoney(item.price.amount * item.cartQuantity, item.price.currency)}</p>
                  </div>

                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 text-red-300 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
