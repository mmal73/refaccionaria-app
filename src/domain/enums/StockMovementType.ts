/**
 * StockMovementType Enum
 * Define los tipos de movimientos de inventario posibles
 */
export enum StockMovementType {
  IN = 'IN',               // Entrada por compra o devolución
  OUT = 'OUT',             // Salida por venta o merma
  ADJUSTMENT = 'ADJUSTMENT' // Ajuste manual (inventario físico)
}
