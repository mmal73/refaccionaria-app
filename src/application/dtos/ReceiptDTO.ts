/**
 * ReceiptDTO
 * Objeto de transferencia de datos para el recibo de venta.
 * Se utiliza para desacoplar la UI de la estructura de las entidades.
 */
export interface ReceiptDTO {
  saleId: string;
  date: Date;
  customerName?: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  total: number;
  currency: string;
}
