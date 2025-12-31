import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { GetInventoryStatsUseCase } from '../GetInventoryStatsUseCase';
import type { IDashboardRepository, DashboardStats } from '../../../domain';

describe('GetInventoryStatsUseCase', () => {
  let useCase: GetInventoryStatsUseCase;
  let mockDashboardRepo: jest.Mocked<IDashboardRepository>;

  beforeEach(() => {
    mockDashboardRepo = { getStats: jest.fn() } as any;
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
