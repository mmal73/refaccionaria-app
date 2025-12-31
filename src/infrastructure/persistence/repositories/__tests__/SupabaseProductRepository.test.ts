import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { SupabaseProductRepository } from '../SupabaseProductRepository';
import { Product, Money } from '../../../../domain';
import type { SupabaseClient } from '@supabase/supabase-js';

// Mock the Supabase client module
jest.mock('../../supabase/client', () => ({
  getSupabaseClient: jest.fn(),
}));

describe('SupabaseProductRepository', () => {
  let repository: SupabaseProductRepository;
  let mockSupabase: any;

  beforeEach(() => {
    // Create mock Supabase client
    mockSupabase = {
      from: jest.fn(),
    };

    // Mock the getSupabaseClient to return our mock
    const { getSupabaseClient } = require('../../supabase/client');
    (getSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

    repository = new SupabaseProductRepository();
  });

  describe('save', () => {
    it('should successfully save a new product', async () => {
      const price = Money.create(100, 'MXN');
      const product = Product.create(
        'prod-1',
        'Test Product',
        price,
        50,
        'Description',
        'Category',
        'https://example.com/image.jpg'
      );

      const mockUpsert = jest.fn().mockResolvedValue({ error: null });
      mockSupabase.from.mockReturnValue({
        upsert: mockUpsert,
      });

      await repository.save(product);

      expect(mockSupabase.from).toHaveBeenCalledWith('products');
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'prod-1',
          name: 'Test Product',
          price_amount: 100,
          price_currency: 'MXN',
          stock: 50,
          description: 'Description',
          category: 'Category',
          image_url: 'https://example.com/image.jpg',
        }),
        { onConflict: 'id' }
      );
    });

    it('should throw error when save fails', async () => {
      const price = Money.create(100, 'MXN');
      const product = Product.create('prod-2', 'Product', price, 10);

      const mockUpsert = jest.fn().mockResolvedValue({
        error: { message: 'Database error' },
      });
      mockSupabase.from.mockReturnValue({
        upsert: mockUpsert,
      });

      await expect(repository.save(product)).rejects.toThrow(
        'Error al guardar producto: Database error'
      );
    });

    it('should save product with null optional fields', async () => {
      const price = Money.create(50, 'MXN');
      const product = Product.create('prod-3', 'Minimal Product', price, 5);

      const mockUpsert = jest.fn().mockResolvedValue({ error: null });
      mockSupabase.from.mockReturnValue({
        upsert: mockUpsert,
      });

      await repository.save(product);

      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'prod-3',
          description: null,
          category: null,
          image_url: null,
        }),
        { onConflict: 'id' }
      );
    });
  });

  describe('findById', () => {
    it('should successfully retrieve a product by ID', async () => {
      const mockData = {
        id: 'prod-1',
        name: 'Test Product',
        price_amount: 100,
        price_currency: 'MXN',
        stock: 50,
        description: 'Description',
        category: 'Electronics',
        image_url: 'https://example.com/image.jpg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: mockData,
        error: null,
      });
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: mockMaybeSingle,
          }),
        }),
      });

      const product = await repository.findById('prod-1');

      expect(product).not.toBeNull();
      expect(product?.id).toBe('prod-1');
      expect(product?.name).toBe('Test Product');
      expect(product?.price.amount).toBe(100);
      expect(product?.price.currency).toBe('MXN');
      expect(product?.stock).toBe(50);
    });

    it('should return null when product is not found', async () => {
      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: mockMaybeSingle,
          }),
        }),
      });

      const product = await repository.findById('non-existent');

      expect(product).toBeNull();
    });

    it('should throw error when query fails', async () => {
      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Query error' },
      });
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: mockMaybeSingle,
          }),
        }),
      });

      await expect(repository.findById('prod-1')).rejects.toThrow(
        'Error al buscar producto: Query error'
      );
    });

    it('should reconstruct product with optional fields as undefined', async () => {
      const mockData = {
        id: 'prod-2',
        name: 'Minimal Product',
        price_amount: 50,
        price_currency: 'MXN',
        stock: 10,
        description: null,
        category: null,
        image_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: mockData,
        error: null,
      });
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: mockMaybeSingle,
          }),
        }),
      });

      const product = await repository.findById('prod-2');

      expect(product?.description).toBeUndefined();
      expect(product?.category).toBeUndefined();
      expect(product?.imageUrl).toBeUndefined();
    });
  });

  describe('exists', () => {
    it('should return true when product exists', async () => {
      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: { id: 'prod-1' },
        error: null,
      });
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: mockMaybeSingle,
          }),
        }),
      });

      const exists = await repository.exists('prod-1');

      expect(exists).toBe(true);
    });

    it('should return false when product does not exist', async () => {
      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: mockMaybeSingle,
          }),
        }),
      });

      const exists = await repository.exists('non-existent');

      expect(exists).toBe(false);
    });

    it('should throw error when exists check fails', async () => {
      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: mockMaybeSingle,
          }),
        }),
      });

      await expect(repository.exists('prod-1')).rejects.toThrow(
        'Error al verificar existencia: Database error'
      );
    });
  });

  describe('findAll', () => {
    it('should retrieve all products', async () => {
      const mockData = [
        {
          id: 'prod-1',
          name: 'Product 1',
          price_amount: 100,
          price_currency: 'MXN',
          stock: 50,
          description: null,
          category: null,
          image_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'prod-2',
          name: 'Product 2',
          price_amount: 200,
          price_currency: 'MXN',
          stock: 30,
          description: null,
          category: null,
          image_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockData,
            error: null,
          }),
        }),
      });

      const products = await repository.findAll();

      expect(products).toHaveLength(2);
      expect(products[0].id).toBe('prod-1');
      expect(products[1].id).toBe('prod-2');
    });

    it('should return empty array when no products exist', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      });

      const products = await repository.findAll();

      expect(products).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('should return true when product is deleted', async () => {
      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: null,
            count: 1,
          }),
        }),
      });

      const result = await repository.delete('prod-1');

      expect(result).toBe(true);
    });

    it('should return false when product does not exist', async () => {
      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: null,
            count: 0,
          }),
        }),
      });

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
    });

    it('should throw error when delete fails', async () => {
      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: { message: 'Delete error' },
            count: null,
          }),
        }),
      });

      await expect(repository.delete('prod-1')).rejects.toThrow(
        'Error al eliminar producto: Delete error'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle products with different currencies', async () => {
      const price = Money.create(50, 'USD');
      const product = Product.create('prod-usd', 'USD Product', price, 10);

      const mockUpsert = jest.fn().mockResolvedValue({ error: null });
      mockSupabase.from.mockReturnValue({
        upsert: mockUpsert,
      });

      await repository.save(product);

      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          price_currency: 'USD',
        }),
        { onConflict: 'id' }
      );
    });

    it('should handle products with zero stock', async () => {
      const mockData = {
        id: 'prod-zero',
        name: 'Out of Stock',
        price_amount: 100,
        price_currency: 'MXN',
        stock: 0,
        description: null,
        category: null,
        image_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: mockData,
        error: null,
      });
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: mockMaybeSingle,
          }),
        }),
      });

      const product = await repository.findById('prod-zero');

      expect(product?.stock).toBe(0);
      expect(product?.isOutOfStock()).toBe(true);
    });

    it('should properly convert dates from ISO strings', async () => {
      const createdDate = new Date('2024-01-01T00:00:00.000Z');
      const updatedDate = new Date('2024-01-02T00:00:00.000Z');

      const mockData = {
        id: 'prod-dates',
        name: 'Product with Dates',
        price_amount: 100,
        price_currency: 'MXN',
        stock: 10,
        description: null,
        category: null,
        image_url: null,
        created_at: createdDate.toISOString(),
        updated_at: updatedDate.toISOString(),
      };

      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: mockData,
        error: null,
      });
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: mockMaybeSingle,
          }),
        }),
      });

      const product = await repository.findById('prod-dates');

      expect(product?.createdAt).toBeInstanceOf(Date);
      expect(product?.updatedAt).toBeInstanceOf(Date);
      expect(product?.createdAt.toISOString()).toBe(createdDate.toISOString());
      expect(product?.updatedAt.toISOString()).toBe(updatedDate.toISOString());
    });
  });
});
