import React from 'react';
import { formatMoney } from '../../../shared/utils/formatters';

interface POSPaymentPanelProps {
  customerName: string;
  onCustomerNameChange: (value: string) => void;
  itemCount: number;
  total: number;
  isValidSale: boolean;
  isProcessing: boolean;
  onCompleteSale: () => void;
  saleError: string | null;
}

export const POSPaymentPanel: React.FC<POSPaymentPanelProps> = ({
  customerName,
  onCustomerNameChange,
  itemCount,
  total,
  isValidSale,
  isProcessing,
  onCompleteSale,
  saleError
}) => {
  return (
    <div className="p-6 bg-gray-50 border-t space-y-4">
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Cliente</label>
        <input
          type="text"
          placeholder="Público General"
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm outline-none"
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-xs font-medium text-gray-500 px-1">
          <span>Artículos:</span>
          <span>{itemCount}</span>
        </div>
        
        <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl shadow-blue-900/10">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Total</span>
            <span className="text-3xl font-black">{formatMoney(total)}</span>
          </div>
          
          <button
            onClick={onCompleteSale}
            disabled={isProcessing || !isValidSale}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isProcessing || !isValidSale
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                PROCESANDO...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                COBRAR VENTA
              </>
            )}
          </button>
        </div>
      </div>

      {saleError && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-xs font-bold animate-shake">
          {saleError}
        </div>
      )}
    </div>
  );
};
