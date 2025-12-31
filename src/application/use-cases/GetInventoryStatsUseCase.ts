import { type IDashboardRepository, type DashboardStats } from '../../domain';

/**
 * GetInventoryStatsUseCase
 * Recupera las métricas generales del inventario y ventas para el dashboard.
 */
export class GetInventoryStatsUseCase {
  constructor(private readonly dashboardRepository: IDashboardRepository) {}

  async execute(): Promise<DashboardStats> {
    return this.dashboardRepository.getStats();
  }
}
