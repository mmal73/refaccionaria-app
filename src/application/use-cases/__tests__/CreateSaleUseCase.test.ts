import { describe, it, expect , vi, beforeEach } from 'vitest';
import { CreateSaleUseCase, type CreateSaleDTO } from '../CreateSaleUseCase';
import { 
  type ISaleRepository, 
  type IProductRepository, 
  type IStockMovementRepository,
  Product,
  Money
} from '../../../domain';

describe('CreateSaleUseCase', () => {
  let useCase: CreateSaleUseCase;
  let mockSaleRepo: Mock<ISaleRepository>;
  let mockProductRepo: Mock<IProductRepository>;
  let mockMovementRepo: Mock<IStockMovementRepository>;

  beforeEach(() => {
    mockSaleRepo = { save: vi.fn() } as any;
    mockProductRepo = { findById: vi.fn(), save: vi.fn() } as any;
    mockMovementRepo = { save: vi.fn() } as any;

    useCase = new CreateSaleUseCase(mockSaleRepo, mockProductRepo, mockMovementRepo);
    
    // Ensure crypto.randomUUID is available in test environment
    if (typeof global.crypto === 'undefined') {
      (global as any).crypto = { randomUUID: () => 'test-uuid-' + Math.random() };
    }
  });

  it('should successfully create a sale and update stock', async () => {
    const product = Product.create('p1', 'Product 1', Money.create(100, 'MXN'), 10);
    mockProductRepo.findById.mockResolvedValue(product);
    
    const dto: CreateSaleDTO = {
      customerName: 'Test Customer',
      items: [{ productId: 'p1', quantity: 2 }]
    };

    const saleId = await useCase.execute(dto);

    expect(saleId).toBeDefined();
    expect(mockProductRepo.findById).toHaveBeenCalledWith('p1');
    expect(product.stock).toBe(8); // 10 - 2
    expect(mockProductRepo.save).toHaveBeenCalledWith(product);
    expect(mockMovementRepo.save).toHaveBeenCalled();
    expect(mockSaleRepo.save).toHaveBeenCalled();
  });

  it('should throw error if product not found', async () => {
    mockProductRepo.findById.mockResolvedValue(null);
    
    const dto: CreateSaleDTO = {
      items: [{ productId: 'non-existent', quantity: 1 }]
    };

    await expect(useCase.execute(dto)).rejects.toThrow('Producto con ID non-existent no encontrado');
  });

  it('should throw error if insufficient stock', async () => {
    const product = Product.create('p1', 'Product 1', Money.create(100, 'MXN'), 5);
    mockProductRepo.findById.mockResolvedValue(product);
    
    const dto: CreateSaleDTO = {
      items: [{ productId: 'p1', quantity: 10 }]
    };

    await expect(useCase.execute(dto)).rejects.toThrow(/Stock insuficiente/);
  });

  it('should process multiple items in a single sale', async () => {
    const p1 = Product.create('p1', 'Product 1', Money.create(100, 'MXN'), 10);
    const p2 = Product.create('p2', 'Product 2', Money.create(50, 'MXN'), 20);
    
    mockProductRepo.findById.mockImplementation(async (id) => {
      if (id === 'p1') return p1;
      if (id === 'p2') return p2;
      return null;
    });

    const dto: CreateSaleDTO = {
      items: [
        { productId: 'p1', quantity: 2 },
        { productId: 'p2', quantity: 5 }
      ]
    };

    await useCase.execute(dto);

    expect(p1.stock).toBe(8);
    expect(p2.stock).toBe(15);
    expect(mockProductRepo.save).toHaveBeenCalledTimes(2);
    expect(mockMovementRepo.save).toHaveBeenCalledTimes(2);
    expect(mockSaleRepo.save).toHaveBeenCalledTimes(1);
  });
});
