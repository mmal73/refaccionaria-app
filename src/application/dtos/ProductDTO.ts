/**
 * CreateProductDTO
 * Data Transfer Object para la creación de productos
 * 
 * Este DTO representa los datos de entrada para crear un producto.
 * Viene desde la capa de Presentación y será transformado a entidades del Dominio.
 */
export interface CreateProductDTO {
  /**
   * ID único del producto
   */
  id: string;

  /**
   * Nombre del producto
   * Debe tener al menos 3 caracteres
   */
  name: string;

  /**
   * Precio del producto
   */
  price: {
    amount: number;
    currency: string;
  };

  /**
   * Cantidad en stock
   * Debe ser mayor o igual a 0
   */
  stock: number;

  /**
   * Descripción del producto (opcional)
   */
  description?: string;

  /**
   * Categoría del producto (opcional)
   */
  category?: string;

  /**
   * Archivo de imagen del producto (opcional)
   * Se subirá al servicio de imágenes antes de crear el producto
   */
  imageFile?: File;
}

/**
 * ProductResponseDTO
 * Data Transfer Object para la respuesta de productos
 * 
 * Este DTO representa los datos de salida que se envían a la capa de Presentación.
 */
export interface ProductResponseDTO {
  id: string;
  name: string;
  price: {
    amount: number;
    currency: string;
  };
  stock: number;
  description?: string;
  category?: string;
  imageUrl?: string;
  isOutOfStock: boolean;
  hasLowStock: boolean;
  inventoryValue: {
    amount: number;
    currency: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * UpdateProductDTO
 * Data Transfer Object para actualizar productos
 */
export interface UpdateProductDTO {
  id: string;
  name?: string;
  price?: {
    amount: number;
    currency: string;
  };
  stock?: number;
  description?: string;
  category?: string;
}

/**
 * UpdateStockDTO
 * Data Transfer Object para actualizar el stock de un producto
 */
export interface UpdateStockDTO {
  productId: string;
  quantity: number;
  operation: 'increase' | 'decrease';
}
