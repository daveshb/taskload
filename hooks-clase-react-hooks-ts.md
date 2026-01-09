# Guía de Hooks en React con TypeScript
useState • useEffect • Reglas de los Hooks • useContext • useReducer • useRef • useMemo • useCallback


---

## 1. useState

El hook `useState` permite manejar valores que cambian a lo largo del tiempo dentro de un componente funcional.

### ¿Qué es el estado en React?

El **estado** es información que:
- Pertenece a un componente.
- Puede cambiar con el tiempo.
- Hace que el componente se vuelva a renderizar cuando cambia.

`useState` es la forma más sencilla de crear y actualizar estado en componentes funcionales.

### Sintaxis básica

```tsx
const [valor, setValor] = useState<Tipo>(valorInicial);
```

- `valor`: es el valor actual del estado.
- `setValor`: es la función que actualiza el estado.
- `Tipo`: el tipo de dato (TypeScript). Puede ser `number`, `string`, `boolean`, un objeto, etc.
- `valorInicial`: el valor con el que empieza el estado.

### Ejemplo básico con TypeScript

```tsx
import React, { useState } from "react";

const Contador: React.FC = () => {
  const [numero, setNumero] = useState<number>(0);

  const incrementar = () => setNumero((prev) => prev + 1);
  const decrementar = () => setNumero((prev) => prev - 1);

  return (
    <div>
      <h1>Contador: {numero}</h1>
      <button onClick={incrementar}>Incrementar</button>
      <button onClick={decrementar}>Decrementar</button>
    </div>
  );
};

export default Contador;
```

---

## 2. useEffect

El hook `useEffect` se utiliza para manejar **efectos secundarios** en componentes funcionales.

### ¿Qué es un efecto secundario?

En React, un efecto secundario es cualquier operación que:
- Interactúa con el exterior del componente (por ejemplo, una API).
- Depende del ciclo de vida del componente (montaje, actualización, desmontaje).

Ejemplos típicos de efectos secundarios:
- Llamadas HTTP (fetch, axios).
- Suscripciones (WebSockets, eventos del navegador).
- Timers (`setInterval`, `setTimeout`).
- Manipulación del DOM que no se puede hacer solo con JSX.

### Sintaxis básica

```tsx
useEffect(() => {
  // Lógica del efecto

  return () => {
    // Cleanup (limpieza, opcional)
  };
}, [dependencias]);
```

- La función principal del `useEffect` se ejecuta después del renderizado.
- La función de retorno (si existe) se ejecuta antes de que el efecto se vuelva a ejecutar o cuando el componente se desmonta.
- El array de dependencias controla cuándo se ejecuta el efecto.

### Comportamiento según las dependencias

- Sin array: el efecto se ejecuta en **cada renderizado**.
- `[]`: el efecto se ejecuta **solo una vez**, al montar el componente.
- `[a, b]`: el efecto se ejecuta cuando cambian `a` o `b`.

### Ejemplo básico: contador con título del documento

```tsx
import React, { useEffect, useState } from "react";

const ContadorConTitulo: React.FC = () => {
  const [clicks, setClicks] = useState<number>(0);

  useEffect(() => {
    document.title = `Has hecho ${clicks} clics`;
  }, [clicks]);

  return (
    <div>
      <p>Has hecho {clicks} clics</p>
      <button onClick={() => setClicks((prev) => prev + 1)}>Click</button>
    </div>
  );
};

export default ContadorConTitulo;
```

En este ejemplo, el título del navegador se actualiza solo cuando cambia `clicks`.

---

## 3. Reglas de los Hooks

React define dos reglas estrictas que siempre debes seguir para que los hooks funcionen correctamente.

### Regla 1: Llamar los hooks en el nivel superior

Los hooks deben llamarse siempre:
- En la parte superior del componente.
- En el mismo orden en cada renderizado.

No se pueden llamar dentro de:
- Condicionales.
- Bucles.
- Funciones internas.

Ejemplo incorrecto:

```tsx
const EjemploIncorrecto: React.FC = () => {
  const [activo, setActivo] = useState<boolean>(false);

  if (activo) {
    const [contador, setContador] = useState<number>(0>; // Incorrecto
  }

  return null;
};
```

