# 📦 Clase Completa: Lazy Loading y Suspense en React y Next.js

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [¿Qué es Lazy Loading?](#qué-es-lazy-loading)
3. [React.lazy()](#reactlazy)
4. [Suspense](#suspense)
5. [Dynamic Imports en Next.js](#dynamic-imports-en-nextjs)
6. [Ejemplos Prácticos](#ejemplos-prácticos)
7. [Mejores Prácticas](#mejores-prácticas)
8. [Patrones Avanzados](#patrones-avanzados)
9. [Performance y Optimización](#performance-y-optimización)
10. [Ejercicios](#ejercicios)

---

## Introducción

El **Lazy Loading** es una técnica de optimización que permite cargar componentes, rutas o recursos solo cuando son necesarios, en lugar de cargarlos todos al inicio de la aplicación. Esto mejora significativamente el rendimiento inicial y reduce el tamaño del bundle.

**Suspense** es un componente de React que permite manejar de manera declarativa el estado de carga de componentes lazy-loaded.

### Beneficios

- ✅ Menor tiempo de carga inicial
- ✅ Bundles más pequeños
- ✅ Mejor experiencia de usuario
- ✅ Ahorro de ancho de banda
- ✅ Mejor rendimiento en dispositivos móviles

---

## ¿Qué es Lazy Loading?

Lazy Loading es el proceso de postergar la carga de recursos no críticos en el momento de la carga de la página. En su lugar, estos recursos se cargan en el momento de necesidad.

### Sin Lazy Loading

```tsx
import HeavyComponent from './HeavyComponent';
import AnotherComponent from './AnotherComponent';
import Modal from './Modal';

function App() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div>
      <HeavyComponent />
      {showModal && <Modal />} {/* Se carga aunque no se use inicialmente */}
    </div>
  );
}
```

**Problema:** Todos los componentes se incluyen en el bundle inicial, incluso si no se usan inmediatamente.

### Con Lazy Loading

```tsx
import { lazy, Suspense, useState } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));
const Modal = lazy(() => import('./Modal'));

function App() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <HeavyComponent />
        {showModal && <Modal />}
      </Suspense>
    </div>
  );
}
```

**Solución:** Los componentes se cargan solo cuando se renderizan.

---

## React.lazy()

`React.lazy()` permite renderizar un import dinámico como un componente regular.

### Sintaxis Básica

```tsx
const ComponenteLazy = lazy(() => import('./Componente'));
```

### Requisitos

1. **Debe retornar una Promise** que resuelva un módulo con un export `default`
2. **Debe usarse dentro de un componente `<Suspense>`**

### Ejemplo Completo

```tsx
import { lazy, Suspense } from 'react';

// 1. Definir el componente lazy
const ProfilePage = lazy(() => import('./ProfilePage'));

// 2. Usarlo con Suspense
function App() {
  return (
    <div>
      <h1>Mi Aplicación</h1>
      <Suspense fallback={<div>Cargando perfil...</div>}>
        <ProfilePage />
      </Suspense>
    </div>
  );
}
```

### Named Exports

Si tu componente no es un export default, debes crear un módulo intermedio:

```tsx
// ComponenteOriginal.tsx
export const MiComponente = () => <div>Hola</div>;

// ComponenteWrapper.tsx
export { MiComponente as default } from './ComponenteOriginal';

// App.tsx
const MiComponente = lazy(() => import('./ComponenteWrapper'));
```

O también:

```tsx
const MiComponente = lazy(() => 
  import('./ComponenteOriginal').then(module => ({
    default: module.MiComponente
  }))
);
```

---

## Suspense

`Suspense` es un componente que muestra un fallback mientras sus hijos se están cargando.

### Sintaxis

```tsx
<Suspense fallback={<FallbackComponent />}>
  <ComponenteLazy />
</Suspense>
```

### Props

- **fallback**: Elemento React que se muestra mientras se carga el contenido

### Ejemplo: Múltiples Componentes Lazy

```tsx
function Dashboard() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Header />
      <Sidebar />
      <MainContent />
    </Suspense>
  );
}
```

### Suspense Anidados

Puedes anidar múltiples `Suspense` para controlar diferentes áreas de carga:

```tsx
function App() {
  return (
    <div>
      {/* Header con su propio loading */}
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>

      <main>
        {/* Contenido principal con su propio loading */}
        <Suspense fallback={<MainSkeleton />}>
          <MainContent />
          
          {/* Sidebar con loading independiente */}
          <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar />
          </Suspense>
        </Suspense>
      </main>
    </div>
  );
}
```

### Suspense con Error Boundaries

Combina `Suspense` con `ErrorBoundary` para manejo robusto:

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary 
      fallback={<ErrorMessage />}
      onError={(error) => console.error(error)}
    >
      <Suspense fallback={<Loading />}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

## Dynamic Imports en Next.js

Next.js proporciona `next/dynamic` para cargar componentes de manera lazy con soporte SSR.

### next/dynamic Básico

```tsx
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/HeavyComponent'));

export default function Page() {
  return (
    <div>
      <DynamicComponent />
    </div>
  );
}
```

### Con Custom Loading

```tsx
const DynamicComponent = dynamic(
  () => import('../components/HeavyComponent'),
  {
    loading: () => <p>Cargando componente...</p>,
  }
);
```

### Sin SSR

Útil para componentes que dependen del DOM del navegador:

```tsx
const MapComponent = dynamic(
  () => import('../components/Map'),
  { 
    ssr: false,
    loading: () => <p>Cargando mapa...</p>
  }
);
```

### Named Exports con next/dynamic

```tsx
const DynamicComponent = dynamic(
  () => import('../components/Components').then(mod => mod.SpecificComponent)
);
```

### Con Suspense en Next.js

```tsx
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(
  () => import('../components/HeavyComponent'),
  { suspense: true }
);

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <DynamicComponent />
    </Suspense>
  );
}
```

---

## Ejemplos Prácticos

### 1. Modal Lazy-Loaded

```tsx
'use client';

import { lazy, Suspense, useState } from 'react';

const Modal = lazy(() => import('@/components/Modal'));

export default function ProductPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <h1>Producto</h1>
      <button onClick={() => setShowModal(true)}>
        Ver detalles
      </button>

      {showModal && (
        <Suspense fallback={<div className="modal-loading">Cargando...</div>}>
          <Modal onClose={() => setShowModal(false)}>
            <h2>Detalles del Producto</h2>
            <p>Información detallada...</p>
          </Modal>
        </Suspense>
      )}
    </div>
  );
}
```

### 2. Tabs con Lazy Loading

```tsx
'use client';

import { lazy, Suspense, useState } from 'react';

const ProfileTab = lazy(() => import('./tabs/ProfileTab'));
const SettingsTab = lazy(() => import('./tabs/SettingsTab'));
const BillingTab = lazy(() => import('./tabs/BillingTab'));

const tabs = {
  profile: ProfileTab,
  settings: SettingsTab,
  billing: BillingTab,
};

export default function TabsContainer() {
  const [activeTab, setActiveTab] = useState<keyof typeof tabs>('profile');
  const ActiveComponent = tabs[activeTab];

  return (
    <div>
      <nav>
        <button onClick={() => setActiveTab('profile')}>Perfil</button>
        <button onClick={() => setActiveTab('settings')}>Ajustes</button>
        <button onClick={() => setActiveTab('billing')}>Facturación</button>
      </nav>

      <Suspense fallback={<TabSkeleton />}>
        <ActiveComponent />
      </Suspense>
    </div>
  );
}

function TabSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}
```

### 3. Chart Component (Next.js)

```tsx
'use client';

import dynamic from 'next/dynamic';

// Chart.js no funciona en SSR
const Chart = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false,
  loading: () => <ChartSkeleton />
});

export default function Analytics() {
  const data = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      label: 'Ventas',
      data: [12, 19, 3, 5, 2, 3],
    }]
  };

  return (
    <div>
      <h2>Análisis de Ventas</h2>
      <Chart data={data} />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="w-full h-64 bg-gray-100 animate-pulse rounded" />
  );
}
```

### 4. Editor de Código Lazy

```tsx
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(
  () => import('@monaco-editor/react'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-gray-900">
        <div className="text-white">Cargando editor...</div>
      </div>
    )
  }
);

export default function CodePage() {
  return (
    <div>
      <h1>Editor de Código</h1>
      <CodeEditor
        height="400px"
        defaultLanguage="javascript"
        defaultValue="// Escribe tu código aquí"
        theme="vs-dark"
      />
    </div>
  );
}
```

### 5. Infinite Scroll con Lazy Loading

```tsx
'use client';

import { lazy, Suspense, useState, useEffect } from 'react';

const ProductCard = lazy(() => import('./ProductCard'));

export default function ProductList() {
  const [products, setProducts] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Simular carga de productos
    const newProducts = Array.from({ length: 10 }, (_, i) => page * 10 + i);
    setProducts(prev => [...prev, ...newProducts]);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(id => (
        <Suspense key={id} fallback={<ProductSkeleton />}>
          <ProductCard productId={id} />
        </Suspense>
      ))}
    </div>
  );
}
```

### 6. Componente Condicional Lazy

```tsx
'use client';

import { lazy, Suspense } from 'react';

const AdminPanel = lazy(() => import('./AdminPanel'));
const UserPanel = lazy(() => import('./UserPanel'));

export default function Dashboard({ isAdmin }: { isAdmin: boolean }) {
  const Panel = isAdmin ? AdminPanel : UserPanel;

  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<PanelSkeleton />}>
        <Panel />
      </Suspense>
    </div>
  );
}
```

---

## Mejores Prácticas

### 1. Granularidad Apropiada

❌ **Demasiado granular:**
```tsx
const Button = lazy(() => import('./Button'));
const Input = lazy(() => import('./Input'));
const Label = lazy(() => import('./Label'));
```

✅ **Granularidad apropiada:**
```tsx
const ContactForm = lazy(() => import('./ContactForm'));
const Dashboard = lazy(() => import('./Dashboard'));
const AdminPanel = lazy(() => import('./AdminPanel'));
```

**Regla:** Solo usa lazy loading para componentes grandes o que no se usan en la carga inicial.

### 2. Preloading

Precarga componentes que probablemente se necesitarán:

```tsx
import { lazy, useState, useEffect } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Precargar el componente después de 2 segundos
    const timer = setTimeout(() => {
      import('./HeavyComponent');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <button onClick={() => setShow(true)}>Mostrar</button>
      {show && (
        <Suspense fallback={<Loading />}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
```

### 3. Prefetch en Hover

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const Modal = dynamic(() => import('./Modal'));

export default function Button() {
  const [showModal, setShowModal] = useState(false);
  const [prefetched, setPrefetched] = useState(false);

  const handleMouseEnter = () => {
    if (!prefetched) {
      import('./Modal');
      setPrefetched(true);
    }
  };

  return (
    <>
      <button 
        onMouseEnter={handleMouseEnter}
        onClick={() => setShowModal(true)}
      >
        Abrir Modal
      </button>
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </>
  );
}
```

### 4. Skeleton Screens

Usa skeleton screens en lugar de spinners:

```tsx
function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

<Suspense fallback={<ProductSkeleton />}>
  <Product />
</Suspense>
```

### 5. Route-Based Code Splitting

En Next.js, cada página automáticamente se divide en chunks:

```
app/
  dashboard/
    page.tsx       # Chunk automático
  profile/
    page.tsx       # Chunk automático
  settings/
    page.tsx       # Chunk automático
```

### 6. Manejo de Errores

```tsx
import { lazy, Suspense, Component, ReactNode } from 'react';

class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <ErrorBoundary fallback={<div>Error al cargar el componente</div>}>
      <Suspense fallback={<Loading />}>
        <HeavyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

## Patrones Avanzados

### 1. Lazy con Retry

```tsx
function lazyWithRetry(
  componentImport: () => Promise<any>,
  retries = 3,
  interval = 1000
) {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      const attemptImport = (retriesLeft: number) => {
        componentImport()
          .then(resolve)
          .catch((error) => {
            if (retriesLeft === 0) {
              reject(error);
              return;
            }
            setTimeout(() => {
              attemptImport(retriesLeft - 1);
            }, interval);
          });
      };
      attemptImport(retries);
    });
  });
}

// Uso
const HeavyComponent = lazyWithRetry(() => import('./HeavyComponent'));
```

### 2. Lazy con Timeout

```tsx
function lazyWithTimeout(
  componentImport: () => Promise<any>,
  timeout = 10000
) {
  return lazy(() => {
    return Promise.race([
      componentImport(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ]);
  });
}
```

### 3. Custom Suspense Hook

```tsx
import { useState, useEffect } from 'react';

function useSuspenseResource<T>(
  fetcher: () => Promise<T>
): T {
  const [resource, setResource] = useState<{
    status: 'pending' | 'success' | 'error';
    data?: T;
    error?: Error;
  }>({ status: 'pending' });

  useEffect(() => {
    fetcher()
      .then(data => setResource({ status: 'success', data }))
      .catch(error => setResource({ status: 'error', error }));
  }, []);

  if (resource.status === 'pending') {
    throw new Promise(() => {});
  }
  if (resource.status === 'error') {
    throw resource.error;
  }
  return resource.data!;
}

// Uso
function UserProfile() {
  const user = useSuspenseResource(() => 
    fetch('/api/user').then(r => r.json())
  );

  return <div>{user.name}</div>;
}

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile />
    </Suspense>
  );
}
```

### 4. Progressive Hydration

```tsx
'use client';

import { lazy, Suspense, useState, useEffect } from 'react';

const InteractiveMap = lazy(() => import('./InteractiveMap'));

export default function MapContainer() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <StaticMapPlaceholder />;
  }

  return (
    <Suspense fallback={<MapSkeleton />}>
      <InteractiveMap />
    </Suspense>
  );
}
```

### 5. Component Splitting por Viewport

```tsx
'use client';

import { lazy, Suspense, useState, useEffect, useRef } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export default function LazyOnView() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-screen">
      {isVisible ? (
        <Suspense fallback={<ComponentSkeleton />}>
          <HeavyComponent />
        </Suspense>
      ) : (
        <ComponentPlaceholder />
      )}
    </div>
  );
}
```

---

## Performance y Optimización

### 1. Bundle Analysis

Analiza tu bundle para identificar oportunidades de lazy loading:

```bash
# Next.js
npm run build
npx @next/bundle-analyzer
```

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // tu configuración
});
```

### 2. Métricas a Monitorear

```tsx
import { lazy, Suspense, useEffect } from 'react';

const HeavyComponent = lazy(() => {
  const start = performance.now();
  return import('./HeavyComponent').then(module => {
    const end = performance.now();
    console.log(`Component loaded in ${end - start}ms`);
    return module;
  });
});

function App() {
  useEffect(() => {
    // Medir First Contentful Paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('FCP:', entry.startTime);
      }
    });
    observer.observe({ entryTypes: ['paint'] });
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 3. Code Splitting Strategies

```tsx
// ❌ Todo en un componente grande
function Dashboard() {
  return (
    <>
      <Header />
      <Sidebar />
      <MainContent />
      <Charts />
      <Tables />
      <Modal />
    </>
  );
}

// ✅ Dividir estratégicamente
const Charts = lazy(() => import('./Charts'));
const Tables = lazy(() => import('./Tables'));
const Modal = lazy(() => import('./Modal'));

function Dashboard() {
  return (
    <>
      <Header />
      <Sidebar />
      <MainContent />
      
      <Suspense fallback={<ChartsSkeleton />}>
        <Charts />
      </Suspense>
      
      <Suspense fallback={<TablesSkeleton />}>
        <Tables />
      </Suspense>
      
      {showModal && (
        <Suspense fallback={null}>
          <Modal />
        </Suspense>
      )}
    </>
  );
}
```

### 4. Webpack Magic Comments

```tsx
// Prefetch: Carga cuando el navegador esté idle
const Component = lazy(() => 
  import(/* webpackPrefetch: true */ './Component')
);

// Preload: Carga inmediatamente en paralelo
const Component = lazy(() => 
  import(/* webpackPreload: true */ './Component')
);

// Chunk name personalizado
const Component = lazy(() => 
  import(/* webpackChunkName: "my-component" */ './Component')
);
```

---

## Ejercicios

### Ejercicio 1: Modal con Lazy Loading

Crea un componente de modal que:
- Se cargue lazy
- Tenga un skeleton mientras carga
- Maneje errores de carga
- Se pueda abrir/cerrar

<details>
<summary>Ver Solución</summary>

```tsx
'use client';

import { lazy, Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const Modal = lazy(() => import('./Modal'));

function ModalSkeleton() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}

export default function ModalContainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Abrir Modal
      </button>

      {isOpen && (
        <ErrorBoundary 
          fallback={<div>Error al cargar el modal</div>}
          onReset={() => setIsOpen(false)}
        >
          <Suspense fallback={<ModalSkeleton />}>
            <Modal onClose={() => setIsOpen(false)} />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}
```

</details>

### Ejercicio 2: Dashboard con Widgets Lazy

Crea un dashboard con 4 widgets que se carguen de forma lazy e independiente.

<details>
<summary>Ver Solución</summary>

```tsx
'use client';

import { lazy, Suspense } from 'react';

const SalesWidget = lazy(() => import('./widgets/SalesWidget'));
const UsersWidget = lazy(() => import('./widgets/UsersWidget'));
const RevenueWidget = lazy(() => import('./widgets/RevenueWidget'));
const TasksWidget = lazy(() => import('./widgets/TasksWidget'));

function WidgetSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-4"></div>
      <div className="h-24 bg-gray-200 rounded"></div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-6">
        <Suspense fallback={<WidgetSkeleton />}>
          <SalesWidget />
        </Suspense>
        
        <Suspense fallback={<WidgetSkeleton />}>
          <UsersWidget />
        </Suspense>
        
        <Suspense fallback={<WidgetSkeleton />}>
          <RevenueWidget />
        </Suspense>
        
        <Suspense fallback={<WidgetSkeleton />}>
          <TasksWidget />
        </Suspense>
      </div>
    </div>
  );
}
```

</details>

### Ejercicio 3: Imagen Lazy con Blur

Implementa un componente de imagen que se cargue lazy con efecto blur.

<details>
<summary>Ver Solución</summary>

```tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LazyImage({ 
  src, 
  alt, 
  width, 
  height 
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    const element = document.getElementById(`img-${src}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [src]);

  return (
    <div 
      id={`img-${src}`}
      className="relative overflow-hidden"
      style={{ width, height }}
    >
      {isInView && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          className={`transition-all duration-500 ${
            isLoaded ? 'blur-0 scale-100' : 'blur-lg scale-110'
          }`}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
```

</details>

### Ejercicio 4: Router con Lazy Loading

Crea un sistema de routing simple con lazy loading.

<details>
<summary>Ver Solución</summary>

```tsx
'use client';

import { lazy, Suspense, useState } from 'react';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Products = lazy(() => import('./pages/Products'));

const routes = {
  home: Home,
  about: About,
  contact: Contact,
  products: Products,
};

function PageSkeleton() {
  return (
    <div className="animate-pulse p-6">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  );
}

export default function Router() {
  const [currentRoute, setCurrentRoute] = useState<keyof typeof routes>('home');
  const CurrentPage = routes[currentRoute];

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4">
        <button onClick={() => setCurrentRoute('home')} className="mr-4">
          Home
        </button>
        <button onClick={() => setCurrentRoute('about')} className="mr-4">
          About
        </button>
        <button onClick={() => setCurrentRoute('contact')} className="mr-4">
          Contact
        </button>
        <button onClick={() => setCurrentRoute('products')}>
          Products
        </button>
      </nav>

      <main>
        <Suspense fallback={<PageSkeleton />}>
          <CurrentPage />
        </Suspense>
      </main>
    </div>
  );
}
```

</details>

---

## Resumen

### Puntos Clave

1. **Lazy Loading** mejora el rendimiento inicial al cargar componentes bajo demanda
2. **React.lazy()** permite imports dinámicos de componentes
3. **Suspense** maneja el estado de carga de forma declarativa
4. **next/dynamic** proporciona lazy loading con soporte SSR en Next.js
5. Usa **skeleton screens** para mejor UX
6. Implementa **error boundaries** para manejo robusto de errores
7. **Preload** componentes que probablemente se necesitarán
8. Analiza tu **bundle** para identificar oportunidades de optimización

### Cuándo Usar Lazy Loading

✅ **Usar cuando:**
- Componentes grandes o pesados
- Modales o overlays
- Rutas/páginas diferentes
- Componentes condicionales
- Bibliotecas pesadas (charts, editores, mapas)
- Below-the-fold content

❌ **No usar cuando:**
- Componentes pequeños
- Componentes críticos para la carga inicial
- Componentes simples de UI

---

## Recursos Adicionales

- [React Docs - Suspense](https://react.dev/reference/react/Suspense)
- [React Docs - lazy](https://react.dev/reference/react/lazy)
- [Next.js Docs - Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Web.dev - Code Splitting](https://web.dev/code-splitting/)
- [Webpack - Code Splitting](https://webpack.js.org/guides/code-splitting/)

---

**¡Felicitaciones!** 🎉 Ahora dominas Lazy Loading y Suspense en React y Next.js.
