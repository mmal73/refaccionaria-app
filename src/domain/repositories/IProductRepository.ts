import { Product } from '../entities/Product';

/**
 * IProductRepository Interface
 * Define el contrato para la persistencia de productos
 * 
 * Esta es una interfaz del DOMAIN que será implementada por INFRASTRUCTURE
 * Siguiendo el principio de Inversión de Dependencias (DIP)
 */
export interface IProductRepository {
  /**
   * Guarda un producto (crear o actualizar)
   * @param product - Producto a guardar
   * @throws Error si falla la operación
   */
  save(product: Product): Promise<void>;

  /**
   * Busca un producto por su ID
   * @param id - ID del producto
   * @returns Product si existe, null si no se encuentra
   * @throws Error si falla la operación
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Busca todos los productos
   * @returns Array de productos
   * @throws Error si falla la operación
   */
  findAll(): Promise<Product[]>;

  /**
   * Busca productos por categoría
   * @param category - Categoría a buscar
   * @returns Array de productos de esa categoría
   * @throws Error si falla la operación
   */
  findByCategory(category: string): Promise<Product[]>;

  /**
   * Busca productos con stock bajo
   * @param threshold - Umbral de stock (por defecto 10)
   * @returns Array de productos con stock bajo
   * @throws Error si falla la operación
   */
  findLowStock(threshold: number): Promise<Product[]>;

  /**
   * Busca productos agotados (stock = 0)
   * @returns Array de productos agotados
   * @throws Error si falla la operación
   */
  findOutOfStock(): Promise<Product[]>;

  /**
   * Busca productos por nombre o descripción (búsqueda parcial general)
   * @param query - Término de búsqueda
   * @returns Array de productos que coinciden
   * @throws Error si falla la operación
   */
  search(query: string): Promise<Product[]>;

  /**
   * Busca productos por nombre (búsqueda parcial específica por nombre)
   * @param name - Nombre o parte del nombre a buscar
   * @returns Array de productos que coinciden
   * @throws Error si falla la operación
   */
  searchByName(name: string): Promise<Product[]>;

  /**
   * Elimina un producto por su ID
   * @param id - ID del producto a eliminar
   * @returns true si se eliminó, false si no existía
   * @throws Error si falla la operación
   */
  delete(id: string): Promise<boolean>;

  /**
   * Verifica si existe un producto con el ID dado
   * @param id - ID del producto
   * @returns true si existe, false si no
   * @throws Error si falla la operación
   */
  exists(id: string): Promise<boolean>;
}
