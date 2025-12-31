import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { CreateProductUseCase } from '../CreateProductUseCase';
import type { IProductRepository, IImageService, UploadImageResult } from '../../../domain';
import type { CreateProductDTO } from '../../dtos';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let mockProductRepository: jest.Mocked<IProductRepository>;
  let mockImageService: jest.Mocked<IImageService>;

  beforeEach(() => {
    // Create mock implementations
    mockProductRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByCategory: jest.fn(),
      findLowStock: jest.fn(),
      findOutOfStock: jest.fn(),
      searchByName: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    } as any;

    mockImageService = {
      upload: jest.fn(),
      delete: jest.fn(),
      getUrl: jest.fn(),
    } as any;

    useCase = new CreateProductUseCase(mockProductRepository, mockImageService);
  });

  describe('Successfully creates a product', () => {
    it('should create a product without an image', async () => {
      const dto: CreateProductDTO = {
        id: 'prod-1',
        name: 'Test Product',
        price: {
          amount: 100,
          currency: 'MXN',
        },
        stock: 50,
        description: 'A test product',
        category: 'Electronics',
      };

      mockProductRepository.exists.mockResolvedValue(false);
      mockProductRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute(dto);

      expect(mockProductRepository.exists).toHaveBeenCalledWith('prod-1');
      expect(mockProductRepository.save).toHaveBeenCalled();
      expect(mockImageService.upload).not.toHaveBeenCalled();
      expect(result.id).toBe('prod-1');
      expect(result.name).toBe('Test Product');
      expect(result.price.amount).toBe(100);
      expect(result.stock).toBe(50);
    });

    it('should create a product with an image', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const dto: CreateProductDTO = {
        id: 'prod-2',
        name: 'Product with Image',
        price: {
          amount: 200,
          currency: 'MXN',
        },
        stock: 30,
        imageFile: mockFile,
      };

      const mockUploadResult: UploadImageResult = {
        url: 'http://example.com/image.jpg',
        secureUrl: 'https://example.com/image.jpg',
        publicId: 'product-prod-2',
        width: 800,
        height: 600,
        format: 'jpg',
        bytes: 12345,
      };

      mockProductRepository.exists.mockResolvedValue(false);
      mockImageService.upload.mockResolvedValue(mockUploadResult);
      mockProductRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute(dto);

      expect(mockImageService.upload).toHaveBeenCalledWith(mockFile, {
        folder: 'products',
        publicId: 'product-prod-2',
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 'auto',
      });
      expect(result.imageUrl).toBe('https://example.com/image.jpg');
    });

    it('should create a product with minimum required fields', async () => {
      const dto: CreateProductDTO = {
        id: 'prod-3',
        name: 'Min',
        price: {
          amount: 1,
          currency: 'MXN',
        },
        stock: 0,
      };

      mockProductRepository.exists.mockResolvedValue(false);
      mockProductRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute(dto);

      expect(result.id).toBe('prod-3');
      expect(result.name).toBe('Min');
      expect(result.stock).toBe(0);
      expect(result.isOutOfStock).toBe(true);
    });

    it('should return proper calculated fields', async () => {
      const dto: CreateProductDTO = {
        id: 'prod-4',
        name: 'Calculated Fields Product',
        price: {
          amount: 50,
          currency: 'MXN',
        },
        stock: 10,
      };

      mockProductRepository.exists.mockResolvedValue(false);
      mockProductRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute(dto);

      expect(result.inventoryValue.amount).toBe(500); // 50 * 10
      expect(result.hasLowStock).toBe(false); // stock == 10 is not low stock
      expect(result.isOutOfStock).toBe(false);
    });
  });

  describe('Handles duplicate product ID', () => {
    it('should throw error when product already exists', async () => {
      const dto: CreateProductDTO = {
        id: 'existing-prod',
        name: 'Duplicate Product',
        price: {
          amount: 100,
          currency: 'MXN',
        },
        stock: 10,
      };

      mockProductRepository.exists.mockResolvedValue(true);

      await expect(useCase.execute(dto)).rejects.toThrow(
        'Ya existe un producto con el ID: existing-prod'
      );

      expect(mockProductRepository.exists).toHaveBeenCalledWith('existing-prod');
      expect(mockProductRepository.save).not.toHaveBeenCalled();
      expect(mockImageService.upload).not.toHaveBeenCalled();
    });

    it('should check existence before uploading image', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const dto: CreateProductDTO = {
        id: 'existing-prod-2',
        name: 'Product',
        price: {
          amount: 100,
          currency: 'MXN',
        },
        stock: 10,
        imageFile: mockFile,
      };

      mockProductRepository.exists.mockResolvedValue(true);

      await expect(useCase.execute(dto)).rejects.toThrow(
        'Ya existe un producto con el ID: existing-prod-2'
      );

      // Image should not be uploaded if product already exists
      expect(mockImageService.upload).not.toHaveBeenCalled();
    });
  });

  describe('Handles image upload errors', () => {
    it('should throw error when image upload fails', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const dto: CreateProductDTO = {
        id: 'prod-5',
        name: 'Product',
        price: {
          amount: 100,
          currency: 'MXN',
        },
        stock: 10,
        imageFile: mockFile,
      };

      mockProductRepository.exists.mockResolvedValue(false);
      mockImageService.upload.mockRejectedValue(new Error('Upload failed'));

      await expect(useCase.execute(dto)).rejects.toThrow('Error al subir la imagen: Upload failed');

      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });

    it('should handle unknown upload errors', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const dto: CreateProductDTO = {
        id: 'prod-6',
        name: 'Product',
        price: {
          amount: 100,
          currency: 'MXN',
        },
        stock: 10,
        imageFile: mockFile,
      };

      mockProductRepository.exists.mockResolvedValue(false);
      mockImageService.upload.mockRejectedValue('Unknown error');

      await expect(useCase.execute(dto)).rejects.toThrow('Error al subir la imagen: Unknown error');
    });
  });

  describe('Validates domain rules', () => {
    it('should throw error for invalid product name (too short)', async () => {
      const dto: CreateProductDTO = {
        id: 'prod-7',
        name: 'AB', // Less than 3 characters
        price: {
          amount: 100,
          currency: 'MXN',
        },
        stock: 10,
      };

      mockProductRepository.exists.mockResolvedValue(false);

      await expect(useCase.execute(dto)).rejects.toThrow(
        'El nombre del producto debe tener al menos 3 caracteres'
      );

      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error for invalid price (zero)', async () => {
      const dto: CreateProductDTO = {
        id: 'prod-8',
        name: 'Product',
        price: {
          amount: 0,
          currency: 'MXN',
        },
        stock: 10,
      };

      mockProductRepository.exists.mockResolvedValue(false);

      await expect(useCase.execute(dto)).rejects.toThrow('El precio debe ser mayor a 0');

      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error for invalid stock (negative)', async () => {
      const dto: CreateProductDTO = {
        id: 'prod-9',
        name: 'Product',
        price: {
          amount: 100,
          currency: 'MXN',
        },
        stock: -5,
      };

      mockProductRepository.exists.mockResolvedValue(false);

      await expect(useCase.execute(dto)).rejects.toThrow('El stock no puede ser negativo');

      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error for negative price amount', async () => {
      const dto: CreateProductDTO = {
        id: 'prod-10',
        name: 'Product',
        price: {
          amount: -100,
          currency: 'MXN',
        },
        stock: 10,
      };

      mockProductRepository.exists.mockResolvedValue(false);

      await expect(useCase.execute(dto)).rejects.toThrow('El monto no puede ser negativo');

      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error for empty currency', async () => {
      const dto: CreateProductDTO = {
        id: 'prod-11',
        name: 'Product',
        price: {
          amount: 100,
          currency: '',
        },
        stock: 10,
      };

      mockProductRepository.exists.mockResolvedValue(false);

      await expect(useCase.execute(dto)).rejects.toThrow('La moneda debe estar definida');

      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle very large stock values', async () => {
      const dto: CreateProductDTO = {
        id: 'prod-12',
        name: 'Large Stock Product',
        price: {
          amount: 10,
          currency: 'MXN',
        },
        stock: 1000000,
      };

      mockProductRepository.exists.mockResolvedValue(false);
      mockProductRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute(dto);

      expect(result.stock).toBe(1000000);
      expect(result.inventoryValue.amount).toBe(10000000);
    });

    it('should handle different currencies', async () => {
      const dto: CreateProductDTO = {
        id: 'prod-13',
        name: 'USD Product',
        price: {
          amount: 50,
          currency: 'USD',
        },
        stock: 5,
      };

      mockProductRepository.exists.mockResolvedValue(false);
      mockProductRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute(dto);

      expect(result.price.currency).toBe('USD');
      expect(result.inventoryValue.currency).toBe('USD');
    });

    it('should trim whitespace from product data', async () => {
      const dto: CreateProductDTO = {
        id: ' prod-14 ',
        name: '  Product Name  ',
        price: {
          amount: 100,
          currency: 'MXN',
        },
        stock: 10,
        description: '  Description  ',
        category: '  Category  ',
      };

      mockProductRepository.exists.mockResolvedValue(false);
      mockProductRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute(dto);

      expect(result.id).toBe('prod-14');
      expect(result.name).toBe('Product Name');
      expect(result.description).toBe('Description');
      expect(result.category).toBe('Category');
    });
  });
});
