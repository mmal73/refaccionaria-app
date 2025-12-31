# Arquitectura DDD - Refaccionaria

## Capas de la Aplicación

### 1. 📦 DOMAIN (Núcleo del negocio)
**src/domain/** - La lógica de negocio pura, sin dependencias externas

- **entities/** - Entidades del dominio (Product, Sale, User)
- **value-objects/** - Objetos de valor inmutables (Money, Email, Stock)
- **repositories/** - Interfaces de repositorios (IProductRepository)
- **services/** - Servicios de dominio (lógica que no pertenece a una entidad)
- **events/** - Eventos de dominio (ProductCreated, StockUpdated)

**Reglas:**
- ❌ NO puede depender de ninguna otra capa
- ❌ NO conoce Firebase, Next.js, o cualquier framework
- ✅ Solo lógica de negocio pura
- ✅ Fácil de testear sin mocks

### 2. 🎯 APPLICATION (Casos de uso)
**src/application/** - Orquesta el dominio para cumplir casos de uso

- **use-cases/** - Casos de uso de la aplicación
  - CreateProductUseCase
  - UpdateStockUseCase
  - GetLowStockProductsUseCase
- **dtos/** - Data Transfer Objects (entrada/salida de use cases)
- **mappers/** - Convierte entre DTOs y entidades

**Reglas:**
- ✅ Depende de DOMAIN
- ❌ NO depende de INFRASTRUCTURE o PRESENTATION
- ✅ Define interfaces que INFRASTRUCTURE implementa

### 3. 🔧 INFRASTRUCTURE (Detalles técnicos)
**src/infrastructure/** - Implementaciones concretas

- **persistence/firebase/** - Configuración de Firebase
- **persistence/repositories/** - Implementación de repositorios (FirebaseProductRepository)
- **http/** - APIs externas
- **auth/** - Implementación de autenticación

**Reglas:**
- ✅ Implementa las interfaces de DOMAIN y APPLICATION
- ✅ Aquí va Firebase, APIs, cualquier dependencia externa

### 4. 🎨 PRESENTATION (UI y componentes)
**src/presentation/** - Todo lo relacionado con Next.js y React

- **components/** - Componentes React
- **hooks/** - Custom hooks
- **pages/** - Rutas de Next.js (en src/app/)

**Reglas:**
- ✅ Solo llama a APPLICATION (use cases)
- ❌ NO accede directamente a INFRASTRUCTURE
- ✅ Solo se preocupa por UI

### 5. 🔄 SHARED (Código compartido)
**src/shared/** - Utilidades y código reutilizable en todas las capas

## Flujo de Datos

```
USER → PRESENTATION → APPLICATION → DOMAIN → APPLICATION → PRESENTATION → USER
           ↓              ↓            ↑
      (Components)   (Use Cases)   (Entities)
                         ↓            ↑
                   INFRASTRUCTURE
                    (Repositories)
                         ↓
                     Firebase
```

## Ejemplo Práctico

Crear un producto:

1. **Component** llama al hook `useCreateProduct()`
2. **Hook** ejecuta `CreateProductUseCase`
3. **Use Case** crea entidad `Product` con reglas de negocio
4. **Use Case** llama a `IProductRepository.save()`
5. **Infrastructure** `FirebaseProductRepository` guarda en Firebase
6. Respuesta regresa por las capas hasta el Component

## Ventajas de DDD

✅ **Testeable**: Domain no depende de nada externo
✅ **Escalable**: Fácil agregar nuevas features
✅ **Cambio de DB**: Solo cambias Infrastructure
✅ **Lógica centralizada**: Todo en Domain
✅ **Equipos grandes**: Cada capa puede trabajarse independiente
EOF

# ============================================
# VARIABLES DE ENTORNO
# ============================================

cat > .env.local << 'EOF'
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
EOF

# ============================================
# CONFIGURAR TAILWIND
# ============================================

cat > tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
EOF

# ============================================
# CONFIGURAR PACKAGE.JSON
# ============================================

cat > .npmrc << 'EOF'
# Configuración PNPM
shamefully-hoist=true
strict-peer-dependencies=false
EOF

# Agregar scripts útiles
cat > scripts_info.txt << 'EOF'
Agregar estos scripts a package.json:

"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "type-check": "tsc --noEmit",
  "clean": "rm -rf .next node_modules",
  "reinstall": "pnpm clean && pnpm install"
}
EOF

# ============================================
# GITIGNORE
# ============================================

cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# pnpm
pnpm-lock.yaml
