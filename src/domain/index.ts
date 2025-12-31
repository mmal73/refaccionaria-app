/**
 * Domain Layer - Barrel Export
 * Exporta todas las entidades, value objects y repositorios del dominio
 */

// Entities
export { Product } from './entities/Product';

// Value Objects
export { Money } from './value-objects/Money';

// Repository Interfaces
export type { IProductRepository } from './repositories/IProductRepository';

// Service Interfaces
export type { IImageService, UploadImageOptions, UploadImageResult } from './services';
