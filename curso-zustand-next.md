# Estado global con Zustand en Next.js (App Router) usando npm

En esta clase vamos a:

1. Instalar y configurar **Zustand** en un proyecto con **Next.js App Router** usando **npm**.
2. Crear **tres stores globales** (como si fueran tres `useState` globales):
   - `useThemeStore` → modo claro/oscuro.
   - `useCounterStore` → contador global.
   - `useUserStore` → información básica de un usuario (nombre, email, login/logout).

> ⚠️ App Router = carpeta `app/`.  
> ⚠️ Todo componente que use Zustand debe tener `"use client"`.

---

## 1. Instalación (con npm)

```bash
npm install zustand
```

---

## 2. Estructura de archivos sugerida

```
src/
  app/
    layout.tsx
    page.tsx
    otra-pagina/
      page.tsx
    components/
      theme-toggle.tsx
      counter.tsx
      user-panel.tsx
  stores/
    theme-store.ts
    counter-store.ts
    user-store.ts
```

---

## 3. Store de tema (`theme-store.ts`)

```ts
import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),
  setTheme: (theme) => set({ theme }),
}));
```

---

## 4. Store de contador (`counter-store.ts`)

```ts
import { create } from "zustand";

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (value: number) => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  setCount: (value) => set({ count: value }),
}));
```

---

## 5. Store de usuario (`user-store.ts`)

```ts
import { create } from "zustand";

interface User {
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoggedIn: false,

  login: (user) =>
    set({
      user,
      isLoggedIn: true,
    }),

  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
    }),

  updateUser: (user) =>
    set((state) => {
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          ...user,
        },
      };
    }),
}));
```

---

## 6. Componentes de UI

### 6.1. `theme-toggle.tsx`

```tsx
"use client";

import { useThemeStore } from "@/stores/theme-store";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button onClick={toggleTheme}>
      Tema actual: {theme === "light" ? "🌞 Claro" : "🌙 Oscuro"}
    </button>
  );
}
```

---

### 6.2. `counter.tsx`

```tsx
"use client";

import { useCounterStore } from "@/stores/counter-store";

export function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={decrement}>-1</button>
      <button onClick={increment}>+1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

---

### 6.3. `user-panel.tsx`

```tsx
"use client";

import { useState, FormEvent } from "react";
import { useUserStore } from "@/stores/user-store";

export function UserPanel() {
  const { user, isLoggedIn, login, logout, updateUser } = useUserStore();
  const [nameInput, setNameInput] = useState(user?.name ?? "");
  const [emailInput, setEmailInput] = useState(user?.email ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) login({ name: nameInput, email: emailInput });
    else updateUser({ name: nameInput, email: emailInput });
  };

  return (
    <div>
      {isLoggedIn && user ? (
        <>
          <p>Nombre: {user.name}</p>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <p>No hay usuario logueado.</p>
      )}

      <form onSubmit={handleSubmit}>
        <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
        <input value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
        <button type="submit">{isLoggedIn ? "Actualizar" : "Login"}</button>
      </form>

      {isLoggedIn && <button onClick={logout}>Logout</button>}
    </div>
  );
}
```

---

## 7. Página principal (`page.tsx`)

```tsx
import { ThemeToggle } from "./components/theme-toggle";
import { Counter } from "./components/counter";
import { UserPanel } from "./components/user-panel";

export default function HomePage() {
  return (
    <main>
      <h1>Zustand + Next.js App Router</h1>
      <ThemeToggle />
      <Counter />
      <UserPanel />
    </main>
  );
}
```

---

## 8. Modelo mental

Cada store es como tener un `useState` pero **global**:

- `useThemeStore` → `theme`
- `useCounterStore` → `count`
- `useUserStore` → `user`

Puedes usarlos en cualquier componente cliente sin prop drilling.

---


