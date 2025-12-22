# Preguntas Frecuentes sobre React y Entrevistas de Trabajo

## Tabla de Contenidos
1. [Conceptos Básicos de React](#conceptos-básicos-de-react)
2. [Hooks](#hooks)
3. [State Management](#state-management)
4. [Performance y Optimización](#performance-y-optimización)
5. [Patrones de Diseño](#patrones-de-diseño)
6. [Preguntas de Entrevista Técnicas](#preguntas-de-entrevista-técnicas)
7. [Preguntas de Código en Entrevistas](#preguntas-de-código-en-entrevistas)

---

## Conceptos Básicos de React

### 1. ¿Qué es React?
**Respuesta:** React es una biblioteca de JavaScript de código abierto desarrollada por Facebook para construir interfaces de usuario, especialmente para aplicaciones de una sola página (SPA). Se enfoca en crear componentes reutilizables que gestionan su propio estado.

### 2. ¿Qué es JSX?
**Respuesta:** JSX (JavaScript XML) es una extensión de sintaxis para JavaScript que permite escribir HTML dentro de JavaScript. React lo convierte en llamadas a `React.createElement()`.

```jsx
// JSX
const element = <h1>Hola Mundo</h1>;

// Se convierte en:
const element = React.createElement('h1', null, 'Hola Mundo');
```

### 3. ¿Qué es el Virtual DOM?
**Respuesta:** El Virtual DOM es una representación ligera del DOM real en memoria. React mantiene una copia del DOM en memoria y cuando hay cambios:
1. Actualiza el Virtual DOM
2. Compara el Virtual DOM con su versión anterior (diffing)
3. Actualiza solo los elementos que cambiaron en el DOM real (reconciliation)

Esto hace que las actualizaciones sean más eficientes.

### 4. ¿Cuál es la diferencia entre componentes funcionales y de clase?
**Respuesta:**

**Componentes de Clase:**
```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

**Componentes Funcionales:**
```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Los componentes funcionales son más simples, tienen mejor rendimiento y con Hooks pueden manejar estado y efectos secundarios.

### 5. ¿Qué son las props?
**Respuesta:** Props (propiedades) son argumentos que se pasan de un componente padre a un componente hijo. Son inmutables y de solo lectura.

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

<Welcome name="Sara" />
```

### 6. ¿Qué es el state?
**Respuesta:** El state es un objeto que contiene datos que pueden cambiar durante el ciclo de vida del componente. A diferencia de props, el state es mutable y privado del componente.

```jsx
const [count, setCount] = useState(0);
```

### 7. ¿Cuál es la diferencia entre state y props?
**Respuesta:**
- **Props:** Son inmutables, se pasan de padre a hijo, se leen solamente
- **State:** Es mutable, es privado del componente, se puede actualizar con setState/useState

### 8. ¿Qué es el "one-way data flow"?
**Respuesta:** React usa un flujo de datos unidireccional (de arriba hacia abajo). Los datos fluyen del componente padre al hijo a través de props. Los hijos no pueden modificar directamente las props del padre.

### 9. ¿Qué son los keys en React?
**Respuesta:** Keys son identificadores únicos que ayudan a React a identificar qué elementos han cambiado, sido agregados o eliminados en una lista.

```jsx
const items = data.map((item) => (
  <li key={item.id}>{item.name}</li>
));
```

**Importante:** No usar índices como keys si el orden puede cambiar.

### 10. ¿Qué es el prop drilling?
**Respuesta:** Prop drilling es el proceso de pasar props a través de múltiples niveles de componentes intermedios que no los necesitan, solo para llegar al componente que sí los necesita.

**Soluciones:** Context API, Redux, Zustand, o composition.

---

## Hooks

### 11. ¿Qué son los Hooks?
**Respuesta:** Los Hooks son funciones especiales que permiten usar características de React (state, lifecycle, context) en componentes funcionales. Se introdujeron en React 16.8.

### 12. ¿Cuáles son las reglas de los Hooks?
**Respuesta:**
1. **Solo llamar Hooks en el nivel superior:** No dentro de loops, condiciones o funciones anidadas
2. **Solo llamar Hooks desde componentes funcionales o custom hooks**

```jsx
// ❌ Incorrecto
if (condition) {
  const [state, setState] = useState(0);
}

// ✅ Correcto
const [state, setState] = useState(0);
if (condition) {
  setState(newValue);
}
```

### 13. ¿Qué hace useState?
**Respuesta:** `useState` permite agregar estado local a un componente funcional.

```jsx
const [count, setCount] = useState(0);
// count: valor actual
// setCount: función para actualizar el valor
// 0: valor inicial
```

### 14. ¿Qué hace useEffect?
**Respuesta:** `useEffect` permite realizar efectos secundarios (side effects) como llamadas a APIs, suscripciones, o manipulación del DOM.

```jsx
useEffect(() => {
  // Código del efecto
  document.title = `Clicked ${count} times`;
  
  // Cleanup (opcional)
  return () => {
    // Limpieza al desmontar o antes de re-ejecutar
  };
}, [count]); // Array de dependencias
```

### 15. ¿Qué es el array de dependencias en useEffect?
**Respuesta:**
- **Sin array:** Se ejecuta después de cada render
- **Array vacío []:** Se ejecuta solo una vez (al montar)
- **[dep1, dep2]:** Se ejecuta cuando cambian las dependencias

```jsx
useEffect(() => { /* cada render */ });
useEffect(() => { /* solo al montar */ }, []);
useEffect(() => { /* cuando count cambia */ }, [count]);
```

### 16. ¿Qué hace useContext?
**Respuesta:** `useContext` permite consumir un contexto (estado global de la aplicación) sin necesidad de un Consumer. Es útil para compartir datos entre múltiples componentes sin prop drilling.

**Requiere:**
1. Crear un contexto con `createContext`
2. Envolver componentes con un `Provider` que suministre el valor
3. Consumir el contexto con `useContext` en cualquier componente hijo

```jsx
// 1. Crear el contexto
const ThemeContext = React.createContext('light');

// 2. Proveer el valor con Provider (en componente padre)
function App() {
  const [theme, setTheme] = useState('dark');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 3. Consumir el contexto con useContext (en componente hijo)
function Toolbar() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <div className={theme}>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
    </div>
  );
}
```

**Ventajas:** Evita prop drilling, estado accesible globalmente.
**Desventajas:** Todos los componentes que consumen el contexto se re-renderizan cuando cambia.

### 17. ¿Qué hace useRef?
**Respuesta:** `useRef` crea una referencia mutable que persiste durante todo el ciclo de vida del componente.

**Usos comunes:**
1. Acceder a elementos del DOM
2. Guardar valores mutables sin causar re-renders

```jsx
const inputRef = useRef(null);

const focusInput = () => {
  inputRef.current.focus();
};

return <input ref={inputRef} />;
```

### 18. ¿Qué hace useMemo?
**Respuesta:** `useMemo` memoriza el resultado de un cálculo costoso y solo lo recalcula cuando cambian sus dependencias.

```jsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

### 19. ¿Qué hace useCallback?
**Respuesta:** `useCallback` memoriza una función y solo la recrea cuando cambian sus dependencias.

```jsx
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### 20. ¿Cuál es la diferencia entre useMemo y useCallback?
**Respuesta:**
- **useMemo:** Memoriza el **valor de retorno** de una función
- **useCallback:** Memoriza la **función misma**

```jsx
const memoizedValue = useMemo(() => computeValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);

// useCallback(fn, deps) es equivalente a useMemo(() => fn, deps)
```

### 21. ¿Qué hace useReducer?
**Respuesta:** `useReducer` es una alternativa a `useState` para manejar lógica de estado compleja.

```jsx
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'increment' });
```

### 22. ¿Qué es un Custom Hook?
**Respuesta:** Un Custom Hook es una función JavaScript que usa otros Hooks y permite reutilizar lógica con estado entre componentes.

```jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

---

## State Management

### 23. ¿Qué es Context API?
**Respuesta:** Context API es una forma de pasar datos a través del árbol de componentes sin tener que pasar props manualmente en cada nivel.

```jsx
const ThemeContext = React.createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return <ThemedButton />;
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Button</button>;
}
```

### 24. ¿Cuándo usar Context vs Redux?
**Respuesta:**

**Context API:**
- Datos que no cambian frecuentemente
- Proyectos pequeños a medianos
- Compartir datos simples (tema, auth, idioma)

**Redux/Zustand:**
- Estado complejo y cambiante
- Necesitas debugging avanzado (DevTools)
- Estado global grande
- Múltiples componentes modifican el estado

### 25. ¿Qué es Redux?
**Respuesta:** Redux es una biblioteca de gestión de estado predecible para JavaScript. Usa un patrón de flujo unidireccional con:
- **Store:** Contiene todo el estado
- **Actions:** Describen qué pasó
- **Reducers:** Especifican cómo cambia el estado

### 26. ¿Qué es Zustand?
**Respuesta:** Zustand es una biblioteca de gestión de estado minimalista y rápida. Es más simple que Redux y no requiere providers.

```jsx
import create from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}
```

---

## Performance y Optimización

### 27. ¿Qué es React.memo?
**Respuesta:** `React.memo` es un HOC (Higher Order Component) que memoriza un componente y solo lo re-renderiza si sus props cambian.

```jsx
const MyComponent = React.memo(function MyComponent(props) {
  return <div>{props.value}</div>;
});
```

### 28. ¿Cuándo usar React.memo?
**Respuesta:**
- Componentes que renderizan frecuentemente con las mismas props
- Componentes que renderizan contenido costoso
- No usar en componentes pequeños o que siempre tienen props diferentes

### 29. ¿Qué es Code Splitting?
**Respuesta:** Code Splitting es la técnica de dividir el código en chunks más pequeños que se cargan bajo demanda.

```jsx
import React, { lazy, Suspense } from 'react';

const OtherComponent = lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherComponent />
    </Suspense>
  );
}
```

### 30. ¿Qué es Lazy Loading?
**Respuesta:** Lazy Loading es cargar componentes solo cuando se necesitan, no al inicio de la aplicación.

```jsx
const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
```

### 31. ¿Cómo optimizar renders innecesarios?
**Respuesta:**
1. Usar `React.memo` para componentes
2. Usar `useMemo` para valores calculados
3. Usar `useCallback` para funciones
4. Levantar el estado solo cuando sea necesario
5. Dividir componentes grandes
6. Usar keys apropiadas en listas

---

## Patrones de Diseño

### 32. ¿Qué es el patrón Render Props?
**Respuesta:** Render Props es un patrón donde un componente recibe una función como prop que retorna un elemento React.

```jsx
<DataProvider render={data => (
  <h1>Hello {data.name}</h1>
)}/>
```

### 33. ¿Qué son los Higher-Order Components (HOC)?
**Respuesta:** Un HOC es una función que toma un componente y retorna un nuevo componente con funcionalidad adicional.

```jsx
function withLogger(Component) {
  return function WrappedComponent(props) {
    useEffect(() => {
      console.log('Component mounted');
    }, []);
    
    return <Component {...props} />;
  };
}

const EnhancedComponent = withLogger(MyComponent);
```

### 34. ¿Qué es el patrón Compound Components?
**Respuesta:** Permite crear componentes que trabajan juntos compartiendo estado implícito.

```jsx
<Menu>
  <Menu.Button>Options</Menu.Button>
  <Menu.Items>
    <Menu.Item>Item 1</Menu.Item>
    <Menu.Item>Item 2</Menu.Item>
  </Menu.Items>
</Menu>
```

### 35. ¿Qué es Composition vs Inheritance?
**Respuesta:** React favorece la composición sobre la herencia. En lugar de heredar de componentes, se componen componentes juntos.

```jsx
// Composición
function Dialog(props) {
  return (
    <div className="dialog">
      {props.children}
    </div>
  );
}

function WelcomeDialog() {
  return (
    <Dialog>
      <h1>Welcome</h1>
      <p>Thank you!</p>
    </Dialog>
  );
}
```

---

## Preguntas de Entrevista Técnicas

### 36. ¿Qué es el ciclo de vida de un componente?
**Respuesta:** El ciclo de vida de un componente tiene tres fases principales:

**1. Montaje (Mounting):**
- constructor
- render
- componentDidMount / useEffect(() => {}, [])

**2. Actualización (Updating):**
- render
- componentDidUpdate / useEffect(() => {})

**3. Desmontaje (Unmounting):**
- componentWillUnmount / useEffect cleanup

```jsx
useEffect(() => {
  // componentDidMount
  console.log('Component mounted');
  
  return () => {
    // componentWillUnmount
    console.log('Component unmounted');
  };
}, []);
```

### 37. ¿Qué es Reconciliation?
**Respuesta:** Reconciliation es el proceso por el cual React actualiza el DOM. React compara el Virtual DOM nuevo con el anterior y calcula la forma más eficiente de actualizar el DOM real.

**Algoritmo:**
1. Compara elementos del mismo tipo
2. Usa keys para identificar elementos en listas
3. Actualiza solo lo necesario

### 38. ¿Qué es React Fiber?
**Respuesta:** React Fiber es la reimplementación del algoritmo de reconciliación de React. Permite:
- Pausar, abortar o reutilizar trabajo
- Asignar prioridad a diferentes tipos de actualizaciones
- Renderizado concurrente

### 39. ¿Qué son los Portals?
**Respuesta:** Portals permiten renderizar componentes hijos en un nodo DOM que existe fuera de la jerarquía del componente padre.

```jsx
import ReactDOM from 'react-dom';

function Modal({ children }) {
  return ReactDOM.createPortal(
    children,
    document.getElementById('modal-root')
  );
}
```

### 40. ¿Qué son los Error Boundaries?
**Respuesta:** Error Boundaries son componentes que capturan errores de JavaScript en cualquier parte de su árbol de componentes hijo.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

### 41. ¿Qué es el Strict Mode?
**Respuesta:** Strict Mode es una herramienta para destacar problemas potenciales en la aplicación.

```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

**Hace:**
- Identifica componentes con ciclos de vida inseguros
- Advierte sobre el uso de APIs deprecadas
- Detecta efectos secundarios inesperados

### 42. ¿Qué es Suspense?
**Respuesta:** Suspense permite "esperar" a que algo cargue antes de renderizar.

```jsx
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

### 43. ¿Qué es Server Side Rendering (SSR)?
**Respuesta:** SSR es renderizar componentes React en el servidor y enviar HTML al cliente. Ventajas:
- Mejor SEO
- Carga inicial más rápida
- Mejor rendimiento percibido

**Frameworks:** Next.js, Remix

### 44. ¿Qué es Static Site Generation (SSG)?
**Respuesta:** SSG genera páginas HTML en tiempo de build, no en cada request.

```jsx
// Next.js
export async function getStaticProps() {
  return {
    props: {
      data: fetchData()
    }
  };
}
```

### 45. ¿Qué es Hydration?
**Respuesta:** Hydration es el proceso de adjuntar event listeners al HTML estático que fue pre-renderizado en el servidor.

---

## Preguntas de Código en Entrevistas

### 46. Implementa un contador con useState

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### 47. Implementa un fetch de datos con useEffect

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 48. Implementa un debounce en un input de búsqueda

```jsx
function SearchInput() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      // Realizar búsqueda
      console.log('Searching for:', debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### 49. Crea un custom hook para localStorage

```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

// Uso
function App() {
  const [name, setName] = useLocalStorage('name', 'John');
  
  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
```

### 50. Implementa un toggle personalizado

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  return [value, toggle];
}

// Uso
function ToggleComponent() {
  const [isOn, toggle] = useToggle(false);

  return (
    <div>
      <p>{isOn ? 'ON' : 'OFF'}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```

### 51. Implementa un componente de paginación

```jsx
function Pagination({ totalPages, currentPage, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? 'active' : ''}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

// Uso
function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  return (
    <Pagination
      totalPages={10}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
}
```

### 52. Implementa un formulario controlado

```jsx
function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      // Enviar datos
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      {errors.name && <span>{errors.name}</span>}
      
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email}</span>}
      
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      {errors.password && <span>{errors.password}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### 53. Implementa un infinite scroll

```jsx
function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/items?page=${page}`);
      const newItems = await response.json();
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 100
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>{item.name}</div>
      ))}
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more items</p>}
    </div>
  );
}
```

### 54. Implementa un modal reutilizable

```jsx
function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}

// Uso
function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Modal Title</h2>
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}
```

### 55. Implementa un hook para detectar clicks fuera de un elemento

```jsx
function useClickOutside(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}

// Uso
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => {
    if (isOpen) setIsOpen(false);
  });

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle Dropdown
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <div>Option 1</div>
          <div>Option 2</div>
          <div>Option 3</div>
        </div>
      )}
    </div>
  );
}
```

---

## Preguntas Avanzadas

### 56. ¿Qué es Concurrent Mode?
**Respuesta:** Concurrent Mode permite a React interrumpir renderizados de baja prioridad para manejar actualizaciones urgentes. Hace que las aplicaciones sean más responsivas.

### 57. ¿Qué son los Server Components?
**Respuesta:** Server Components son componentes que se renderizan en el servidor y se envían al cliente como HTML. No incluyen JavaScript del lado del cliente.

### 58. ¿Qué diferencia hay entre useLayoutEffect y useEffect?
**Respuesta:**
- **useEffect:** Se ejecuta después de que el navegador pinta
- **useLayoutEffect:** Se ejecuta síncronamente después de todas las mutaciones del DOM pero antes de que el navegador pinte

Usa `useLayoutEffect` cuando necesites leer el layout del DOM o hacer mutaciones síncronas.

### 59. ¿Cómo optimizar el rendimiento de una aplicación React grande?
**Respuesta:**
1. Code splitting y lazy loading
2. React.memo, useMemo, useCallback
3. Virtualización de listas (react-window, react-virtualized)
4. Optimización de imágenes
5. Memoización de datos con cachés
6. Reducir el tamaño del bundle
7. Server Side Rendering
8. Web Workers para operaciones pesadas

### 60. ¿Qué herramientas usas para debugging en React?
**Respuesta:**
- **React DevTools:** Inspeccionar componentes y props
- **Redux DevTools:** Ver actions y estado
- **Console.log y debugger**
- **React Profiler:** Medir rendimiento
- **Error Boundaries:** Capturar errores
- **Source maps:** Para debugging de código minificado

---

## Consejos para Entrevistas

1. **Practica código en vivo:** Estar cómodo escribiendo código sin IDE completo
2. **Explica tu pensamiento:** Habla mientras codificas
3. **Conoce los fundamentals:** JSX, Virtual DOM, reconciliation
4. **Entiende Hooks profundamente:** Son el estándar actual
5. **Practica optimización:** Es un tema común en entrevistas senior
6. **Conoce el ecosistema:** Next.js, TypeScript, testing libraries
7. **Lee la documentación oficial:** react.dev tiene excelentes recursos
8. **Construye proyectos:** La práctica es clave

---

## Recursos Adicionales

- [Documentación Oficial de React](https://react.dev)
- [React Patterns](https://reactpatterns.com)
- [React Interview Questions en GitHub](https://github.com/sudheerj/reactjs-interview-questions)
- [Overreacted by Dan Abramov](https://overreacted.io)
- [Kent C. Dodds Blog](https://kentcdodds.com/blog)
