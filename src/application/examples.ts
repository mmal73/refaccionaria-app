/**
 * EJEMPLO DE USO - Application Layer
 * Este archivo demuestra cómo usar los casos de uso de la aplicación
 * 
 * NOTA: Este es solo un ejemplo educativo.
 * En producción, el repositorio vendría de la capa de Infrastructure.
 */

import {
  CreateProductUseCase,
  GetProductByIdUseCase,
  UpdateStockUseCase,
  GetLowStockProductsUseCase,
  type CreateProductDTO,
  type UpdateStockDTO,
} from '../application';
import type { IProductRepository } from '../domain';

// ============================================
// MOCK REPOSITORY (solo para el ejemplo)
// En producción, esto vendría de Infrastructure
// ============================================

class MockProductRepository implements IProductRepository {
  private products = new Map();

  async save(product: any): Promise<void> {
    this.products.set(product.id, product);
    console.log(`✓ Producto guardado: ${product.id}`);
  }

  async findById(id: string): Promise<any> {
    return this.products.get(id) || null;
  }

  async findAll(): Promise<any[]> {
    return Array.from(this.products.values());
  }

  async findByCategory(category: string): Promise<any[]> {
    return Array.from(this.products.values()).filter(
      (p) => p.category === category
    );
  }

  async findLowStock(): Promise<any[]> {
    return Array.from(this.products.values()).filter((p) => p.hasLowStock());
  }

  async findOutOfStock(): Promise<any[]> {
    return Array.from(this.products.values()).filter((p) => p.isOutOfStock());
  }

