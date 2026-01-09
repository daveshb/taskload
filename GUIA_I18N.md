#  Guía Simple de i18n (Internacionalización)

## ¿Qué es i18n?

**i18n** es la internacionalización - permite que tu app soporte múltiples idiomas de forma sencilla. Los números (18) representan las 18 letras entre la 'i' y la 'n'.

## Estructura del Proyecto

```
src/
├── i18n/
│   ├── en.json          # Traducciones en inglés
│   ├── es.json          # Traducciones en español
│   └── index.ts         # Archivo de configuración
├── contexts/
│   └── LanguageContext.tsx  # Contexto global del idioma
├── components/
│   └── LanguageSwitcher.tsx # Selector de idioma
└── app/
    └── page.tsx         # Página que usa las traducciones
```

## Paso 1: Crear los archivos de traducción

### `src/i18n/es.json` (Español)
```json
{
  "login": {
    "title": "Iniciar Sesión",
    "email": "Email",
    "emailPlaceholder": "Ingrese su email",
    "errors": {
      "emailRequired": "El email es requerido"
    }
  }
}
```

### `src/i18n/en.json` (Inglés)
```json
{
  "login": {
    "title": "Login",
    "email": "Email",
    "emailPlaceholder": "Enter your email",
    "errors": {
      "emailRequired": "Email is required"
    }
  }
}
```

## Paso 2: Crear el archivo de configuración

### `src/i18n/index.ts`
```typescript
import en from './en.json';
import es from './es.json';

export type Language = 'en' | 'es';

const translations = {
  en,
  es,
};

export const getTranslation = (lang: Language) => {
  return translations[lang] || translations.es;
};

export const languages: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
];
```

## Paso 3: Crear el contexto global

### `src/contexts/LanguageContext.tsx`
```typescript
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, getTranslation } from '@/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;  // Función para obtener traducciones
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');
  const [mounted, setMounted] = useState(false);

  // Cargar idioma guardado
  useEffect(() => {
    setTimeout(() => {
      const savedLanguage = localStorage.getItem('language') as Language | null;
      if (savedLanguage) {
        setLanguageState(savedLanguage);
      }
      setMounted(true);
    }, 0);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);  // Guardar preferencia
  };

  // Función para obtener traducción usando notación de punto
  const t = (key: string): string => {
    const translation = getTranslation(language);
    const keys = key.split('.');
    let value: unknown = translation;

    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      }
    }

    return typeof value === 'string' ? value : key;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
```

## Paso 4: Crear el selector de idioma

### `src/components/LanguageSwitcher.tsx`
```typescript
'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { languages } from '@/i18n';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
      className="px-3 py-2 border border-gray-300 rounded-md bg-white"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
```

## Paso 5: Envolver la app con el proveedor

### `src/app/layout.tsx`
```typescript
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
```

## Paso 6: Usar las traducciones en tus componentes

### En cualquier componente (debe tener `'use client'`)
```typescript
'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function MyComponent() {
  const { t } = useLanguage();  // Obtener función de traducción

  return (
    <div>
      <LanguageSwitcher />  {/* Mostrar selector */}
      <h1>{t('login.title')}</h1>  {/* Usar traducción */}
      <label>{t('login.email')}</label>
      <input placeholder={t('login.emailPlaceholder')} />
      {errors.email && <p>{t('login.errors.emailRequired')}</p>}
    </div>
  );
}
```

## ¿Cómo funciona?

1. **JSON Files**: Guardas las traducciones en archivos JSON organizados por idioma
2. **Contexto Global**: El `LanguageContext` mantiene el idioma actual y lo guarda en `localStorage`
3. **Hook `useLanguage()`**: Cualquier componente usa este hook para acceder a:
   - `language`: idioma actual ('en' o 'es')
   - `setLanguage()`: cambiar de idioma
   - `t()`: función para obtener traducciones
4. **Notación de Punto**: `t('login.email')` accede a `es.json → login → email`
5. **Persistencia**: El idioma elegido se guarda en el navegador

## Ejemplo: Agregar un nuevo idioma (Francés)

1. Crear `src/i18n/fr.json`:
```json
{
  "login": {
    "title": "Connexion",
    "email": "Email",
    "errors": {
      "emailRequired": "L'email est requis"
    }
  }
}
```

2. Actualizar `src/i18n/index.ts`:
```typescript
import fr from './fr.json';

export type Language = 'en' | 'es' | 'fr';

const translations = { en, es, fr };

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
];
```


## Ventajas

✅ **Simple**: Solo JSON + un contexto React
✅ **Flexible**: Fácil agregar nuevos idiomas
✅ **Persistente**: Guarda preferencia del usuario
✅ **Escalable**: Soporta traducciones anidadas
✅ **Type-safe**: TypeScript para Language type

## Próximas mejoras (opcional)

- Agregar más idiomas
- Cargar traducciones del servidor
- Sincronizar con idioma del sistema operativo
- Traducir mensajes de error del backend
