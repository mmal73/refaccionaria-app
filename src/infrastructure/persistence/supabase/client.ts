/**
 * Supabase Client Configuration
 * 
 * Este archivo configura el cliente de Supabase para:
 * - Autenticación de usuarios
 * - Base de datos PostgreSQL
 * - Storage (si se necesita)
 * 
 * IMPORTANTE: Este es código de INFRASTRUCTURE.
 * El DOMAIN y APPLICATION no conocen Supabase.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Tipo para la base de datos de Supabase
 * Define el schema de las tablas
 */
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          price_amount: number;
          price_currency: string;
          stock: number;
          description: string | null;
          category: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          price_amount: number;
          price_currency: string;
          stock: number;
          description?: string | null;
          category?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price_amount?: number;
          price_currency?: string;
          stock?: number;
          description?: string | null;
          category?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Aquí puedes agregar más tablas según necesites
      // sales: { ... }
      // users: { ... }
    };
  };
}

/**
 * Singleton del cliente de Supabase
 */
let supabaseInstance: SupabaseClient<Database> | null = null;

/**
 * Obtiene o crea la instancia del cliente de Supabase
 * 
 * @returns Cliente de Supabase configurado
 * @throws Error si las variables de entorno no están configuradas
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  // Si ya existe una instancia, retornarla (singleton)
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Validar variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL no está definida en las variables de entorno'
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida en las variables de entorno'
    );
  }

  // Crear el cliente de Supabase
  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return supabaseInstance;
}

/**
 * Hook para usar en componentes de React (opcional)
 * Puedes crear un custom hook en la capa de Presentation
 */
export function createSupabaseClient() {
  return getSupabaseClient();
}

/**
 * Tipos de exportación para usar en repositorios
 */
export type SupabaseClientType = SupabaseClient<Database>;
export type { Database };
