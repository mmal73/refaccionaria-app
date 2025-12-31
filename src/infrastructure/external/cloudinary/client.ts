/**
 * Cloudinary Client Configuration
 * 
 * Este archivo configura Cloudinary para:
 * - Subir imágenes de productos
 * - Transformar imágenes (resize, crop, optimize)
 * - Generar URLs optimizadas
 * 
 * IMPORTANTE: Este es código de INFRASTRUCTURE.
 * El DOMAIN y APPLICATION no conocen Cloudinary.
 */

/**
 * Configuración de Cloudinary
 */
export interface CloudinaryConfig {
  cloudName: string;
  apiKey?: string;
  apiSecret?: string;
}

/**
 * Opciones para subir imágenes
 */
export interface UploadOptions {
  folder?: string;
  publicId?: string;
  transformation?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'limit';
    quality?: 'auto' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
  };
}

/**
 * Resultado de subir una imagen
 */
export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Cliente de Cloudinary
 * 
 * Proporciona métodos para interactuar con Cloudinary
 */
export class CloudinaryClient {
  private config: CloudinaryConfig;

  constructor(config?: CloudinaryConfig) {
    // Obtener configuración de variables de entorno
    const cloudName = config?.cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = config?.apiKey || process.env.CLOUDINARY_API_KEY;
    const apiSecret = config?.apiSecret || process.env.CLOUDINARY_API_SECRET;

    if (!cloudName) {
      throw new Error(
        'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME no está definida en las variables de entorno'
      );
    }

    this.config = {
      cloudName,
      apiKey,
      apiSecret,
    };
  }

  /**
   * Obtiene la URL base de Cloudinary
   */
  getBaseUrl(): string {
    return `https://res.cloudinary.com/${this.config.cloudName}`;
  }

  /**
   * Genera una URL optimizada para una imagen
   * 
   * @param publicId - ID público de la imagen en Cloudinary
   * @param options - Opciones de transformación
   * @returns URL de la imagen optimizada
   */
  getImageUrl(publicId: string, options?: UploadOptions['transformation']): string {
    const baseUrl = this.getBaseUrl();
    
    // Construir transformaciones
    const transformations: string[] = [];
    
    if (options?.width) {
      transformations.push(`w_${options.width}`);
    }
    
    if (options?.height) {
      transformations.push(`h_${options.height}`);
    }
    
    if (options?.crop) {
      transformations.push(`c_${options.crop}`);
    }
    
    if (options?.quality) {
      transformations.push(`q_${options.quality}`);
    }
    
    if (options?.format) {
      transformations.push(`f_${options.format}`);
    }

    const transformationString = transformations.length > 0 
      ? `/${transformations.join(',')}`
      : '';

    return `${baseUrl}/image/upload${transformationString}/${publicId}`;
  }

  /**
   * Sube una imagen a Cloudinary (lado del cliente)
   * 
   * NOTA: Para producción, considera usar un endpoint API
   * para manejar las credenciales de forma segura
   * 
   * @param file - Archivo a subir
   * @param options - Opciones de subida
   * @returns Resultado de la subida
   */
  async uploadImage(file: File, options?: UploadOptions): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_preset'); // Debes crear esto en Cloudinary
    
    if (options?.folder) {
      formData.append('folder', options.folder);
    }
    
    if (options?.publicId) {
      formData.append('public_id', options.publicId);
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`;

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error al subir imagen: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        publicId: data.public_id,
        url: data.url,
        secureUrl: data.secure_url,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
      };
    } catch (error) {
      throw new Error(
        `Error al subir imagen a Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Elimina una imagen de Cloudinary
   * 
   * NOTA: Requiere API Key y Secret (debe hacerse desde el servidor)
   * 
   * @param publicId - ID público de la imagen a eliminar
   */
  async deleteImage(publicId: string): Promise<void> {
    // Esta operación requiere autenticación con API Key y Secret
    // Debe implementarse en un API route de Next.js
    throw new Error(
      'deleteImage debe implementarse en un API route del servidor por seguridad'
    );
  }
}

/**
 * Instancia singleton del cliente de Cloudinary
 */
let cloudinaryInstance: CloudinaryClient | null = null;

/**
 * Obtiene o crea la instancia del cliente de Cloudinary
 * 
 * @returns Cliente de Cloudinary configurado
 */
export function getCloudinaryClient(): CloudinaryClient {
  if (!cloudinaryInstance) {
    cloudinaryInstance = new CloudinaryClient();
  }
  return cloudinaryInstance;
}

/**
 * Exportar para uso directo
 */
export default CloudinaryClient;
