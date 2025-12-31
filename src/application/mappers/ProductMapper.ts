import { Product, Money } from '../../domain';
import type { ProductResponseDTO } from '../dtos';

/**
 * ProductMapper
 * Convierte entre entidades del Dominio y DTOs de la Aplicación
 * 
 * Responsabilidades:
 * - Transformar Product entities a ProductResponseDTO
 * - Transformar datos de persistencia a Product entities
 */
export class ProductMapper {
  /**
   * Convierte una entidad Product a ProductResponseDTO
   * @param product - Entidad del dominio
   * @returns DTO para la capa de presentación
   */
  static toDTO(product: Product): ProductResponseDTO {
    return {
      id: product.id,
      name: product.name,
      price: product.price.toJSON(),
      stock: product.stock,
      description: product.description,
      category: product.category,
      imageUrl: product.imageUrl,
      isOutOfStock: product.isOutOfStock(),
      hasLowStock: product.hasLowStock(),
      inventoryValue: product.calculateInventoryValue().toJSON(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  /**
   * Convierte un array de entidades Product a array de DTOs
   * @param products - Array de entidades del dominio
   * @returns Array de DTOs
   */
  static toDTOList(products: Product[]): ProductResponseDTO[] {
    return products.map((product) => this.toDTO(product));
  }

  /**
   * Convierte datos de persistencia a entidad Product
   * @param data - Datos desde la base de datos
   * @returns Entidad del dominio
   */
  static toDomain(data: {
    id: string;
    name: string;
    price: { amount: number; currency: string };
    stock: number;
    description?: string;
    category?: string;
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    return Product.fromPersistence(data);
  }

  /**
   * Convierte una entidad Product a formato de persistencia
   * @param product - Entidad del dominio
   * @returns Objeto plano para persistencia
   */
  static toPersistence(product: Product): {
    id: string;
    name: string;
    price: { amount: number; currency: string };
    stock: number;
    description?: string;
    category?: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return product.toPersistence();
  }
}
