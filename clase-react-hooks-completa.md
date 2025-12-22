# Clase Completa: React Hooks y Ciclo de Vida de Componentes

## Índice
1. [useState](#1-usestate)
2. [useEffect](#2-useeffect)
3. [Ciclo de Vida de un Componente](#3-ciclo-de-vida-de-un-componente)
4. [useRef](#4-useref)
5. [useContext](#5-usecontext)
6. [Ejemplos Prácticos](#6-ejemplos-prácticos)

---

## 1. useState

### ¿Qué es?
`useState` es un Hook que te permite agregar estado local a componentes funcionales.

### Sintaxis Básica
```typescript
const [estado, setEstado] = useState(valorInicial);
```

### Características
- **estado**: El valor actual del estado
- **setEstado**: Función para actualizar el estado
- **valorInicial**: Valor con el que se inicializa el estado

### Ejemplos

#### Ejemplo Básico
```typescript
import { useState } from 'react';

function Contador() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
      <button onClick={() => setCount(count - 1)}>Decrementar</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

#### Múltiples Estados
```typescript
function Formulario() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ nombre, email, edad });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={nombre} 
        onChange={(e) => setNombre(e.target.value)} 
        placeholder="Nombre"
      />
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email"
      />
      <input 
        type="number"
        value={edad} 
        onChange={(e) => setEdad(Number(e.target.value))} 
        placeholder="Edad"
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

#### Estado con Objetos
```typescript
function PerfilUsuario() {
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    edad: 0
  });

  const actualizarCampo = (campo: string, valor: any) => {
    setUsuario(prevUsuario => ({
      ...prevUsuario,
      [campo]: valor
    }));
  };

  return (
    <div>
      <input 
        value={usuario.nombre}
        onChange={(e) => actualizarCampo('nombre', e.target.value)}
      />
    </div>
  );
}
```


---

## 2. useEffect

### ¿Qué es?
`useEffect` permite ejecutar efectos secundarios (side effects) en componentes funcionales, como llamadas a APIs, suscripciones, modificación del DOM, etc.

### Sintaxis Básica
```typescript
useEffect(() => {
  // Código del efecto
  
  return () => {
    // Cleanup (opcional)
  };
}, [dependencias]);
```

### Tres Tipos de useEffect

#### 1. Sin Array de Dependencias (Se ejecuta después de cada render)
```typescript
useEffect(() => {
  console.log('Se ejecuta después de CADA render');
  // ⚠️ CUIDADO: Puede causar loops infinitos
});
```

#### 2. Con Array Vacío [] (Se ejecuta solo una vez al montar)
```typescript
useEffect(() => {
  console.log('Se ejecuta UNA SOLA VEZ al montar el componente');
  
  // Ideal para:
  // - Cargar datos iniciales
  // - Configurar suscripciones
  // - Inicializar bibliotecas
}, []);
```

#### 3. Con Dependencias (Se ejecuta cuando cambian las dependencias)
```typescript
useEffect(() => {
  console.log('Se ejecuta cuando "count" cambia');
  
  // Se ejecuta:
  // 1. Al montar el componente
  // 2. Cada vez que "count" cambie
}, [count]);
```

### Ejemplos Prácticos

#### Fetch de Datos
```typescript
function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.example.com/users');
        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []); // Solo se ejecuta al montar

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <ul>
      {usuarios.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```


#### Múltiples Dependencias
```typescript
function BuscadorProductos() {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    console.log('Buscando productos...');
    
    // Se ejecuta cuando cambia "busqueda" o "categoria"
    const fetchProductos = async () => {
      const response = await fetch(
        `/api/productos?q=${busqueda}&cat=${categoria}`
      );
      const data = await response.json();
      setProductos(data);
    };

    fetchProductos();
  }, [busqueda, categoria]); // Múltiples dependencias

  return (
    <div>
      <input 
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar producto..."
      />
      <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
        <option value="todos">Todos</option>
        <option value="electronicos">Electrónicos</option>
        <option value="ropa">Ropa</option>
      </select>
    </div>
  );
}
```

### 📊 Tabla Resumen de Dependencias

| Array de Dependencias | ¿Cuándo se ejecuta? | Uso común |
|----------------------|---------------------|-----------|
| **Sin array** | Después de cada render | ⚠️ Rara vez necesario |
| **`[]`** (vacío) | Solo una vez al montar | Cargar datos iniciales, setup |
| **`[dep1, dep2]`** | Al montar y cuando cambien | Reaccionar a cambios de estado/props |

---

## 3. Ciclo de Vida de un Componente

### Fases del Ciclo de Vida

```
┌─────────────────────────────────────────────────┐
│           CICLO DE VIDA DEL COMPONENTE          │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. MONTAJE (Mounting)                         │
│     └─> El componente se crea y se inserta     │
│         en el DOM                               │
│                                                 │
│  2. ACTUALIZACIÓN (Updating)                   │
│     └─> El componente se re-renderiza cuando   │
│         cambia el estado o las props            │
│                                                 │
│  3. DESMONTAJE (Unmounting)                    │
│     └─> El componente se elimina del DOM       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Comparación: Class Components vs Hooks

#### Class Components (Método Antiguo)
```typescript
class MiComponente extends React.Component {
  componentDidMount() {
    // Se ejecuta después de montar
    console.log('Componente montado');
  }

  componentDidUpdate(prevProps, prevState) {
    // Se ejecuta después de actualizar
    console.log('Componente actualizado');
  }

  componentWillUnmount() {
    // Se ejecuta antes de desmontar
    console.log('Componente desmontado');
  }

  render() {
    return <div>Hola Mundo</div>;
  }
}
```

#### Functional Components con Hooks (Método Moderno)
```typescript
function MiComponente() {
  // componentDidMount
  useEffect(() => {
    console.log('Componente montado');
  }, []);

  // componentDidUpdate
  useEffect(() => {
    console.log('Componente actualizado');
  }); // Sin array de dependencias

  // componentWillUnmount
  useEffect(() => {
    return () => {
      console.log('Componente desmontado');
    };
  }, []);

  return <div>Hola Mundo</div>;
}
```

### Ejemplo Completo del Ciclo de Vida
```typescript
function ComponenteCompleto() {
  const [count, setCount] = useState(0);

  // 1. MONTAJE - Solo una vez
  useEffect(() => {
    console.log('🟢 MONTAJE: Componente montado');
    
    // Cargar datos iniciales
    const cargarDatos = async () => {
      const datos = await fetch('/api/datos');
      console.log('Datos cargados');
    };
    cargarDatos();
  }, []);

  // 2. ACTUALIZACIÓN - Cuando cambia "count"
  useEffect(() => {
    console.log('🔵 ACTUALIZACIÓN: Count cambió a', count);
  }, [count]);

  // 3. DESMONTAJE - Cleanup
  useEffect(() => {
    const timer = setInterval(() => console.log('tick'), 1000);
    
    return () => {
      console.log('🔴 DESMONTAJE: Limpiando timer');
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

---

## 4. useRef

### ¿Qué es?
`useRef` devuelve un objeto mutable que persiste durante toda la vida del componente. Se usa principalmente para:
1. Acceder directamente a elementos del DOM
2. Almacenar valores que no causan re-renders al cambiar

### Sintaxis Básica
```typescript
const refContainer = useRef(valorInicial);
```

### Características
- **No causa re-renders**: Cambiar `.current` no re-renderiza el componente
- **Persiste entre renders**: El valor se mantiene entre re-renders
- **Acceso al DOM**: Permite manipular directamente elementos del DOM

### Ejemplo 1: Acceso al DOM (Focus en Input)
```typescript
function FormularioConFocus() {
  const inputRef = useRef<HTMLInputElement>(null);

  const enfocarInput = () => {
    // Acceder directamente al elemento DOM
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Nombre" />
      <button onClick={enfocarInput}>Enfocar Input</button>
    </div>
  );
}
```

### Ejemplo 2: Almacenar Valor sin Re-render
```typescript
function Contador() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);

  // Este useEffect se ejecuta en cada render
  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <div>
      <p>Count: {count}</p>
      <p>Renders: {renderCount.current}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
}
```

### Ejemplo 3: Guardar Valor Anterior
```typescript
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function ComponenteConHistorial() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Ahora: {count}</p>
      <p>Anterior: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

### Ejemplo 4: Control de Timers/Intervals
```typescript
function Cronometro() {
  const [segundos, setSegundos] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const iniciar = () => {
    setCorriendo(true);
    intervalRef.current = setInterval(() => {
      setSegundos(prev => prev + 1);
    }, 1000);
  };

  const pausar = () => {
    setCorriendo(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetear = () => {
    pausar();
    setSegundos(0);
  };

  useEffect(() => {
    // Cleanup al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <p>Tiempo: {segundos}s</p>
      <button onClick={iniciar} disabled={corriendo}>Iniciar</button>
      <button onClick={pausar} disabled={!corriendo}>Pausar</button>
      <button onClick={resetear}>Resetear</button>
    </div>
  );
}
```

### 🆚 useState vs useRef

| Característica | useState | useRef |
|---------------|----------|---------|
| Causa re-render | ✅ Sí | ❌ No |
| Valor persiste | ✅ Sí | ✅ Sí |
| Acceso al DOM | ❌ No | ✅ Sí |
| Uso típico | Estado UI | Referencias, valores internos |

---

## 5. useContext

### ¿Qué es?
`useContext` permite compartir datos entre componentes sin tener que pasar props manualmente en cada nivel (evita "prop drilling").

### Problema: Prop Drilling
```typescript
// ❌ PROBLEMA: Pasar props a través de muchos niveles
function App() {
  const [usuario, setUsuario] = useState({ nombre: 'Juan' });
  return <Padre usuario={usuario} />;
}

function Padre({ usuario }) {
  return <Hijo usuario={usuario} />;
}

function Hijo({ usuario }) {
  return <Nieto usuario={usuario} />;
}

function Nieto({ usuario }) {
  return <p>{usuario.nombre}</p>;
}
```

### Solución: useContext
```typescript
import { createContext, useContext, useState } from 'react';

// 1. Crear el Context
const UsuarioContext = createContext(null);

// 2. Provider Component
function App() {
  const [usuario, setUsuario] = useState({ nombre: 'Juan', email: 'juan@email.com' });

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario }}>
      <Padre />
    </UsuarioContext.Provider>
  );
}

// 3. Consumir el Context (sin necesidad de props)
function Padre() {
  return <Hijo />;
}

function Hijo() {
  return <Nieto />;
}

function Nieto() {
  const { usuario, setUsuario } = useContext(UsuarioContext);
  
  return (
    <div>
      <p>Nombre: {usuario.nombre}</p>
      <p>Email: {usuario.email}</p>
      <button onClick={() => setUsuario({ ...usuario, nombre: 'Pedro' })}>
        Cambiar Nombre
      </button>
    </div>
  );
}
```

### Ejemplo Completo: Context de Autenticación
```typescript
// auth-context.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = async (email: string, password: string) => {
    // Simular llamada a API
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    setUsuario(data.usuario);
  };

  const logout = () => {
    setUsuario(null);
  };

  const value = {
    usuario,
    login,
    logout,
    isAuthenticated: !!usuario
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### Uso del Context de Autenticación
```typescript
// App.tsx
function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}

// Dashboard.tsx
function Dashboard() {
  const { usuario, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>Bienvenido, {usuario?.nombre}</h1>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}

// LoginForm.tsx
function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}
```

### Ejemplo: Context de Tema (Dark/Light Mode)
```typescript
// theme-context.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// Uso
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Content />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={theme === 'dark' ? 'bg-black' : 'bg-white'}>
      <button onClick={toggleTheme}>
        {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
      </button>
    </header>
  );
}
```

---

## 6. Ejemplos Prácticos

### Ejemplo Completo: Todo App con Todos los Hooks
```typescript
import { useState, useEffect, useRef, useContext, createContext } from 'react';

// Context
interface Todo {
  id: number;
  texto: string;
  completada: boolean;
}

const TodoContext = createContext<{
  todos: Todo[];
  agregarTodo: (texto: string) => void;
  toggleTodo: (id: number) => void;
  eliminarTodo: (id: number) => void;
} | undefined>(undefined);

// Provider
function TodoProvider({ children }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  // useEffect: Cargar desde localStorage al montar
  useEffect(() => {
    const todosGuardados = localStorage.getItem('todos');
    if (todosGuardados) {
      setTodos(JSON.parse(todosGuardados));
    }
  }, []);

  // useEffect: Guardar en localStorage cuando cambien los todos
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const agregarTodo = (texto: string) => {
    const nuevoTodo: Todo = {
      id: Date.now(),
      texto,
      completada: false
    };
    setTodos(prev => [...prev, nuevoTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completada: !todo.completada } : todo
    ));
  };

  const eliminarTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, agregarTodo, toggleTodo, eliminarTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

// Hook personalizado
function useTodos() {
  const context = useContext(TodoContext);
  if (!context) throw new Error('useTodos debe usarse dentro de TodoProvider');
  return context;
}

// Componente Formulario
function TodoForm() {
  const [texto, setTexto] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { agregarTodo } = useTodos();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (texto.trim()) {
      agregarTodo(texto);
      setTexto('');
      inputRef.current?.focus(); // useRef para mantener focus
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Nueva tarea..."
      />
      <button type="submit">Agregar</button>
    </form>
  );
}

// Componente Lista
function TodoList() {
  const { todos, toggleTodo, eliminarTodo } = useTodos();
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <div>
      <p>Renders: {renderCount.current}</p>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.completada ? 'line-through' : 'none' }}>
            <input
              type="checkbox"
              checked={todo.completada}
              onChange={() => toggleTodo(todo.id)}
            />
            {todo.texto}
            <button onClick={() => eliminarTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// App Principal
function TodoApp() {
  return (
    <TodoProvider>
      <div>
        <h1>Todo App - Todos los Hooks</h1>
        <TodoForm />
        <TodoList />
      </div>
    </TodoProvider>
  );
}
```

---

##  Resumen Final

### Cuándo usar cada Hook

| Hook | Cuándo usarlo |
|------|---------------|
| **useState** | Cuando necesitas manejar estado local en un componente |
| **useEffect** | Para efectos secundarios (API calls, suscripciones, timers) |
| **useRef** | Acceso al DOM, almacenar valores sin re-render |
| **useContext** | Compartir datos entre muchos componentes (evitar prop drilling) |

###  Reglas de los Hooks
1.  Solo llamarlos en el nivel superior (no dentro de loops, condicionales o funciones anidadas)
2.  Solo llamarlos desde componentes funcionales o custom hooks
3.  Los custom hooks deben comenzar con "use"

###  Mejores Prácticas
- **useState**: Usa la forma funcional cuando el nuevo estado depende del anterior
- **useEffect**: Siempre especifica dependencias correctamente para evitar bugs
- **useRef**: No causes re-renders, úsalo para valores internos
- **useContext**: No abuses, puede dificultar el debugging en apps grandes

---

##  Recursos Adicionales
- [Documentación Oficial de React](https://react.dev/reference/react)
- [Reglas de los Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [Hooks FAQ](https://react.dev/reference/react)
