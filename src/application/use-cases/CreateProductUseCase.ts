import { Product, Money, type IProductRepository, type IImageService } from '../../domain';
import type { CreateProductDTO, ProductResponseDTO } from '../dtos';
import { ProductMapper } from '../mappers';

/**
 * CreateProductUseCase
 * Caso de uso para crear un nuevo producto
 * 
 * Responsabilidades:
 * - Validar los datos de entrada (DTO)
 * - Subir la imagen del producto (si existe)
 * - Crear la entidad Product del dominio
 * - Persistir el producto usando el repositorio
 * - Retornar el resultado como DTO
 * 
 * Principios aplicados:
 * - Inyección de Dependencias: Recibe IProductRepository e IImageService en el constructor
 * - Inversión de Dependencias: Depende de las interfaces, no de las implementaciones
 * - Single Responsibility: Solo se encarga de orquestar la creación de productos
 */
export class CreateProductUseCase {
  /**
   * Constructor con inyección de dependencias
   * @param productRepository - Interfaz del repositorio (implementada en Infrastructure)
   * @param imageService - Interfaz del servicio de imágenes (implementada en Infrastructure)
   */
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly imageService: IImageService
  ) {}

  /**
   * Ejecuta el caso de uso de crear producto
   * @param dto - Datos de entrada para crear el producto
   * @returns DTO con los datos del producto creado
   * @throws Error si las validaciones fallan o si el producto ya existe
   */
  async execute(dto: CreateProductDTO): Promise<ProductResponseDTO> {
    // 1. Validar que el producto no exista
    const exists = await this.productRepository.exists(dto.id);
    if (exists) {
      throw new Error(`Ya existe un producto con el ID: ${dto.id}`);
    }

    // 2. Subir la imagen si existe
    let imageUrl: string | undefined;
    if (dto.imageFile) {
      try {
        const uploadResult = await this.imageService.upload(dto.imageFile, {
          folder: 'products',
          publicId: `product-${dto.id}`,
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 'auto',
        });
        imageUrl = uploadResult.secureUrl;
      } catch (error) {
        throw new Error(
          `Error al subir la imagen: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    // 3. Crear el Value Object Money
    const price = Money.create(dto.price.amount, dto.price.currency);

    // 4. Crear la entidad Product (aquí se ejecutan las validaciones del dominio)
    const product = Product.create(
      dto.id,
      dto.name,
      price,
      dto.stock,
      dto.description,
      dto.category,
      imageUrl
    );

    // 5. Persistir el producto usando el repositorio
    await this.productRepository.save(product);

    // 6. Convertir la entidad a DTO y retornar
    return ProductMapper.toDTO(product);
  }
}
