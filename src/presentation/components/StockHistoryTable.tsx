'use client';

import React from 'react';
import { type StockMovement, StockMovementType } from '../../domain';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface StockHistoryTableProps {
  movements: StockMovement[];
  loading?: boolean;
}

export const StockHistoryTable: React.FC<StockHistoryTableProps> = ({ movements, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (movements.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-400 text-sm italic">Sin historial de movimientos</p>
      </div>
    );
  }

  const getTypeStyle = (type: StockMovementType) => {
    switch (type) {
      case StockMovementType.IN:
        return 'text-green-600 bg-green-50';
      case StockMovementType.OUT:
        return 'text-red-600 bg-red-50';
      case StockMovementType.ADJUSTMENT:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeLabel = (type: StockMovementType) => {
    switch (type) {
      case StockMovementType.IN: return 'Entrada';
      case StockMovementType.OUT: return 'Salida';
      case StockMovementType.ADJUSTMENT: return 'Ajuste';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
            <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Cant</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Razón</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {movements.map((m) => (
            <tr key={m.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {format(m.date, "d MMM, HH:mm", { locale: es })}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getTypeStyle(m.type)}`}>
                  {getTypeLabel(m.type)}
                </span>
              </td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm font-bold text-right ${m.type === StockMovementType.IN ? 'text-green-600' : 'text-red-600'}`}>
                {m.type === StockMovementType.IN ? '+' : '-'}{m.quantity}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-[150px]" title={m.reason}>
                {m.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