Ejemplo correcto:

```tsx
const EjemploCorrecto: React.FC = () => {
  const [activo, setActivo] = useState<boolean>(false);
  const [contador, setContador] = useState<number>(0);

  // Aquí puedes usar "activo" para decidir qué mostrar,
  // pero no para decidir si llamas o no un hook.
  return null;
};
```

### Regla 2: Usar hooks solo en componentes funcionales o hooks personalizados

No se deben usar hooks:
- En funciones normales de JavaScript.
- En clases.

Se pueden usar en:
- Componentes funcionales.
- Hooks personalizados (`useMiHook`), que internamente pueden usar otros hooks.

---

## 4. useContext

El hook `useContext` se utiliza para acceder a valores compartidos a través del sistema de Context API de React, sin necesidad de pasar props manualmente por muchos niveles.

### ¿Qué problema resuelve useContext?

Cuando varios componentes necesitan acceder al mismo dato (por ejemplo, el tema claro/oscuro, el usuario autenticado o el idioma), pasar props manualmente desde un componente padre a muchos niveles se vuelve incómodo. A esto se le conoce como **prop drilling**.

`useContext` + `Context.Provider` permiten:
- Definir un **contexto global**.
- Proveer un valor en un nivel alto del árbol.
- Consumir ese valor en cualquier componente hijo sin pasar props intermedios.

### Flujo general de uso

1. Crear el contexto con `createContext`.
2. Crear un componente proveedor que use `useState` (u otro hook) para manejar el valor.
3. Envolver la aplicación o parte de ella con el proveedor.
4. Usar `useContext` en cualquier componente para leer (y, si se expone, actualizar) el valor.

### Ejemplo: compartir un useState por toda la aplicación (tema claro/oscuro)

#### 1. Definir el contexto y el proveedor

```tsx
// TemaContext.tsx
import React, { createContext, useState, useContext } from "react";

type Tema = "claro" | "oscuro";

interface TemaContextValue {
  tema: Tema;
  cambiarTema: () => void;
}

const TemaContext = createContext<TemaContextValue | undefined>(undefined);

export const TemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tema, setTema] = useState<Tema>("claro");

  const cambiarTema = () => {
    setTema((prev) => (prev === "claro" ? "oscuro" : "claro"));
  };

  return (
    <TemaContext.Provider value={{ tema, cambiarTema }}>
      {children}
    </TemaContext.Provider>
  );
};

export const useTema = (): TemaContextValue => {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error("useTema debe usarse dentro de un TemaProvider");
  }
  return context;
};
```

Aquí:
- Se crea un contexto que comparte un `useState` (`tema`) y una función `cambiarTema`.
- Cualquier componente envuelto por `TemaProvider` podrá leer y actualizar el tema.

#### 2. Usar el proveedor en la App

```tsx
// _app.tsx en Next.js, o App.tsx en React
import React from "react";
import { TemaProvider } from "./TemaContext";
import Home from "./Home";

const App: React.FC = () => {
  return (
    <TemaProvider>
      <Home />
    </TemaProvider>
  );
};

export default App;
```

#### 3. Consumir el contexto en un componente hijo

```tsx
// Home.tsx
import React from "react";
import { useTema } from "./TemaContext";

const Home: React.FC = () => {
  const { tema, cambiarTema } = useTema();

  return (
    <div style={{ background: tema === "claro" ? "#ffffff" : "#222222", color: tema === "claro" ? "#000000" : "#ffffff" }}>
      <h1>Tema actual: {tema}</h1>
      <button onClick={cambiarTema}>Cambiar tema</button>
    </div>
  );
};

export default Home;
```

En este ejemplo, `useContext` permite compartir un `useState` (con su setter) por toda la app sin tener que pasar props manualmente.

---

## 5. useReducer

El hook `useReducer` es una alternativa avanzada a `useState`. Está inspirado en el patrón **Reducer** que se utiliza en herramientas como Redux.

### ¿Cuándo usar useReducer en lugar de useState?

`useState` es ideal para:
- Estados simples.
- Pocas transiciones o acciones.

