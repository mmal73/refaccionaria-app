import { DashboardStats } from '../entities/DashboardStats';

/**
 * IDashboardRepository
 * Interfaz para la recuperación de métricas de negocio
 */
export interface IDashboardRepository {
  /**
   * Obtiene las estadísticas consolidadas del sistema
   */
  getStats(): Promise<DashboardStats>;
}
