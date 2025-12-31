/**
 * Infrastructure - Persistence Layer Exports
 */

// Supabase
export {
  getSupabaseClient,
  createSupabaseClient,
  type SupabaseClientType,
  type Database,
} from './supabase/client';

// Repositories
export { SupabaseProductRepository } from './repositories';