`useReducer` es ideal cuando:
- El estado es **más complejo** (objetos anidados, múltiples propiedades relacionadas).
- Hay muchas acciones diferentes que modifican el estado.
- Se quiere centralizar la lógica de actualización del estado en un solo lugar (el reducer).
- Se quiere que las transiciones de estado sean más predecibles y fáciles de testear.

### Conceptos clave

- **Estado**: representa la información actual.
- **Acción**: un objeto que describe qué cambio queremos hacer (por ejemplo, `{ type: "incrementar" }`).
- **Reducer**: función pura `(estado, accion) => nuevoEstado`, que decide cómo cambia el estado en respuesta a una acción.

### Sintaxis general

```tsx
const [estado, dispatch] = useReducer(reducer, estadoInicial);
```

- `estado`: estado actual.
- `dispatch`: función para enviar acciones.
- `reducer`: función que recibe el estado y una acción.
- `estadoInicial`: valor inicial del estado.

### Ejemplo: contador con useReducer

```tsx
import React, { useReducer } from "react";

interface Estado {
  contador: number;
}

type Accion =
  | { type: "incrementar" }
  | { type: "decrementar" }
  | { type: "reset" };

const reducer = (estado: Estado, accion: Accion): Estado => {
  switch (accion.type) {
    case "incrementar":
      return { contador: estado.contador + 1 };
    case "decrementar":
      return { contador: estado.contador - 1 };
    case "reset":
      return { contador: 0 };
    default:
      return estado;
  }
};

const ContadorReducer: React.FC = () => {
  const estadoInicial: Estado = { contador: 0 };
  const [estado, dispatch] = useReducer(reducer, estadoInicial);

  return (
    <div>
      <h1>Contador: {estado.contador}</h1>
      <button onClick={() => dispatch({ type: "incrementar" })}>Incrementar</button>
      <button onClick={() => dispatch({ type: "decrementar" })}>Decrementar</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
};

export default ContadorReducer;
```

Aquí, toda la lógica de cómo cambia el contador está en el `reducer`, lo que hace el código más fácil de mantener cuando las reglas de negocio crecen.

---

## 6. useRef

El hook `useRef` sirve para crear **referencias mutables** que persisten entre renderizados sin causar un nuevo renderizado cuando cambian.

### Características importantes

1. `useRef` devuelve un objeto con la forma:
   ```ts
   { current: T }
   ```
2. Cambiar `ref.current` **no** provoca un re-render.
3. Se suele usar para:
   - Acceder a elementos del DOM.
   - Guardar valores que queremos mantener entre renderizados, pero que no deben disparar un render.
   - Guardar identificadores de intervalos (`setInterval`, `setTimeout`).
   - Guardar el valor anterior de una variable.

### ¿Cuándo usar useRef?

1. **Acceso directo al DOM**  
   Por ejemplo, enfocar un input, hacer scroll, reproducir un video, etc.

2. **Almacenar valores que cambian pero no afectan la UI**  
   Por ejemplo, un contador de intentos, un id de intervalo, un valor anterior para comparar, un flag interno.

3. **Integraciones con librerías de terceros**  
   Por ejemplo, guardar una instancia de una librería de gráficos o de un mapa para no reinstanciarla en cada renderizado.

4. **Evitar re-renderizados innecesarios**  
   Cuando un valor no necesita reflejarse en el JSX, pero sí debe persistir, es mejor guardarlo en un `ref` y no en un `useState`.

### Ejemplo 1: enfocar un input

```tsx
import React, { useEffect, useRef } from "react";

const EnfocarInput: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return <input ref={inputRef} placeholder="Escribe algo..." />;
};

export default EnfocarInput;
```

### Ejemplo 2: contador sin re-renderización

```tsx
import React, { useRef, useState } from "react";

const ContadorNoRenderizado: React.FC = () => {
  const [renderizados, setRenderizados] = useState(0);
  const contadorRef = useRef<number>(0);

  const incrementar = () => {
    contadorRef.current += 1; // no provoca re-render
    setRenderizados((prev) => prev + 1); // solo para ver qué pasa en la UI
    console.log("Valor interno del contadorRef:", contadorRef.current);
  };

  return (
    <div>
      <h1>Renderizados del componente: {renderizados}</h1>
      <h2>Valor actual en ref (no ligado a la UI): {contadorRef.current}</h2>
      <button onClick={incrementar}>Incrementar</button>
    </div>
  );
};

export default ContadorNoRenderizado;
```

