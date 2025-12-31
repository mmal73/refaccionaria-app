import React from 'react';
import Link from 'next/link';
import { formatStock } from '../../../shared/utils/formatters';

interface LowStockItem {
  id: string;
  name: string;
  stock: number;
  category?: string;
}

interface LowStockTableProps {
  items: LowStockItem[];
  isLoading?: boolean;
}

export const LowStockTable: React.FC<LowStockTableProps> = ({ items, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
        <div className="w-48 h-6 bg-gray-200 rounded mb-6" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50">
              <div className="w-40 h-4 bg-gray-200 rounded" />
              <div className="w-16 h-8 bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Alertas de Stock</h3>
          <p className="text-xs text-gray-400 font-medium">Productos con existencias críticas</p>
        </div>
        <span className="bg-red-50 text-red-600 text-[10px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-wider ring-1 ring-red-100">
          {items.length} Alertas
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center opacity-30">
                    <svg className="w-12 h-12 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm font-bold text-gray-500">Todo en orden</p>
                    <p className="text-xs">No hay stock crítico actualmente</p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{item.category || 'General'}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                      item.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {formatStock(item.stock)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href="/products" 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-black rounded-lg hover:bg-gray-800 transition-all shadow-sm active:scale-95"
                    >
                      ABASTECER
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center">
        <Link href="/products" className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">
          Ver Inventario Completo
        </Link>
      </div>
    </div>
  );
};