  async searchByName(name: string): Promise<any[]> {
    return Array.from(this.products.values()).filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  async delete(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.products.has(id);
  }
}

// ============================================
// EJEMPLO 1: Crear un producto
// ============================================

async function example1() {
  console.log('\n=== EJEMPLO 1: Crear un producto ===\n');

  // 1. Crear el repositorio (en producción viene de Infrastructure)
  const productRepository = new MockProductRepository();

  // 2. Crear el caso de uso con inyección de dependencias
  const createProductUseCase = new CreateProductUseCase(productRepository);

  // 3. Preparar el DTO con los datos de entrada
  const dto: CreateProductDTO = {
    id: 'prod-001',
    name: 'Filtro de Aceite Premium',
    price: {
      amount: 250.5,
      currency: 'MXN',
    },
    stock: 50,
    description: 'Filtro de aceite de alta calidad para motor',
    category: 'Filtros',
  };

  try {
    // 4. Ejecutar el caso de uso
    const result = await createProductUseCase.execute(dto);

    // 5. El resultado es un DTO listo para la UI
    console.log('Producto creado exitosamente:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }
}

// ============================================
// EJEMPLO 2: Obtener un producto por ID
// ============================================

async function example2() {
  console.log('\n=== EJEMPLO 2: Obtener producto por ID ===\n');

  const productRepository = new MockProductRepository();

  // Primero crear un producto
  const createUseCase = new CreateProductUseCase(productRepository);
  await createUseCase.execute({
    id: 'prod-002',
    name: 'Batería 12V 45Ah',
    price: { amount: 1500, currency: 'MXN' },
    stock: 15,
    category: 'Baterías',
  });

  // Ahora obtenerlo
  const getUseCase = new GetProductByIdUseCase(productRepository);
  const product = await getUseCase.execute('prod-002');

  if (product) {
    console.log('Producto encontrado:');
    console.log(`- Nombre: ${product.name}`);
    console.log(`- Precio: ${product.price.currency} ${product.price.amount}`);
    console.log(`- Stock: ${product.stock}`);
    console.log(`- Stock bajo: ${product.hasLowStock ? 'Sí' : 'No'}`);
    console.log(`- Valor inventario: ${product.inventoryValue.currency} ${product.inventoryValue.amount}`);
  } else {
    console.log('Producto no encontrado');
  }
}

// ============================================
// EJEMPLO 3: Actualizar stock
// ============================================

async function example3() {
  console.log('\n=== EJEMPLO 3: Actualizar stock ===\n');

  const productRepository = new MockProductRepository();

  // Crear un producto con stock bajo
  const createUseCase = new CreateProductUseCase(productRepository);
  await createUseCase.execute({
    id: 'prod-003',
    name: 'Llanta 185/65 R15',
    price: { amount: 850, currency: 'MXN' },
    stock: 5,
    category: 'Llantas',
  });

  console.log('Stock inicial: 5 unidades');

  // Incrementar stock
  const updateStockUseCase = new UpdateStockUseCase(productRepository);
  
  const increaseDTO: UpdateStockDTO = {
    productId: 'prod-003',
    quantity: 20,
    operation: 'increase',
  };

  await updateStockUseCase.execute(increaseDTO);
  console.log('✓ Stock incrementado en 20 unidades');

  // Verificar el nuevo stock
  const getUseCase = new GetProductByIdUseCase(productRepository);
  const product = await getUseCase.execute('prod-003');
  console.log(`Stock actual: ${product?.stock} unidades`);

  // Decrementar stock
  const decreaseDTO: UpdateStockDTO = {
    productId: 'prod-003',
    quantity: 10,
    operation: 'decrease',
  };

  await updateStockUseCase.execute(decreaseDTO);
  console.log('✓ Stock decrementado en 10 unidades');

  const updatedProduct = await getUseCase.execute('prod-003');
  console.log(`Stock final: ${updatedProduct?.stock} unidades`);
}

// ============================================
// EJEMPLO 4: Obtener productos con stock bajo
// ============================================

async function example4() {
  console.log('\n=== EJEMPLO 4: Productos con stock bajo ===\n');

  const productRepository = new MockProductRepository();
  const createUseCase = new CreateProductUseCase(productRepository);

  // Crear varios productos
  await createUseCase.execute({
    id: 'prod-004',
    name: 'Producto A',
    price: { amount: 100, currency: 'MXN' },
    stock: 5, // Stock bajo
  });

  await createUseCase.execute({
    id: 'prod-005',
    name: 'Producto B',
    price: { amount: 200, currency: 'MXN' },
    stock: 50, // Stock normal
  });

  await createUseCase.execute({
    id: 'prod-006',
    name: 'Producto C',
    price: { amount: 150, currency: 'MXN' },
    stock: 3, // Stock bajo
  });

  // Obtener productos con stock bajo
  const getLowStockUseCase = new GetLowStockProductsUseCase(productRepository);
  const lowStockProducts = await getLowStockUseCase.execute();

  console.log(`Productos con stock bajo: ${lowStockProducts.length}`);
  lowStockProducts.forEach((product) => {
    console.log(`- ${product.name}: ${product.stock} unidades`);
  });
}

// ============================================
// EJEMPLO 5: Validaciones de negocio
// ============================================

async function example5() {
  console.log('\n=== EJEMPLO 5: Validaciones de negocio ===\n');

  const productRepository = new MockProductRepository();
  const createUseCase = new CreateProductUseCase(productRepository);

  // Intentar crear un producto duplicado
  await createUseCase.execute({
    id: 'prod-007',
    name: 'Producto Test',
    price: { amount: 100, currency: 'MXN' },
    stock: 10,
  });

  try {
    await createUseCase.execute({
      id: 'prod-007', // Mismo ID
      name: 'Otro Producto',
      price: { amount: 200, currency: 'MXN' },
      stock: 20,
    });
  } catch (error) {
    console.log('✓ Error esperado:', (error as Error).message);
  }

  // Intentar crear con nombre inválido
  try {
    await createUseCase.execute({
      id: 'prod-008',
      name: 'AB', // Menos de 3 caracteres
      price: { amount: 100, currency: 'MXN' },
      stock: 10,
    });
  } catch (error) {
    console.log('✓ Error esperado:', (error as Error).message);
  }

  // Intentar decrementar más stock del disponible
  const updateStockUseCase = new UpdateStockUseCase(productRepository);
  try {
    await updateStockUseCase.execute({
      productId: 'prod-007',
      quantity: 100, // Solo hay 10 en stock
      operation: 'decrease',
    });
  } catch (error) {
    console.log('✓ Error esperado:', (error as Error).message);
  }
}

// ============================================
// EJECUTAR TODOS LOS EJEMPLOS
// ============================================

async function runAllExamples() {
  await example1();
  await example2();
  await example3();
  await example4();
  await example5();
}

// Ejecutar si se corre directamente
if (require.main === module) {
  runAllExamples().catch(console.error);
}
