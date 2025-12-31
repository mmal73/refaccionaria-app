'use client';

import { useState, useCallback } from 'react';
import { 
  UpdateStockUseCase, 
  GetStockMovementsUseCase, 
  GetLowStockProductsUseCase,
  type UpdateStockDTO,
  type ProductResponseDTO
} from '../../application';
import { SupabaseProductRepository } from '../../infrastructure/persistence/repositories/SupabaseProductRepository';
import { SupabaseStockMovementRepository } from '../../infrastructure/persistence/repositories/SupabaseStockMovementRepository';
import { type StockMovement } from '../../domain';

/**
 * useStockManagement Hook
 * Encapsula la lógica de gestión de stock para la capa de presentación
 */
export function useStockManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Registra un movimiento de stock
   */
  const updateStock = useCallback(async (dto: UpdateStockDTO): Promise<ProductResponseDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const productRepo = new SupabaseProductRepository();
      const movementRepo = new SupabaseStockMovementRepository();
      const useCase = new UpdateStockUseCase(productRepo, movementRepo);
      
      const result = await useCase.execute(dto);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar el stock';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene el historial de movimientos de un producto
   */
  const getMovements = useCallback(async (productId: string): Promise<StockMovement[]> => {
    setLoading(true);
    setError(null);
    try {
      const movementRepo = new SupabaseStockMovementRepository();
      const useCase = new GetStockMovementsUseCase(movementRepo);
      
      const result = await useCase.execute(productId);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener movimientos';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene productos con stock bajo
   */
  const getLowStock = useCallback(async (threshold: number = 5): Promise<ProductResponseDTO[]> => {
    setLoading(true);
    setError(null);
    try {
      const productRepo = new SupabaseProductRepository();
      const useCase = new GetLowStockProductsUseCase(productRepo);
      
      const result = await useCase.execute(threshold);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener productos con stock bajo';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateStock,
    getMovements,
    getLowStock,
    loading,
    error,
    setError
  };
}
