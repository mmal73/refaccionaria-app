/**
 * Application Use Cases - Barrel Export
 */

export { CreateProductUseCase } from './CreateProductUseCase';
export { GetProductByIdUseCase } from './GetProductByIdUseCase';
export { UpdateStockUseCase } from './UpdateStockUseCase';
export { GetLowStockProductsUseCase } from './GetLowStockProductsUseCase';
export { GetAllProductsUseCase } from './GetAllProductsUseCase';
export { SearchProductsUseCase } from './SearchProductsUseCase';
export { GetStockMovementsUseCase } from './GetStockMovementsUseCase';
export { CreateSaleUseCase } from './CreateSaleUseCase';
export { GetInventoryStatsUseCase } from './GetInventoryStatsUseCase';

export type { UpdateStockDTO } from './UpdateStockUseCase';
export type { CreateSaleDTO, CreateSaleItemDTO } from './CreateSaleUseCase';
