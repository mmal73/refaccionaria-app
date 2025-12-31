/**
 * IImageService
 * Interfaz del servicio de imágenes (DOMAIN)
 * 
 * Define el contrato para subir y gestionar imágenes.
 * La implementación concreta estará en INFRASTRUCTURE.
 * 
 * Principio de Inversión de Dependencias:
 * - DOMAIN define la interfaz
 * - INFRASTRUCTURE la implementa
 * - APPLICATION usa la interfaz (no la implementación)
 */

/**
 * Opciones para subir una imagen
 */
export interface UploadImageOptions {
  /**
   * Carpeta donde se guardará la imagen
   * Ejemplo: 'products', 'categories', 'users'
   */
  folder?: string;

  /**
   * ID público personalizado para la imagen
   * Si no se proporciona, se generará automáticamente
   */
  publicId?: string;

  /**
   * Ancho máximo de la imagen en píxeles
   */
  maxWidth?: number;

  /**
   * Alto máximo de la imagen en píxeles
   */
  maxHeight?: number;

  /**
   * Calidad de la imagen (1-100 o 'auto')
   */
  quality?: number | 'auto';
}

/**
 * Resultado de subir una imagen
 */
export interface UploadImageResult {
  /**
   * URL pública de la imagen
   */
  url: string;

  /**
   * URL segura (HTTPS) de la imagen
   */
  secureUrl: string;

  /**
   * ID público de la imagen en el servicio
   */
  publicId: string;

  /**
   * Ancho de la imagen en píxeles
   */
  width: number;

  /**
   * Alto de la imagen en píxeles
   */
  height: number;

  /**
   * Formato de la imagen (jpg, png, webp, etc.)
   */
  format: string;

  /**
   * Tamaño del archivo en bytes
   */
  bytes: number;
}

/**
 * Interfaz del servicio de imágenes
 * 
 * Esta interfaz será implementada por diferentes servicios:
 * - CloudinaryImageService (Cloudinary)
 * - S3ImageService (AWS S3)
 * - LocalImageService (almacenamiento local)
 * etc.
 */
export interface IImageService {
  /**
   * Sube una imagen al servicio de almacenamiento
   * 
   * @param file - Archivo de imagen a subir
   * @param options - Opciones de configuración para la subida
   * @returns Resultado con la URL y metadatos de la imagen
   * @throws Error si la subida falla
   */
  upload(file: File, options?: UploadImageOptions): Promise<UploadImageResult>;

  /**
   * Elimina una imagen del servicio de almacenamiento
   * 
   * @param publicId - ID público de la imagen a eliminar
   * @throws Error si la eliminación falla
   */
  delete(publicId: string): Promise<void>;

  /**
   * Obtiene la URL de una imagen con transformaciones opcionales
   * 
   * @param publicId - ID público de la imagen
   * @param options - Opciones de transformación
   * @returns URL de la imagen
   */
  getUrl(publicId: string, options?: UploadImageOptions): string;
}
