# Clase: Paginación _server-side_ en Next.js (App Router) + MongoDB + HeroUI

Esta guía asume un proyecto Next.js creado con **create-next-app** que usa:

- Carpeta raíz `src/`
- App Router en `src/app`
- TypeScript


---

## 1. Objetivo

Montar un listado de **productos** con:

- **Paginación del lado del servidor** usando MongoDB.
- Filtros por parámetros (`q`, `category`, rango de precios).
- Parámetros de paginación en la URL:
  - `page` → número de página
  - `perPage` → elementos por página
- Un componente de paginación en el front con **HeroUI** (`@heroui/react`).

---

## 2. Estructura de carpetas propuesta (estilo `taskload`)

Partiendo de algo así:

```txt
taskload/
  public/
  src/
    app/
      layout.tsx
      page.tsx
    ...
  package.json
  tsconfig.json
  ...
```

La idea es añadir:

```txt
src/
  app/
    products/
      page.tsx
      ProductsGrid.tsx
      PaginationControls.tsx
  lib/
    db.ts
    products.ts
  models/
    Product.ts
```

---

## 3. Conexión a MongoDB (`src/lib/db.ts`)

Crea el archivo:

```ts
// src/lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Define MONGODB_URI en tu archivo .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached = (global as any).mongoose as MongooseCache;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
```

En `.env.local`:

```bash
MONGODB_URI=mongodb+srv://usuario:password@cluster/dbname
```

---

## 4. Modelo de Producto (`src/models/Product.ts`)

```ts
// src/models/Product.ts
import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    // agrega campos que uses en tu proyecto
  },
  { timestamps: true }
);

export const Product =
  models.Product || model("Product", ProductSchema);
```

---

## 5. Lógica de paginación y filtros (`src/lib/products.ts`)

**Explicación de operaciones MongoDB para paginación:**

1. **`query`**: Objeto MongoDB con filtros (búsqueda, categoría, rango de precios)
2. **`skip`**: Salta N documentos. Fórmula: `(página - 1) × límite`
   - Página 1: skip = 0 (empieza desde doc 0)
   - Página 2: skip = 12 (empieza desde doc 12)
   - Página 3: skip = 24 (empieza desde doc 24)
3. **`limit`**: Retorna máximo N documentos por página
4. **`countDocuments(query)`**: Cuenta total de documentos que coinciden el filtro (no afectado por skip/limit)
5. **`totalPages`**: Se calcula como `Math.ceil(totalItems / limit)`

```ts
// src/lib/products.ts
import { connectDB } from "./db";
import { Product } from "@/models/Product";

export type ProductFilters = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  perPage?: number;
};

export async function getProducts(filters: ProductFilters) {
  await connectDB();

  const {
    search,
    category,
    minPrice,
    maxPrice,
    page = 1,
    perPage = 12,
  } = filters;

  // 1. CONSTRUCCIÓN DEL QUERY
  const query: any = {};

  if (search) {
    // Búsqueda case-insensitive con expresión regular
    query.name = { $regex: search, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  if (minPrice != null || maxPrice != null) {
    query.price = {};
    if (minPrice != null) query.price.$gte = minPrice; // mayor o igual
    if (maxPrice != null) query.price.$lte = maxPrice; // menor o igual
  }

  // 2. VALIDACIÓN Y CÁLCULO DE PARÁMETROS
  const currentPage = Math.max(1, page); // asegura que sea >= 1
  const limit = Math.min(Math.max(1, perPage), 100); // entre 1 y 100
  const skip = (currentPage - 1) * limit; // documentos a saltar

  // 3. EJECUCIÓN DE DOS QUERIES EN PARALELO
  const [items, totalItems] = await Promise.all([
    // Query 1: obtiene los documentos de la página actual
    Product.find(query)
      .sort({ createdAt: -1 }) // ordenar por fecha descendente
      .skip(skip) // salta documentos
      .limit(limit) // retorna máximo N documentos
      .lean(), // optimización: retorna objeto plano, no Mongoose doc
    
    // Query 2: cuenta total de documentos que cumplen el filtro
    Product.countDocuments(query),
  ]);

  // 4. CÁLCULO DE METADATOS
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    items: JSON.parse(JSON.stringify(items)), // serialización para Next.js
    pagination: {
      page: currentPage,
      perPage: limit,
      totalItems, // ej: 150
      totalPages, // ej: 13 (150 / 12 = 12.5 → Math.ceil = 13)
      hasNextPage: currentPage < totalPages, // true si no es última página
      hasPrevPage: currentPage > 1, // true si no es primera página
    },
  };
}
```

