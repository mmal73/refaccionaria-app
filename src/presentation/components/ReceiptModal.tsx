import React from 'react';
import { formatDate, formatMoney } from '../../shared/utils/formatters';
import type { ReceiptDTO } from '../../application';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReceiptDTO | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Not Printed */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800">Recibo de Venta</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Receipt Content - Printed */}
        <div id="receipt-content" className="p-8 overflow-y-auto bg-white font-mono text-sm text-black flex-1">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold uppercase tracking-tight">REFACCIONARIA APP</h2>
            <p className="text-xs mt-1">Av. Central #123, Col. Centro</p>
            <p className="text-xs">Tel: (55) 1234-5678</p>
          </div>

          <div className="border-t border-dashed border-black pt-4 mb-4">
            <div className="flex justify-between">
              <span>Fecha:</span>
              <span>{formatDate(data.date, "dd/MM/yyyy HH:mm")}</span>
            </div>
            <div className="flex justify-between">
              <span>Folio:</span>
              <span className="font-bold">#{data.saleId.substring(0, 8).toUpperCase()}</span>
            </div>
            {data.customerName && (
              <div className="flex justify-between">
                <span>Cliente:</span>
                <span className="truncate ml-4">{data.customerName}</span>
              </div>
            )}
          </div>

          <div className="border-t border-dashed border-black pt-4 mb-4">
            <div className="grid grid-cols-12 font-bold mb-2">
              <span className="col-span-2">CANT</span>
              <span className="col-span-6">DESCRIPCIÓN</span>
              <span className="col-span-4 text-right">IMPORTE</span>
            </div>
            
            {data.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 mb-1 text-xs">
                <span className="col-span-2">{item.quantity}</span>
                <span className="col-span-6 truncate pr-2">{item.productName}</span>
                <span className="col-span-4 text-right">
                  {formatMoney(item.subtotal, data.currency)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-black pt-4 mb-6">
            <div className="flex justify-between text-lg font-bold">
              <span>TOTAL:</span>
              <span>
                {formatMoney(data.total, data.currency)}
              </span>
            </div>
          </div>

          <div className="text-center italic text-xs space-y-1">
            <p>¡Gracias por su compra!</p>
            <p>Este no es un comprobante fiscal</p>
          </div>
        </div>

        {/* Footer Actions - Not Printed */}
        <div className="p-4 bg-gray-50 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir
          </button>
        </div>
      </div>

      {/* Tailwind Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-content, #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            padding: 0;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};
