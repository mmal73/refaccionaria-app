/**
 * Domain Layer - Barrel Export
 */

// Entities
export * from './entities/Product';
export * from './entities/StockMovement';
export * from './entities/Sale';
export * from './entities/SaleItem';
export * from './entities/DashboardStats';

// Value Objects
export * from './value-objects/Money';

// Enums
export * from './enums/StockMovementType';

// Repositories (Interfaces)
export * from './repositories/IProductRepository';
export * from './repositories/IStockMovementRepository';
export * from './repositories/ISaleRepository';
export * from './repositories/IDashboardRepository';

// Services (Interfaces)
export * from './services/IImageService';
