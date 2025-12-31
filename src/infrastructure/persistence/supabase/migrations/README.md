# Supabase Migrations

Este directorio contiene las migraciones SQL para Supabase.

## Cómo usar

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **SQL Editor**
3. Copia y pega el contenido de cada archivo de migración
4. Ejecuta la migración

## Migraciones disponibles

### 001_create_products_table.sql
Crea la tabla `products` con:
- ✅ Validaciones a nivel de base de datos
- ✅ Índices para mejor rendimiento
- ✅ Trigger para auto-actualizar `updated_at`
- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas de acceso configuradas

## Orden de ejecución

Ejecuta las migraciones en orden numérico:
1. `001_create_products_table.sql`
2. (futuras migraciones...)

## Notas importantes

- **RLS (Row Level Security)**: Las políticas están configuradas para permitir lectura pública y escritura solo a usuarios autenticados. Ajusta según tus necesidades.
- **Índices**: Se crean índices en `category`, `stock`, `name`, y `created_at` para optimizar las consultas más comunes.
- **Trigger**: El campo `updated_at` se actualiza automáticamente en cada UPDATE.
