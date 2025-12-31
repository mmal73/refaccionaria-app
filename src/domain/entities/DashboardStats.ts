import { Sale } from './Sale';

export interface TopSellingProduct {
  name: string;
  totalSold: number;
}

/**
 * DashboardStats
 * Representa las métricas consolidadas para la vista principal
 */
export interface DashboardStats {
  totalInventoryValue: number;
  lowStockCount: number;
  totalProducts: number;
  recentSales: Sale[];
  topSellingProducts: TopSellingProduct[];
  lowStockProducts: { id: string; name: string; stock: number; category?: string }[];
}
