/**
 * EJEMPLO DE USO - Domain Layer
 * Este archivo demuestra cómo usar las entidades del dominio
 * 
 * NOTA: Este es solo un ejemplo educativo para demostrar el uso.
 * NO es parte del código de producción.
 */

import { Product, Money } from '../domain';

// ============================================
// EJEMPLO 1: Crear un producto
// ============================================

console.log('=== EJEMPLO 1: Crear un producto ===');

try {
  // Crear un objeto Money
  const price = Money.create(250.50, 'MXN');
  console.log('Precio creado:', price.toString()); // MXN 250.50

  // Crear un producto
  const product = Product.create(
    'prod-001',
    'Filtro de Aceite',
    price,
    50,
    'Filtro de aceite para motor de automóvil',
    'Filtros'
  );

  console.log('Producto creado:', {
    id: product.id,
    name: product.name,
    price: product.price.toString(),
    stock: product.stock,
    category: product.category,
  });
} catch (error) {
  console.error('Error:', error);
}

// ============================================
// EJEMPLO 2: Operaciones con Money
// ============================================

console.log('\n=== EJEMPLO 2: Operaciones con Money ===');

const price1 = Money.create(100, 'MXN');
const price2 = Money.create(50, 'MXN');

// Sumar
const total = price1.add(price2);
console.log('Suma:', total.toString()); // MXN 150.00

// Multiplicar
const totalWithTax = price1.multiply(1.16); // 16% IVA
console.log('Con IVA:', totalWithTax.toString()); // MXN 116.00

// Comparar
console.log('¿price1 > price2?', price1.isGreaterThan(price2)); // true

// ============================================
// EJEMPLO 3: Gestión de stock
// ============================================

console.log('\n=== EJEMPLO 3: Gestión de stock ===');

const product2 = Product.create(
  'prod-002',
  'Batería 12V',
  Money.create(1500, 'MXN'),
  5 // Stock bajo
);

console.log('Stock inicial:', product2.stock);
console.log('¿Tiene stock bajo?', product2.hasLowStock()); // true
console.log('¿Está agotado?', product2.isOutOfStock()); // false

// Incrementar stock
product2.increaseStock(20);
console.log('Stock después de incrementar:', product2.stock); // 25
console.log('¿Tiene stock bajo?', product2.hasLowStock()); // false

// Decrementar stock
product2.decreaseStock(10);
console.log('Stock después de decrementar:', product2.stock); // 15

// ============================================
// EJEMPLO 4: Validaciones de negocio
// ============================================

console.log('\n=== EJEMPLO 4: Validaciones de negocio ===');

try {
  // Intentar crear un producto con nombre inválido
  Product.create(
    'prod-003',
    'AB', // Menos de 3 caracteres
    Money.create(100, 'MXN'),
    10
  );
} catch (error) {
  console.log('Error esperado:', (error as Error).message);
  // "El nombre del producto debe tener al menos 3 caracteres"
}

try {
  // Intentar crear un precio negativo
  Money.create(-100, 'MXN');
} catch (error) {
  console.log('Error esperado:', (error as Error).message);
  // "El monto no puede ser negativo"
}

try {
  // Intentar decrementar más stock del disponible
  const product3 = Product.create(
    'prod-004',
    'Producto Test',
    Money.create(100, 'MXN'),
    5
  );
  product3.decreaseStock(10); // Solo hay 5 en stock
} catch (error) {
  console.log('Error esperado:', (error as Error).message);
  // "Stock insuficiente. Disponible: 5, Solicitado: 10"
}

// ============================================
// EJEMPLO 5: Calcular valor de inventario
// ============================================

console.log('\n=== EJEMPLO 5: Calcular valor de inventario ===');

const product4 = Product.create(
  'prod-005',
  'Llanta 185/65 R15',
  Money.create(850, 'MXN'),
  40
);

const inventoryValue = product4.calculateInventoryValue();
console.log('Valor del inventario:', inventoryValue.toString());
// MXN 34000.00 (850 * 40)

// ============================================
// EJEMPLO 6: Persistencia (serialización)
// ============================================

console.log('\n=== EJEMPLO 6: Persistencia ===');

const product5 = Product.create(
  'prod-006',
  'Amortiguador Delantero',
  Money.create(1200, 'MXN'),
  15,
  'Amortiguador para suspensión delantera',
  'Suspensión'
);

// Convertir a formato de persistencia
const persistenceData = product5.toPersistence();
console.log('Datos para persistencia:', JSON.stringify(persistenceData, null, 2));

// Reconstruir desde persistencia
const reconstructed = Product.fromPersistence(persistenceData);
console.log('Producto reconstruido:', reconstructed.name);
console.log('¿Son iguales?', product5.id === reconstructed.id);
