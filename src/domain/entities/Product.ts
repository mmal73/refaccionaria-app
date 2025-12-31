import { Money } from '../value-objects/Money';

/**
 * Product Entity
 * Representa un producto en el sistema de refaccionaria
 * 
 * Reglas de negocio:
 * - El nombre debe tener al menos 3 caracteres
 * - El precio debe ser mayor a 0
 * - El stock no puede ser negativo
 * - Un producto con stock 0 está agotado
 * - Stock bajo es cuando hay menos de 10 unidades
 */
export class Product {
  private readonly _id: string;
  private _name: string;
  private _price: Money;
  private _stock: number;
  private _description?: string;
  private _category?: string;
  private _imageUrl?: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: string,
    name: string,
    price: Money,
    stock: number,
    description?: string,
    category?: string,
    imageUrl?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._stock = stock;
    this._description = description;
    this._category = category;
    this._imageUrl = imageUrl;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  /**
   * Factory method para crear un nuevo producto
   * @throws Error si las validaciones fallan
   */
  static create(
    id: string,
    name: string,
    price: Money,
    stock: number,
    description?: string,
    category?: string,
    imageUrl?: string
  ): Product {
    // Validaciones
    if (!id || id.trim().length === 0) {
      throw new Error('El ID del producto es requerido');
    }

    if (!name || name.trim().length < 3) {
      throw new Error('El nombre del producto debe tener al menos 3 caracteres');
    }

    if (price.amount <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    if (stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    return new Product(
      id.trim(),
      name.trim(),
      price,
      stock,
      description?.trim(),
      category?.trim(),
      imageUrl?.trim()
    );
  }

  /**
   * Factory method para reconstruir un producto desde persistencia
   */
  static fromPersistence(data: {
    id: string;
    name: string;
    price: { amount: number; currency: string };
    stock: number;
    description?: string;
    category?: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    return new Product(
      data.id,
      data.name,
      Money.fromJSON(data.price),
      data.stock,
      data.description,
      data.category,
      data.imageUrl,
      data.createdAt,
      data.updatedAt
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): Money {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  get description(): string | undefined {
    return this._description;
  }

  get category(): string | undefined {
    return this._category;
  }

  get imageUrl(): string | undefined {
    return this._imageUrl;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de negocio

  /**
   * Actualiza el nombre del producto
   * @throws Error si el nombre no es válido
   */
  updateName(name: string): void {
    if (!name || name.trim().length < 3) {
      throw new Error('El nombre del producto debe tener al menos 3 caracteres');
    }

    this._name = name.trim();
    this._updatedAt = new Date();
  }

  /**
   * Actualiza el precio del producto
   * @throws Error si el precio no es válido
   */
  updatePrice(price: Money): void {
    if (price.amount <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    this._price = price;
    this._updatedAt = new Date();
  }

  /**
   * Actualiza la descripción del producto
   */
  updateDescription(description: string): void {
    this._description = description.trim();
    this._updatedAt = new Date();
  }

  /**
   * Actualiza la categoría del producto
   */
  updateCategory(category: string): void {
    this._category = category.trim();
    this._updatedAt = new Date();
  }

  /**
   * Actualiza la URL de la imagen del producto
   */
  updateImageUrl(imageUrl: string): void {
    this._imageUrl = imageUrl.trim();
    this._updatedAt = new Date();
  }

  /**
   * Incrementa el stock del producto
   * @throws Error si la cantidad es negativa o cero
   */
  increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('La cantidad a incrementar debe ser mayor a 0');
    }

    this._stock += quantity;
    this._updatedAt = new Date();
  }

  /**
   * Decrementa el stock del producto
   * @throws Error si la cantidad es negativa, cero, o excede el stock disponible
   */
  decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('La cantidad a decrementar debe ser mayor a 0');
    }

    if (quantity > this._stock) {
      throw new Error(`Stock insuficiente. Disponible: ${this._stock}, Solicitado: ${quantity}`);
    }

    this._stock -= quantity;
    this._updatedAt = new Date();
  }

  /**
   * Verifica si el producto está agotado
   */
  isOutOfStock(): boolean {
    return this._stock === 0;
  }

  /**
   * Verifica si el producto tiene stock bajo (menos de 10 unidades)
   */
  hasLowStock(): boolean {
    return this._stock > 0 && this._stock < 10;
  }

  /**
   * Verifica si hay suficiente stock para una cantidad solicitada
   */
  hasEnoughStock(quantity: number): boolean {
    return this._stock >= quantity;
  }

  /**
   * Calcula el valor total del inventario para este producto
   */
  calculateInventoryValue(): Money {
    return this._price.multiply(this._stock);
  }

  /**
   * Convierte la entidad a un objeto plano para persistencia
   */
  toPersistence(): {
    id: string;
    name: string;
    price: { amount: number; currency: string };
    stock: number;
    description?: string;
    category?: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      name: this._name,
      price: this._price.toJSON(),
      stock: this._stock,
      description: this._description,
      category: this._category,
      imageUrl: this._imageUrl,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
