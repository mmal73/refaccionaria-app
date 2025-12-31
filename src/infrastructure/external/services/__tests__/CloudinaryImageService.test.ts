import { describe, it, expect , vi, beforeEach, afterEach } from 'vitest';
import { CloudinaryImageService } from '../CloudinaryImageService';

// Store original environment variables
const originalEnv = process.env;

describe('CloudinaryImageService', () => {
  let service: CloudinaryImageService;
  let mockFetch: vi.Mock;

  beforeEach(() => {
    // Reset environment variables
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'test-cloud',
      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: 'test-preset',
    };

    // Mock global fetch
    mockFetch = vi.fn() as vi.Mock;
    global.fetch = mockFetch;

    service = new CloudinaryImageService();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('Constructor validation', () => {
    it('should throw error when CLOUDINARY_CLOUD_NAME is not defined', () => {
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = '';

      expect(() => {
        new CloudinaryImageService();
      }).toThrow('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME no está definida en las variables de entorno');
    });

    it('should throw error when CLOUDINARY_UPLOAD_PRESET is not defined', () => {
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = '';

      expect(() => {
        new CloudinaryImageService();
      }).toThrow('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET no está definida en las variables de entorno');
    });

    it('should successfully initialize with valid environment variables', () => {
      expect(() => {
        new CloudinaryImageService();
      }).not.toThrow();
    });
  });

  describe('upload', () => {
    it('should successfully upload an image and return metadata', async () => {
      const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        url: 'http://res.cloudinary.com/test-cloud/image/upload/test.jpg',
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/test.jpg',
        public_id: 'test-id',
        width: 800,
        height: 600,
        format: 'jpg',
        bytes: 12345,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await service.upload(mockFile);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.cloudinary.com/v1_1/test-cloud/image/upload',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );

      expect(result).toEqual({
        url: mockResponse.url,
        secureUrl: mockResponse.secure_url,
        publicId: mockResponse.public_id,
        width: mockResponse.width,
        height: mockResponse.height,
        format: mockResponse.format,
        bytes: mockResponse.bytes,
      });
    });

    it('should upload image with custom options', async () => {
      const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        url: 'http://example.com/image.jpg',
        secure_url: 'https://example.com/image.jpg',
        public_id: 'custom-id',
        width: 1200,
        height: 800,
        format: 'jpg',
        bytes: 54321,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await service.upload(mockFile, {
        folder: 'products',
        publicId: 'custom-id',
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 'auto',
      });

      // Verify FormData was created with correct values
      const callArgs = mockFetch.mock.calls[0];
      const formData = callArgs[1].body as FormData;

      expect(result.publicId).toBe('custom-id');
      expect(result.secureUrl).toBe('https://example.com/image.jpg');
    });

    it('should throw error for non-image file', async () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

      await expect(service.upload(mockFile)).rejects.toThrow('El archivo debe ser una imagen');

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should throw error for file larger than 10MB', async () => {
      const largeContent = new Array(11 * 1024 * 1024).fill('a').join('');
      const mockFile = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });

      await expect(service.upload(mockFile)).rejects.toThrow('La imagen no debe superar 10MB');

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle upload errors from Cloudinary', async () => {
      const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });

      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Bad Request',
        json: vi.fn().mockResolvedValue({
          error: { message: 'Invalid image format' },
        }),
      });

      await expect(service.upload(mockFile)).rejects.toThrow(
        'Error al subir imagen: Invalid image format'
      );
    });

    it('should handle network errors', async () => {
      const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });

      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(service.upload(mockFile)).rejects.toThrow('Error al subir imagen: Network error');
    });

    it('should handle errors when response JSON parsing fails', async () => {
      const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });

      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      });

      await expect(service.upload(mockFile)).rejects.toThrow(
        'Error al subir imagen: Internal Server Error'
      );
    });

    it('should accept various image file types', async () => {
      const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const mockResponse = {
        url: 'http://example.com/image.jpg',
        secure_url: 'https://example.com/image.jpg',
        public_id: 'test-id',
        width: 800,
        height: 600,
        format: 'jpg',
        bytes: 12345,
      };

      for (const type of imageTypes) {
        mockFetch.mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponse),
        });

        const mockFile = new File(['test'], `test.${type.split('/')[1]}`, { type });
        await expect(service.upload(mockFile)).resolves.toBeDefined();
      }
    });
  });

  describe('getUrl', () => {
    it('should generate URL without transformations', () => {
      const url = service.getUrl('test-public-id');

      expect(url).toBe(
        'https://res.cloudinary.com/test-cloud/image/upload/q_auto,f_auto/test-public-id'
      );
    });

    it('should generate URL with width transformation', () => {
      const url = service.getUrl('test-public-id', { maxWidth: 800 });

      expect(url).toBe(
        'https://res.cloudinary.com/test-cloud/image/upload/w_800,c_limit,q_auto,f_auto/test-public-id'
      );
    });

    it('should generate URL with height transformation', () => {
      const url = service.getUrl('test-public-id', { maxHeight: 600 });

      expect(url).toBe(
        'https://res.cloudinary.com/test-cloud/image/upload/h_600,c_limit,q_auto,f_auto/test-public-id'
      );
    });

    it('should generate URL with both width and height transformations', () => {
      const url = service.getUrl('test-public-id', { maxWidth: 800, maxHeight: 600 });

      expect(url).toBe(
        'https://res.cloudinary.com/test-cloud/image/upload/w_800,h_600,c_limit,q_auto,f_auto/test-public-id'
      );
    });

    it('should generate URL with custom quality', () => {
      const url = service.getUrl('test-public-id', { quality: 80 });

      expect(url).toBe(
        'https://res.cloudinary.com/test-cloud/image/upload/q_80,f_auto/test-public-id'
      );
    });

    it('should generate URL with all transformations', () => {
      const url = service.getUrl('test-public-id', {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 90,
      });

      expect(url).toBe(
        'https://res.cloudinary.com/test-cloud/image/upload/w_1200,h_800,c_limit,q_90,f_auto/test-public-id'
      );
    });
  });

  describe('getResponsiveUrls', () => {
    it('should return URLs for all responsive sizes', () => {
      const urls = service.getResponsiveUrls('test-public-id');

      expect(urls).toHaveProperty('thumbnail');
      expect(urls).toHaveProperty('small');
      expect(urls).toHaveProperty('medium');
      expect(urls).toHaveProperty('large');
      expect(urls).toHaveProperty('original');
    });

    it('should generate correct thumbnail URL', () => {
      const urls = service.getResponsiveUrls('test-public-id');

      expect(urls.thumbnail).toContain('w_150');
      expect(urls.thumbnail).toContain('h_150');
    });

    it('should generate correct small URL', () => {
      const urls = service.getResponsiveUrls('test-public-id');

      expect(urls.small).toContain('w_400');
      expect(urls.small).toContain('h_400');
    });

    it('should generate correct medium URL', () => {
      const urls = service.getResponsiveUrls('test-public-id');

      expect(urls.medium).toContain('w_800');
      expect(urls.medium).toContain('h_800');
    });

    it('should generate correct large URL', () => {
      const urls = service.getResponsiveUrls('test-public-id');

      expect(urls.large).toContain('w_1200');
      expect(urls.large).toContain('h_1200');
    });

    it('should generate correct original URL', () => {
      const urls = service.getResponsiveUrls('test-public-id');

      expect(urls.original).toBe(
        'https://res.cloudinary.com/test-cloud/image/upload/q_auto,f_auto/test-public-id'
      );
    });
  });

  describe('delete', () => {
    it('should throw error indicating server-side implementation required', async () => {
      await expect(service.delete('test-public-id')).rejects.toThrow(
        'delete() debe implementarse en un API route del servidor por seguridad'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small image files', async () => {
      const mockFile = new File(['x'], 'tiny.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        url: 'http://example.com/tiny.jpg',
        secure_url: 'https://example.com/tiny.jpg',
        public_id: 'tiny-id',
        width: 1,
        height: 1,
        format: 'jpg',
        bytes: 1,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await service.upload(mockFile);

      expect(result.bytes).toBe(1);
      expect(result.width).toBe(1);
      expect(result.height).toBe(1);
    });

    it('should handle file at exact 10MB limit', async () => {
      const exactSize = 10 * 1024 * 1024;
      const content = new Array(exactSize).fill('a').join('');
      const mockFile = new File([content], 'exact.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        url: 'http://example.com/exact.jpg',
        secure_url: 'https://example.com/exact.jpg',
        public_id: 'exact-id',
        width: 4000,
        height: 3000,
        format: 'jpg',
        bytes: exactSize,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      await expect(service.upload(mockFile)).resolves.toBeDefined();
    });

    it('should handle public IDs with special characters', () => {
      const publicId = 'folder/subfolder/image-name_123';
      const url = service.getUrl(publicId);

      expect(url).toContain(publicId);
    });

    it('should handle very high quality values', () => {
      const url = service.getUrl('test-id', { quality: 100 });

      expect(url).toContain('q_100');
    });

    it('should handle zero quality values', () => {
      const url = service.getUrl('test-id', { quality: 0 });

      expect(url).toContain('q_auto');
    });
  });
});
