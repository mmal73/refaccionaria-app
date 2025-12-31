/**
 * Página de ejemplo para crear productos
 * 
 * Esta página demuestra cómo usar el componente CreateProductForm
 * en una aplicación Next.js
 */

import { CreateProductForm } from '@/presentation';

export default function CreateProductPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Refaccionaria
          </h1>
          <p className="text-lg text-gray-600">
            Gestión de inventario con Clean Architecture
          </p>
        </div>

        {/* Form */}
        <CreateProductForm />

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Arquitectura: Domain-Driven Design + Clean Architecture</p>
          <p className="mt-1">Infrastructure: Supabase + Cloudinary</p>
        </div>
      </div>
    </main>
  );
}