### Ejemplo de operaciones en MongoDB:
```
Total items: 150, perPage: 12

Página 1: skip=0,  limit=12 → items 1-12
Página 2: skip=12, limit=12 → items 13-24
Página 3: skip=24, limit=12 → items 25-36
...
Página 13: skip=144, limit=12 → items 145-150

totalPages = Math.ceil(150 / 12) = 13
```

---

## 6. Página de productos (Server Component)  
`src/app/products/page.tsx`

Esta página:

- Lee `searchParams` desde la URL (App Router).
- Llama a `getProducts`.
- Pasa datos a la grid y a la paginación.

```tsx
// src/app/products/page.tsx
import { getProducts } from "@/lib/products";
import { ProductsGrid } from "./ProductsGrid";
import { PaginationControls } from "./PaginationControls";

type ProductsPageProps = {
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    perPage?: string;
  };
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    page = "1",
    perPage = "12",
  } = searchParams;

  const { items, pagination } = await getProducts({
    search: q,
    category,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    page: Number(page),
    perPage: Number(perPage),
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">
          Listado de productos
        </h1>
        {/* Aquí puedes colocar un formulario de filtros */}
      </header>

      <ProductsGrid products={items} />

      <PaginationControls
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}
```

---

## 7. Grid de productos (`src/app/products/ProductsGrid.tsx`)

```tsx
// src/app/products/ProductsGrid.tsx
type Product = {
  _id: string;
  name: string;
  price: number;
  category?: string;
};

type ProductsGridProps = {
  products: Product[];
};

export function ProductsGrid({ products }: ProductsGridProps) {
  if (!products.length) {
    return <p>No hay productos para mostrar.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {products.map((product) => (
        <article
          key={product._id}
          className="rounded-xl border p-4 shadow-sm"
        >
          <h2 className="font-semibold">{product.name}</h2>
          {product.category && (
            <p className="text-sm text-gray-500">
              {product.category}
            </p>
          )}
          <p className="mt-2 text-lg font-bold">
            ${product.price.toFixed(2)}
          </p>
        </article>
      ))}
    </div>
  );
}
```

---

## 8. Paginación con HeroUI  
`src/app/products/PaginationControls.tsx`

### 8.1. Instalar HeroUI

En el proyecto (en la raíz del repo tipo `taskload`):

```bash
npm install @heroui/react
# o
yarn add @heroui/react
```

Configura HeroUI según la doc oficial (ThemeProvider, Tailwind, etc.).  
Luego crea el componente:

```tsx
// src/app/products/PaginationControls.tsx
"use client";

import { Pagination } from "@heroui/react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
};

export function PaginationControls({
  currentPage,
  totalPages,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handleChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-center py-4">
      <Pagination
        total={totalPages}
        page={currentPage}
        onChange={handleChange}
        showControls
        isCompact
      />
    </div>
  );
}
```

**Flujo:**

- El usuario cambia de página en el componente HeroUI.
- `handleChange` actualiza `?page=N` en la URL.
- Next.js vuelve a renderizar `src/app/products/page.tsx` en el servidor con los nuevos `searchParams`.
- Se ejecuta de nuevo `getProducts` con la página correcta.

---

## 9. Ejemplos de URLs

En tu proyecto tipo `taskload`, una vez montada la ruta `/products`, puedes probar:

```txt
/products
/products?page=2
/products?page=3&perPage=24
/products?q=iphone&page=2&perPage=8
/products?category=laptops&minPrice=500&maxPrice=1500&page=1
```

---

## 10. Endpoint opcional `/api/products` dentro de `src/app`

Si quieres un endpoint REST para reutilizar la lógica:

```ts
// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q") || undefined;
  const category = searchParams.get("category") || undefined;
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("perPage") || "12";

  const result = await getProducts({
    search: q,
    category,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    page: Number(page),
    perPage: Number(perPage),
  });

  return NextResponse.json(result);
}
```

Esto encaja bien con la estructura `src/app/api/...` que ya trae un proyecto Next moderno.

---

## 11. Resumen mental para usarlo en un proyecto tipo `taskload`

1. **Estructura:** usa `src/` (como en `taskload`) y crea:
   - `src/lib/db.ts`
   - `src/lib/products.ts`
   - `src/models/Product.ts`
   - `src/app/products/...`
2. **Server-side:** la lógica pesada (query a Mongo + paginación) vive en `getProducts`.
3. **URL como _source of truth_:** `page`, `perPage`, `q`, `category`, etc. viven en `searchParams`.
4. **HeroUI:** `<Pagination />` solo modifica los search params de la URL; el servidor se encarga de todo lo demás.
5. **Resultado:** paginación **SEO-friendly**, limpia y alineada con la arquitectura de un proyecto como `taskload`.
