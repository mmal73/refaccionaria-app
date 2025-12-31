/**
 * CloudinaryImageService
 * Implementación de IImageService usando Cloudinary con fetch API
 * 
 * Esta implementación está en INFRASTRUCTURE porque:
 * - Depende de Cloudinary (servicio externo)
 * - Implementa la interfaz IImageService del DOMAIN
 * - Puede ser reemplazada por otra implementación (S3, local, etc.)
 * 
 * NOTA: Usa fetch API directamente (sin SDK) para mantener el bundle ligero
 */

import type {
  IImageService,
  UploadImageOptions,
  UploadImageResult,
} from '../../../domain';

/**
 * Servicio de imágenes usando Cloudinary con fetch API
 */
export class CloudinaryImageService implements IImageService {
  private readonly cloudName: string;
  private readonly uploadPreset: string;

  constructor() {
    // Leer variables de entorno
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
    this.uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

    if (!this.cloudName) {
      throw new Error(
        'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME no está definida en las variables de entorno'
      );
    }

    if (!this.uploadPreset) {
      throw new Error(
        'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET no está definida en las variables de entorno'
      );
    }
  }

  /**
   * Sube una imagen a Cloudinary usando fetch API
   * 
   * @param file - Archivo de imagen a subir
   * @param options - Opciones de configuración
   * @returns Resultado con URL y metadatos
   */
  async upload(
    file: File,
    options?: UploadImageOptions
  ): Promise<UploadImageResult> {
    try {
      // Validar que sea un archivo de imagen
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      // Validar tamaño (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('La imagen no debe superar 10MB');
      }

      // Preparar FormData para la subida
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);

      // Agregar folder si se especifica
      if (options?.folder) {
        formData.append('folder', options.folder);
      }

      // Agregar public_id si se especifica
      if (options?.publicId) {
        formData.append('public_id', options.publicId);
      }

      // URL de la API de Cloudinary
      const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

      // Hacer la petición con fetch
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Error al subir imagen: ${errorData.error?.message || response.statusText}`
        );
      }

      const data = await response.json();

      // Mapear resultado al formato del dominio
      return {
        url: data.url,
        secureUrl: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
      };
    } catch (error) {
      throw new Error(
        `Error al subir imagen: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Elimina una imagen de Cloudinary
   * 
   * NOTA: Esta operación requiere credenciales del servidor (API Key y Secret)
   * En producción, debe implementarse en un API route de Next.js
   * 
   * @param publicId - ID público de la imagen
   */
  async delete(publicId: string): Promise<void> {
    throw new Error(
      'delete() debe implementarse en un API route del servidor por seguridad. ' +
      'La eliminación requiere API Key y Secret que no deben exponerse en el cliente.'
    );
  }

  /**
   * Obtiene la URL de una imagen con transformaciones
   * 
   * @param publicId - ID público de la imagen
   * @param options - Opciones de transformación
   * @returns URL de la imagen
   */
  getUrl(publicId: string, options?: UploadImageOptions): string {
    const baseUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload`;
    
    // Construir transformaciones
    const transformations: string[] = [];
    
    if (options?.maxWidth) {
      transformations.push(`w_${options.maxWidth}`);
    }
    
    if (options?.maxHeight) {
      transformations.push(`h_${options.maxHeight}`);
    }
    
    if (options?.maxWidth || options?.maxHeight) {
      transformations.push('c_limit');
    }
    
    const quality = options?.quality || 'auto';
    transformations.push(`q_${quality}`);
    transformations.push('f_auto');

    const transformationString = transformations.length > 0 
      ? `/${transformations.join(',')}`
      : '';

    return `${baseUrl}${transformationString}/${publicId}`;
  }

  /**
   * Obtiene múltiples URLs con diferentes tamaños (útil para responsive images)
   * 
   * @param publicId - ID público de la imagen
   * @returns Objeto con URLs en diferentes tamaños
   */
  getResponsiveUrls(publicId: string): {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
    original: string;
  } {
    return {
      thumbnail: this.getUrl(publicId, { maxWidth: 150, maxHeight: 150 }),
      small: this.getUrl(publicId, { maxWidth: 400, maxHeight: 400 }),
      medium: this.getUrl(publicId, { maxWidth: 800, maxHeight: 800 }),
      large: this.getUrl(publicId, { maxWidth: 1200, maxHeight: 1200 }),
      original: this.getUrl(publicId),
    };
  }
}
