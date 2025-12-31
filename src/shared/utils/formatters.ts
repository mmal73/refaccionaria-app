import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea un monto numérico a moneda (MXN por defecto)
 */
export const formatMoney = (amount: number | undefined | null, currency: string = 'MXN'): string => {
  if (amount === undefined || amount === null) return '$0.00';
  
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Formatea una fecha de forma legible
 */
export const formatDate = (date: string | Date | undefined | null, pattern: string = "dd/MM/yyyy"): string => {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, pattern, { locale: es });
};

/**
 * Formatea el stock con indicadores visuales de texto si es necesario
 */
export const formatStock = (stock: number | undefined | null): string => {
  if (stock === undefined || stock === null) return '0';
  if (stock === 0) return 'AGOTADO';
  return stock.toString();
};
