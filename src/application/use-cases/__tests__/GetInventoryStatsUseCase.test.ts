import { describe, it, expect , vi, beforeEach } from 'vitest';
import { GetInventoryStatsUseCase } from '../GetInventoryStatsUseCase';
import type { IDashboardRepository, DashboardStats } from '../../../domain';

describe('GetInventoryStatsUseCase', () => {
  let useCase: GetInventoryStatsUseCase;
  let mockDashboardRepo: Mock<IDashboardRepository>;

  beforeEach(() => {
    mockDashboardRepo = { getStats: vi.fn() } as any;
    useCase = new GetInventoryStatsUseCase(mockDashboardRepo);
  });

  it('should return stats from repository', async () => {
    const mockStats: DashboardStats = {
      totalProducts: 100,
      totalInventoryValue: 50000,
      lowStockCount: 5,
      recentSales: [],
      topSellingProducts: [],
      lowStockProducts: []
    };

    mockDashboardRepo.getStats.mockResolvedValue(mockStats);

    const result = await useCase.execute();

    expect(result).toEqual(mockStats);
    expect(mockDashboardRepo.getStats).toHaveBeenCalled();
  });
});