En este ejemplo, `contadorRef.current` puede cambiar muchas veces sin causar un re-render. Solo se re-renderiza cuando llamamos a `setRenderizados`.

---

## 7. useMemo

El hook `useMemo` se utiliza para memorizar el **resultado de una función** costosa, de modo que solo se recalcula cuando cambian sus dependencias.

### ¿Qué problema resuelve useMemo?

En React, cada vez que un componente se re-renderiza:
- Se vuelven a ejecutar todas las funciones del cuerpo del componente.
- Si dentro del componente hay cálculos pesados (por ejemplo, filtrar una lista grande, hacer operaciones matemáticas complejas, etc.), estos cálculos se vuelven a hacer en cada renderizado.

`useMemo` permite evitar recalcular resultados cuando las entradas no han cambiado.

### Sintaxis

```tsx
const valorMemorizado = useMemo(() => {
  return calcularValor();
}, [dependencias]);
```

### Ejemplo comparativo: con y sin useMemo

Supongamos que tenemos una función costosa que calcula la suma de muchos números (simulada con logs).

#### Versión sin useMemo

```tsx
import React, { useState } from "react";

const calcularSumaCostosa = (n: number): number => {
  console.log("Ejecutando cálculo costoso...");
  let suma = 0;
  for (let i = 0; i < 1_000_000; i++) {
    suma += n;
  }
  return suma;
};

const EjemploSinUseMemo: React.FC = () => {
  const [numero, setNumero] = useState<number>(5);
  const [contador, setContador] = useState<number>(0);

  const resultado = calcularSumaCostosa(numero);

  return (
    <div>
      <h1>Resultado: {resultado}</h1>
      <button onClick={() => setNumero((prev) => prev + 1)}>Cambiar número</button>
      <button onClick={() => setContador((prev) => prev + 1)}>Incrementar contador</button>
      <p>Contador: {contador}</p>
    </div>
  );
};

export default EjemploSinUseMemo;
```

En esta versión, cada vez que se hace clic en cualquier botón, se ejecuta `calcularSumaCostosa`, incluso si el número no cambió.

Verás en la consola:  
`"Ejecutando cálculo costoso..."` en cada clic.

#### Versión con useMemo

```tsx
import React, { useMemo, useState } from "react";

const calcularSumaCostosa = (n: number): number => {
  console.log("Ejecutando cálculo costoso...");
  let suma = 0;
  for (let i = 0; i < 1_000_000; i++) {
    suma += n;
  }
  return suma;
};

const EjemploConUseMemo: React.FC = () => {
  const [numero, setNumero] = useState<number>(5);
  const [contador, setContador] = useState<number>(0);

  const resultado = useMemo(() => {
    return calcularSumaCostosa(numero);
  }, [numero]);

  return (
    <div>
      <h1>Resultado: {resultado}</h1>
      <button onClick={() => setNumero((prev) => prev + 1)}>Cambiar número</button>
      <button onClick={() => setContador((prev) => prev + 1)}>Incrementar contador</button>
      <p>Contador: {contador}</p>
    </div>
  );
};

export default EjemploConUseMemo;
```

En esta versión:
- La función `calcularSumaCostosa` solo se ejecuta cuando cambia `numero`.
- Si solo cambias el `contador`, el resultado memorizado se reutiliza y en la consola no aparecerá el log.

Este ejemplo permite ver claramente la diferencia gracias a `console.log`.

---

## 8. useCallback

El hook `useCallback` se utiliza para memorizar **funciones**. Es similar a `useMemo`, pero en lugar de memorizar un valor, memoriza la referencia de una función.

### ¿Qué problema resuelve useCallback?

En cada renderizado, las funciones definidas dentro del componente se crean de nuevo. Esto puede causar problemas cuando:

