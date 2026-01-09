
# Seguridad y Validación en Next.js — Guía Completa

## 1. Validación de Datos con Yup

La validación de datos es uno de los pilares principales de la seguridad en cualquier aplicación web moderna. Incluso cuando confías en que un cliente enviará datos correctos, **nunca debes asumir que los datos que llegan al servidor son confiables**. Un atacante puede modificar fácilmente una solicitud, interceptarla y manipularla antes de enviarla.  
Por esto, es esencial validar **todos los datos que entran** a tu aplicación.

Yup se ha convertido en una de las librerías más populares en el ecosistema JavaScript gracias a su sintaxis declarativa, clara y flexible. Permite crear esquemas complejos, reutilizar reglas de validación y manejar errores con elegancia.

### ¿Por qué usar Yup?

- Permite definir estructuras estrictas para objetos.
- Evita datos incompletos o mal formateados.
- Protege los endpoints al validar el contenido antes de procesarlo.
- Funciona perfectamente en **Next.js App Router**.

### Ejemplo en Next.js (App Router)

```ts
import { NextResponse } from "next/server";
import * as yup from "yup";

// Esquema de validación
const userSchema = yup.object().shape({
  username: yup.string().required().min(3),
  email: yup.string().email().required(),
  password: yup.string().required().min(8),
});

// Endpoint POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validData = await userSchema.validate(body);

    return NextResponse.json(
      { message: "Usuario válido", data: validData },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
```

---

## 2. Validación y Tipado con TypeScript

TypeScript agrega una capa adicional de seguridad al momento del desarrollo. Aunque **no valida datos en tiempo de ejecución**, sí evita errores estructurales y evita que pases objetos mal formados dentro de la lógica interna de tu aplicación.

### Beneficios clave:

- Detección de errores antes de ejecutar el código.
- Mejora la autocompletación y la documentación interna.
- Garantiza estructuras consistentes.
- Funciona perfecto junto con Yup (Yup valida en runtime, TS valida en tiempo de compilación).

### Ejemplo:

```ts
interface User {
  username: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body: User = await request.json();
    return NextResponse.json({ message: "Usuario procesado" });
  } catch {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
}
```

---

## 3. Cross-Site Scripting (XSS)

El XSS es una de las vulnerabilidades más comunes en aplicaciones web. Consiste en la inyección de código malicioso (generalmente JavaScript) que luego es ejecutado por otro usuario al cargar la página afectada.

### ¿Qué puede lograr un atacante?

- Robar cookies o tokens de sesión.
- Suplantar identidad del usuario.
- Realizar acciones en nombre de la víctima.
- Manipular el DOM para mostrar contenido engañoso.

### Cómo Next.js protege automáticamente

React escapa cualquier dato dinámico en JSX:

```tsx
const msg = "<script>alert('XSS')</script>";
return <p>{msg}</p>; // Se renderiza como texto, no se ejecuta el script
```

Esto bloquea la mayoría de ataques, pero no todos.

---

## 4. Uso de dangerouslySetInnerHTML con Escapado Seguro

`dangerouslySetInnerHTML` desactiva la protección XSS automática.  
Solo debe usarse cuando no exista otra alternativa, como en:

- HTML que viene desde CMS.
- Contenido almacenado en base de datos como HTML.
- Renderizado de artículos, blogs o correos.

### Solución: Sanitizar el HTML

Usamos **DOMPurify**, el estándar de la industria.

```tsx
import DOMPurify from "isomorphic-dompurify";

export default function SafeContent({ content }: { content: string }) {
  const clean = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

Esto elimina:

- `<script>`
- eventos como `onclick`
- enlaces maliciosos
- payloads escondidos

---

## 5. Protección Contra CSRF (Cross-Site Request Forgery)

CSRF consiste en engañar a un usuario autenticado para que ejecute acciones sin su consentimiento.  
Ejemplo: cambiar su contraseña o realizar una transacción.

### NextAuth protege automáticamente

Cuando usas NextAuth, se agrega un token CSRF a formularios y endpoints sensibles.

### Ejemplo en App Router

```ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Clave", type: "password" }
      },
      async authorize(credentials) {
        return { id: "1", name: "User" };
      }
    })
  ]
});

export { handler as GET, handler as POST };
```

No necesitas configurar nada adicional.

---

## 6. Content Security Policy (CSP)

La CSP es una de las medidas más fuertes para mitigar ataques XSS.  
Define reglas sobre qué recursos la app puede cargar.

### Beneficios:

- Previene ejecución de scripts externos.
- Bloquea inyecciones no autorizadas.
- Controla cargas de imágenes, estilos, fuentes y más.

### Implementación en middleware:

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  res.headers.set(
    "Content-Security-Policy",
    `
      default-src 'self';
      script-src 'self';
      style-src 'self';
      img-src 'self' https:;
    `
  );

  return res;
}
```

Esto evita que scripts externos maliciosos se ejecuten.

---

# Conclusión

La seguridad en Next.js no depende de una sola técnica, sino de la combinación de varias capas:

- **Yup** valida en tiempo de ejecución.
- **TypeScript** valida en tiempo de desarrollo.
- **XSS protections** protegen el renderizado.
- **DOMPurify** limpia contenido dinámico.
- **NextAuth** añade protección CSRF.
- **CSP** evita cargas inseguras.

Aplicar todas estas medidas convierte tu app en una aplicación robusta, moderna y altamente segura.

¡Sigue aprendiendo y mejorando tus habilidades para crear aplicaciones profesionales!

