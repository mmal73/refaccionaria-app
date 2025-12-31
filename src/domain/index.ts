/**
 * Domain Layer - Barrel Export
 */

// Entities
export * from './entities/Product';
export * from './entities/StockMovement';

// Value Objects
export * from './value-objects/Money';

// Enums
export * from './enums/StockMovementType';

// Repositories (Interfaces)
export * from './repositories/IProductRepository';
export * from './repositories/IStockMovementRepository';

// Services (Interfaces)
export * from './services/IImageService';