- Pasamos funciones como props a componentes hijos que están memorizados con `React.memo` o usan `useEffect` con esa función en las dependencias.
- Queremos evitar que los componentes hijos se re-rendericen innecesariamente por cambios en la referencia de una función (aunque su lógica no haya cambiado).

`useCallback` asegura que la **misma instancia de la función** se mantenga mientras sus dependencias no cambien.

### Sintaxis

```tsx
const funcionMemorizada = useCallback(() => {
  // lógica
}, [dependencias]);
```

- Mientras las dependencias no cambien, `funcionMemorizada` será la misma referencia entre renderizados.

### Ejemplo: pasar una función memorizada a un componente hijo

```tsx
import React, { useCallback, useState } from "react";

interface BotonProps {
  onClick: () => void;
}

const Boton: React.FC<BotonProps> = React.memo(({ onClick }) => {
  console.log("Boton renderizado");
  return <button onClick={onClick}>Haz clic aquí</button>;
});

const ContadorCallback: React.FC = () => {
  const [contador, setContador] = useState<number>(0);
  const [otraCosa, setOtraCosa] = useState<number>(0);

  const incrementar = useCallback(() => {
    setContador((prev) => prev + 1);
  }, []);

  return (
    <div>
      <h1>Contador: {contador}</h1>
      <Boton onClick={incrementar} />
      <button onClick={() => setOtraCosa((prev) => prev + 1)}>
        Cambiar otra cosa
      </button>
      <p>Otra cosa: {otraCosa}</p>
    </div>
  );
};

export default ContadorCallback;
```

En este ejemplo:
- `Boton` está envuelto en `React.memo`, por lo que solo se re-renderiza si cambian sus props.
- Gracias a `useCallback`, la referencia de `incrementar` se mantiene estable entre renderizados.
- Si solo cambia `otraCosa`, `Boton` no se vuelve a renderizar.

Si no usáramos `useCallback`, cada renderizado crearía una nueva función `incrementar`, y `Boton` se re-renderizaría siempre.

---

## 9. Ejercicios propuestos

### useState

1. Crea un contador con botones de incrementar, decrementar y resetear.
2. Crea un input de texto que muestre en tiempo real lo que el usuario escribe en un `<p>`.

### useEffect

1. Haz que el título del navegador muestre el número de clics realizados en un botón.
2. Crea un temporizador que cuente segundos y tenga botones para iniciar, pausar y reiniciar.

### useContext

1. Implementa un contexto de tema claro/oscuro para toda la app.
2. Crea un contexto de idioma (es/en) y muestra textos diferentes según el idioma seleccionado.

### useReducer

1. Crea un carrito de compras donde el reducer maneje acciones para:
   - Agregar producto.
   - Quitar producto.
   - Vaciar carrito.
2. Crea un formulario complejo (por ejemplo, registro de usuario) y maneja su estado con `useReducer`.

### useRef

1. Crea un formulario donde el primer input se enfoque automáticamente al montar el componente.
2. Crea un contador interno usando `useRef` que lleve la cuenta de cuántas veces se ha hecho clic en un botón, sin mostrar ese valor en la UI (solo con logs).

### useMemo

1. Crea una lista grande de números y muestra solo los pares usando un filtro costoso. Primero hazlo sin `useMemo` y luego optimízalo.
2. Crea una función costosa con `console.log` para ver cuándo se ejecuta y protégela con `useMemo`.

### useCallback

1. Crea un componente padre que tenga una lista de ítems y un componente hijo `Item` memorizado con `React.memo`. Usa `useCallback` para pasar una función de selección.
2. Crea un buscador donde el input dispare una función memorizada que filtre una lista, y observa cuántas veces se renderiza la lista con y sin `useCallback`.

---

## 10. Práctica

Como práctica integradora, construye una pequeña aplicación que incluya:

- Tema claro/oscuro usando `useContext` + `useState`.
- Carrito de compras usando `useReducer`.
- Filtro de productos costoso optimizado con `useMemo`.
- Acciones de filtrado o búsqueda memorizadas con `useCallback`.
- Un input que se enfoca automáticamente al montar usando `useRef`.
- Algunos estados locales sencillos con `useState`.
- Efectos para guardar información en `localStorage` usando `useEffect`.


