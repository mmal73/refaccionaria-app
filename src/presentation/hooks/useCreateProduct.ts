/**
 * useCreateProduct Hook
 * Hook personalizado para crear productos
 * 
 * Este hook pertenece a la capa PRESENTATION y:
 * - Instancia las implementaciones concretas de Infrastructure
 * - Crea el caso de uso con inyección de dependencias
 * - Maneja estados de loading y error
 * - Expone una función simple para crear productos
 */

'use client';

import { useState } from 'react';
import { CreateProductUseCase, type CreateProductDTO } from '../../application';
import { SupabaseProductRepository, CloudinaryImageService } from '../../infrastructure';

/**
 * Estado del hook
 */
interface UseCreateProductState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Datos del formulario para crear producto
 */
export interface CreateProductFormData {
  name: string;
  price: number;
  stock: number;
  description?: string;
  category?: string;
  imageFile?: File | null;
}

/**
 * Hook para crear productos
 * 
 * @returns Objeto con función create y estados
 */
export function useCreateProduct() {
  const [state, setState] = useState<UseCreateProductState>({
    loading: false,
    error: null,
    success: false,
  });

  /**
   * Función para crear un producto
   * 
   * @param formData - Datos del formulario
   * @returns Producto creado o null si hay error
   */
  const create = async (formData: CreateProductFormData) => {
    // Reset state
    setState({
      loading: true,
      error: null,
      success: false,
    });

    try {
      // 1. Instanciar implementaciones concretas (Infrastructure)
      const productRepository = new SupabaseProductRepository();
      const imageService = new CloudinaryImageService();

      // 2. Instanciar caso de uso con inyección de dependencias
      const createProductUseCase = new CreateProductUseCase(
        productRepository,
        imageService
      );

      // 3. Preparar DTO
      const dto: CreateProductDTO = {
        id: crypto.randomUUID(), // Generar ID único
        name: formData.name,
        price: {
          amount: formData.price,
          currency: 'MXN',
        },
        stock: formData.stock,
        description: formData.description,
        category: formData.category,
        imageFile: formData.imageFile || undefined,
      };

      // 4. Ejecutar caso de uso
      const result = await createProductUseCase.execute(dto);

      // 5. Actualizar estado de éxito
      setState({
        loading: false,
        error: null,
        success: true,
      });

      return result;
    } catch (error) {
      // Manejar error
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al crear el producto';

      setState({
        loading: false,
        error: errorMessage,
        success: false,
      });

      return null;
    }
  };

  /**
   * Función para resetear el estado
   */
  const reset = () => {
    setState({
      loading: false,
      error: null,
      success: false,
    });
  };

  return {
    create,
    reset,
    loading: state.loading,
    error: state.error,
    success: state.success,
  };
}
