'use client';

import { useState, useEffect, useCallback } from 'react';
import { GetInventoryStatsUseCase } from '../../application';
import { type DashboardStats } from '../../domain';
import { SupabaseDashboardRepository } from '../../infrastructure/persistence/repositories/SupabaseDashboardRepository';

/**
 * useDashboardStats Hook
 * Encapsula la lógica de carga y refresco de las métricas del dashboard
 */
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const repo = new SupabaseDashboardRepository();
      const useCase = new GetInventoryStatsUseCase(repo);
      const data = await useCase.execute();
      setStats(data);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar estadísticas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    isLoading,
    error,
    refresh: loadStats
  };
}
