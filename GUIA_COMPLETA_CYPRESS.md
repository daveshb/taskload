#  Guía Completa: Configuración de Cypress E2E Testing

**De cero a testing completo en un proyecto Next.js + TypeScript**

---

##  Tabla de Contenidos

1. [Pre-requisitos](#pre-requisitos)
2. [Instalación](#instalación)
3. [Configuración inicial](#configuración-inicial)
4. [Estructura de archivos](#estructura-de-archivos)
5. [Scripts de package.json](#scripts-de-packagejson)
6. [Primer test](#primer-test)
7. [Comandos personalizados](#comandos-personalizados)
8. [Tests avanzados](#tests-avanzados)
9. [Fixtures y datos de prueba](#fixtures-y-datos-de-prueba)
10. [Ejecución de tests](#ejecución-de-tests)
11. [Troubleshooting](#troubleshooting)
12. [Best practices](#best-practices)
13. [Checklist final](#checklist-final)

---

##  Pre-requisitos

Antes de comenzar, asegúrate de tener:

- ✅ Node.js versión 18 o superior
- ✅ npm o yarn instalado
- ✅ Un proyecto Next.js con TypeScript
- ✅ Proyecto funcionando en `http://localhost:3000`

**Verificar versiones:**
```bash
node --version  # >= 18.0.0
npm --version   # >= 8.0.0
```

---

##  Paso 1: Instalación

### 1.1 Instalar Cypress y dependencias principales

```bash
# Navegar a tu proyecto
cd tu-proyecto

# Instalar Cypress
npm install -D cypress

# Instalar dependencias útiles
npm install -D start-server-and-test @types/cypress
```

**¿Qué instala cada paquete?**
- `cypress`: Framework principal de testing E2E
- `start-server-and-test`: Automatiza inicio de servidor + tests
- `@types/cypress`: Tipos de TypeScript para mejor desarrollo

### 1.2 Verificar instalación

```bash
# Verificar que se instaló correctamente
npm list cypress
```

---

##  Paso 2: Configuración inicial

### 2.1 Ejecutar Cypress por primera vez

```bash
npx cypress open
```

**Esto creará:**
- Directorio `cypress/`
- Archivo `cypress.config.js`
- Estructura de directorios básica

### 2.2 Convertir configuración a TypeScript

```bash
# Cambiar nombre del archivo de configuración
mv cypress.config.js cypress.config.ts
```

### 2.3 Configurar cypress.config.ts

Reemplazar todo el contenido de `cypress.config.ts`:

```typescript
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // URL base de tu aplicación
    baseUrl: "http://localhost:3000",
    
    // Configuración de viewport
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Configuración de medios
    video: false, // Desactivar videos para desarrollo
    screenshotOnRunFailure: true,
    
    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    
    // Patrones de archivos
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    
    // Variables de entorno
    env: {
      apiUrl: "http://localhost:3000/api"
    },
    
    setupNodeEvents(on, config) {
      // Aquí puedes configurar plugins
    },
  },
});
```

---

##  Paso 3: Estructura de archivos

### 3.1 Convertir archivos JavaScript a TypeScript

```bash
# Convertir archivo de comandos
mv cypress/support/commands.js cypress/support/commands.ts

# Convertir archivo de configuración E2E
mv cypress/support/e2e.js cypress/support/e2e.ts
```

### 3.2 Crear directorios adicionales

```bash
# Crear directorio para fixtures (datos de prueba)
mkdir -p cypress/fixtures

# Verificar estructura creada
tree cypress/
```

### 3.3 Estructura final esperada

```
cypress/
├── e2e/                    # Tests E2E
│   ├── register.cy.ts      # Tests de registro
│   ├── login.cy.ts         # Tests de login
│   └── user-flow.cy.ts     # Tests de flujo completo
├── fixtures/               # Datos de prueba
│   ├── users.json          # Datos de usuarios
│   └── test-data.json      # Otros datos
├── support/               # Archivos de soporte
│   ├── commands.ts        # Comandos personalizados
│   └── e2e.ts            # Configuración global
└── cypress.config.ts      # Configuración principal
```

---

##  Paso 4: Scripts de package.json

### 4.1 Agregar scripts de Cypress

Abrir `package.json` y agregar estos scripts en la sección `"scripts"`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint",
    
    // Scripts de Cypress
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:test": "start-server-and-test dev 3000 cypress:run",
    "cypress:test:open": "start-server-and-test dev 3000 cypress:open"
  }
}
```

**Explicación de scripts:**
- `cypress:open`: Abre interfaz de Cypress (desarrollo)
- `cypress:run`: Ejecuta tests en modo headless (CI/CD)
- `cypress:test`: Inicia servidor automáticamente + ejecuta tests
- `cypress:test:open`: Inicia servidor automáticamente + abre interfaz

---

##  Paso 5: Primer test

### 5.1 Configurar archivos de soporte

**Archivo: `cypress/support/e2e.ts`**
```typescript
// ***********************************************************
// Configuración global que se ejecuta antes de todos los tests
// ***********************************************************

// Importar comandos personalizados
import './commands';

// Configuración global opcional
beforeEach(() => {
  // Código que se ejecuta antes de cada test
});
```

**Archivo: `cypress/support/commands.ts`**
```typescript
/// <reference types="cypress" />

// Declaración de tipos para comandos personalizados
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Comando personalizado para llenar formulario de registro
       */
      fillRegistrationForm(userData: {
        cc: string;
        name: string;
        tel: string;
        email: string;
        password: string;
      }): Chainable<void>;
      
      /**
       * Comando personalizado para generar usuario único
       */
      generateUniqueUser(): Chainable<{
        cc: string;
        name: string;
        tel: string;
        email: string;
        password: string;
      }>;
    }
  }
}

// Comando para llenar formulario de registro
Cypress.Commands.add('fillRegistrationForm', (userData) => {
  cy.get('input[name="cc"]').type(userData.cc);
  cy.get('input[name="name"]').type(userData.name);
  cy.get('input[name="tel"]').type(userData.tel);
  cy.get('input[name="email"]').type(userData.email);
  cy.get('input[name="pass"]').type(userData.password);
  cy.get('input[name="confirmPass"]').type(userData.password);
});

// Comando para generar usuario único
Cypress.Commands.add('generateUniqueUser', () => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  
  return cy.wrap({
    cc: `${timestamp}${randomNum}`.slice(-10),
    name: `Usuario Test ${randomNum}`,
    tel: `300${randomNum}${timestamp}`.slice(-10),
    email: `test${timestamp}${randomNum}@example.com`,
    password: 'TestPassword123!'
  });
});
```

### 5.2 Crear primer test básico

**Archivo: `cypress/e2e/home.cy.ts`**
```typescript
/// <reference types="cypress" />

describe('Página Principal', () => {
  beforeEach(() => {
    // Visitar página antes de cada test
    cy.visit('/');
  });

  it('debe cargar la página correctamente', () => {
    // Verificar que la página carga
    cy.get('body').should('be.visible');
  });

  it('debe tener el título correcto', () => {
    // Verificar título de la página
    cy.title().should('not.be.empty');
  });

  it('debe mostrar contenido principal', () => {
    // Verificar que hay contenido principal
    cy.get('h1, h2').should('be.visible');
  });
});
```

### 5.3 Ejecutar primer test

```bash
# Ejecutar con interfaz gráfica
npm run cypress:test:open
```

---

##  Paso 6: Comandos personalizados

### 6.1 Comandos para autenticación

Agregar al archivo `cypress/support/commands.ts`:

```typescript
// Comando para login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="pass"]').type(password);
  cy.get('button[type="submit"]').click();
});

// Comando para logout
Cypress.Commands.add('logout', () => {
  cy.get('button').contains('Cerrar Sesión').click();
});

// Comando para limpiar base de datos (desarrollo)
Cypress.Commands.add('clearTestData', () => {
  // Solo en ambiente de test
  if (Cypress.env('NODE_ENV') === 'test') {
    cy.request('DELETE', `${Cypress.env('apiUrl')}/test/clear`);
  }
});

// Actualizar declaración de tipos
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      clearTestData(): Chainable<void>;
    }
  }
}
```

---

##  Paso 7: Tests avanzados

### 7.1 Test de registro completo

**Archivo: `cypress/e2e/register.cy.ts`**
```typescript
/// <reference types="cypress" />

describe('Registro de Usuario', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  describe('Interfaz del formulario', () => {
    it('debe mostrar todos los campos requeridos', () => {
      cy.get('h2').should('contain', 'Crear nueva cuenta');
      
      // Verificar campos
      cy.get('input[name="cc"]').should('be.visible');
      cy.get('input[name="name"]').should('be.visible');
      cy.get('input[name="tel"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="pass"]').should('be.visible');
      cy.get('input[name="confirmPass"]').should('be.visible');
      
      // Verificar botón
      cy.get('button[type="submit"]').should('contain', 'Crear cuenta');
    });
  });

  describe('Validaciones', () => {
    it('debe mostrar errores para campos requeridos vacíos', () => {
      cy.get('button[type="submit"]').click();
      
      cy.get('.text-red-600').should('contain', 'La cédula es requerida');
      cy.get('.text-red-600').should('contain', 'El nombre es requerido');
      cy.get('.text-red-600').should('contain', 'La contraseña es requerida');
    });

    it('debe validar formato de email', () => {
      cy.fillRegistrationForm({
        cc: '1234567890',
        name: 'Test User',
        tel: '3001234567',
        email: 'email-invalido',
        password: 'TestPassword123!'
      });
      
      cy.get('button[type="submit"]').click();
      cy.get('.text-red-600').should('contain', 'Email inválido');
    });

    it('debe validar que las contraseñas coincidan', () => {
      cy.get('input[name="cc"]').type('1234567890');
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="pass"]').type('Password123');
      cy.get('input[name="confirmPass"]').type('DiferentePassword');
      
      cy.get('button[type="submit"]').click();
      cy.get('.text-red-600').should('contain', 'Las contraseñas no coinciden');
    });
  });

  describe('Registro exitoso', () => {
    it('debe registrar un nuevo usuario', () => {
      cy.generateUniqueUser().then((userData) => {
        cy.fillRegistrationForm(userData);
        cy.get('button[type="submit"]').click();
        
        // Verificar mensaje de éxito
        cy.get('.text-green-600').should('contain', 'Usuario registrado exitosamente');
        
        // Verificar redirección
        cy.url({ timeout: 3000 }).should('eq', Cypress.config().baseUrl + '/');
      });
    });

    it('debe mostrar estado de carga', () => {
      cy.generateUniqueUser().then((userData) => {
        cy.fillRegistrationForm(userData);
        cy.get('button[type="submit"]').click();
        
        // Verificar estado de carga
        cy.get('button[type="submit"]').should('contain', 'Registrando...');
        cy.get('button[type="submit"]').should('be.disabled');
      });
    });
  });

  describe('Manejo de errores', () => {
    it('debe manejar errores de servidor', () => {
      // Interceptar API y simular error
      cy.intercept('POST', '/api/user', { 
        statusCode: 500, 
        body: { success: false, message: 'Error interno del servidor' } 
      }).as('registerError');

      cy.generateUniqueUser().then((userData) => {
        cy.fillRegistrationForm(userData);
        cy.get('button[type="submit"]').click();
        
        cy.wait('@registerError');
        cy.get('.text-red-600').should('contain', 'Error interno del servidor');
      });
    });
  });
});
```

### 7.2 Test de flujo completo

**Archivo: `cypress/e2e/user-flow.cy.ts`**
```typescript
/// <reference types="cypress" />

describe('Flujo Completo de Usuario', () => {
  it('debe completar el flujo: registro → login → dashboard → logout', () => {
    cy.generateUniqueUser().then((userData) => {
      // PASO 1: Registro
      cy.visit('/register');
      cy.fillRegistrationForm(userData);
      cy.get('button[type="submit"]').click();
      
      // Verificar registro exitoso
      cy.get('.text-green-600').should('contain', 'Usuario registrado exitosamente');
      
      // PASO 2: Redirección al home
      cy.url({ timeout: 3000 }).should('eq', Cypress.config().baseUrl + '/');
      
      // PASO 3: Login
      cy.get('input[name="email"]').type(userData.email);
      cy.get('input[name="pass"]').type(userData.password);
      cy.get('button[type="submit"]').click();
      
      // PASO 4: Verificar dashboard
      cy.url({ timeout: 5000 }).should('include', '/dashboard');
      cy.get('h1').should('contain', 'TaskLoad Dashboard');
      cy.get('.text-gray-600').should('contain', userData.name);
      
      // PASO 5: Logout
      cy.get('button').contains('Cerrar Sesión').click();
      
      // PASO 6: Verificar vuelta al home
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.get('h2').should('contain', 'Iniciar Sesión');
    });
  });

  it('debe manejar login con credenciales incorrectas', () => {
    cy.visit('/');
    
    cy.get('input[name="email"]').type('usuario@noexiste.com');
    cy.get('input[name="pass"]').type('PasswordIncorrecto');
    cy.get('button[type="submit"]').click();
    
    cy.get('.text-red-600').should('contain', 'Credenciales inválidas');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
```

---

##  Paso 8: Fixtures y datos de prueba

### 8.1 Crear fixtures

**Archivo: `cypress/fixtures/users.json`**
```json
{
  "validUser": {
    "cc": "1234567890",
    "name": "Usuario Válido",
    "tel": "3001234567",
    "email": "valido@example.com",
    "password": "ValidPassword123!"
  },
  "invalidUsers": {
    "emptyFields": {
      "cc": "",
      "name": "",
      "tel": "",
      "email": "",
      "password": ""
    },
    "invalidEmail": {
      "cc": "1234567890",
      "name": "Usuario Test",
      "tel": "3001234567",
      "email": "email-invalido",
      "password": "Password123!"
    },
    "weakPassword": {
      "cc": "1234567890",
      "name": "Usuario Test",
      "tel": "3001234567",
      "email": "test@example.com",
      "password": "123"
    }
  },
  "testConfig": {
    "apiTimeout": 10000,
    "pageLoadTimeout": 30000
  }
}
```

**Archivo: `cypress/fixtures/test-data.json`**
```json
{
  "urls": {
    "home": "/",
    "register": "/register",
    "dashboard": "/dashboard"
  },
  "selectors": {
    "forms": {
      "registerForm": "form",
      "loginForm": "form"
    },
    "inputs": {
      "cc": "input[name='cc']",
      "name": "input[name='name']",
      "email": "input[name='email']",
      "password": "input[name='pass']"
    },
    "buttons": {
      "submit": "button[type='submit']",
      "logout": "button:contains('Cerrar Sesión')"
    }
  },
  "messages": {
    "success": {
      "register": "Usuario registrado exitosamente",
      "login": "Bienvenido"
    },
    "errors": {
      "requiredField": "es requerido",
      "invalidEmail": "Email inválido",
      "passwordMismatch": "Las contraseñas no coinciden",
      "invalidCredentials": "Credenciales inválidas"
    }
  }
}
```

### 8.2 Usar fixtures en tests

```typescript
describe('Tests con Fixtures', () => {
  it('debe usar datos de fixtures', () => {
    cy.fixture('users').then((users) => {
      cy.visit('/register');
      
      const user = users.validUser;
      cy.fillRegistrationForm(user);
      cy.get('button[type="submit"]').click();
    });
  });

  it('debe usar configuración de fixtures', () => {
    cy.fixture('test-data').then((data) => {
      cy.visit(data.urls.register);
      
      cy.get(data.selectors.inputs.cc).type('1234567890');
      cy.get(data.selectors.buttons.submit).click();
      
      cy.get('.text-red-600').should('contain', data.messages.errors.requiredField);
    });
  });
});
```

---

## ▶ Paso 9: Ejecución de tests

### 9.1 Modos de ejecución

**Modo desarrollo (con interfaz):**
```bash
# Inicia servidor automáticamente y abre Cypress UI
npm run cypress:test:open

# Solo abrir Cypress (servidor manual)
npm run dev          # Terminal 1
npm run cypress:open # Terminal 2
```

**Modo CI/CD (headless):**
```bash
# Inicia servidor automáticamente y ejecuta tests
npm run cypress:test

# Solo ejecutar tests (servidor manual)
npm run dev         # Terminal 1
npm run cypress:run # Terminal 2
```

**Opciones avanzadas:**
```bash
# Ejecutar tests específicos
npx cypress run --spec "cypress/e2e/register.cy.ts"

# Ejecutar en navegador específico
npx cypress run --browser chrome

# Ejecutar con configuración específica
npx cypress run --config baseUrl=http://localhost:3001
```

### 9.2 Scripts útiles para desarrollo

**Archivo: `scripts/test.sh`**
```bash
#!/bin/bash

# Script para ejecutar tests completos

echo "🚀 Iniciando tests E2E..."

# Matar procesos previos en puerto 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Esperar un momento
sleep 2

# Ejecutar tests
npm run cypress:test

echo "✅ Tests completados"
```

---

##  Paso 10: Troubleshooting

### 10.1 Problemas comunes y soluciones

**Error: Port 3000 is already in use**
```bash
# Solución 1: Matar proceso
lsof -ti:3000 | xargs kill -9

# Solución 2: Usar otro puerto
npm run dev -- --port 3001
# Y cambiar baseUrl en cypress.config.ts
```

**Error: Cannot resolve module 'cypress'**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
npm install -D cypress @types/cypress
```

**Error: TypeScript no reconoce tipos**
```bash
# Verificar tsconfig.json
{
  "compilerOptions": {
    "types": ["cypress", "node", "jest"]
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "cypress/**/*"
  ]
}
```

**Error: Tests fallan por timeout**
```typescript
// Aumentar timeouts en cypress.config.ts
{
  defaultCommandTimeout: 20000,
  requestTimeout: 20000,
  responseTimeout: 20000,
  pageLoadTimeout: 60000
}
```

**Error: Base de datos con datos de prueba**
```typescript
// Limpiar datos antes de cada test
beforeEach(() => {
  cy.clearTestData(); // Comando personalizado
});
```

### 10.2 Debugging avanzado

**Habilitar debugging en tests:**
```typescript
it('debug test', () => {
  cy.visit('/');
  cy.debug(); // Pausa ejecución
  cy.get('button').click();
});
```

**Logs detallados:**
```typescript
// En cypress.config.ts
{
  env: {
    NODE_ENV: 'test'
  },
  setupNodeEvents(on, config) {
    on('task', {
      log(message) {
        console.log(message);
        return null;
      }
    });
  }
}

// En tests
cy.task('log', 'Debug message');
```

---

## ✨ Paso 11: Best practices

### 11.1 Organización de tests

**Estructura recomendada:**
```
cypress/
├── e2e/
│   ├── auth/
│   │   ├── login.cy.ts
│   │   ├── register.cy.ts
│   │   └── logout.cy.ts
│   ├── user/
│   │   ├── profile.cy.ts
│   │   └── settings.cy.ts
│   └── flows/
│       └── complete-user-journey.cy.ts
├── fixtures/
│   ├── auth/
│   │   └── users.json
│   └── shared/
│       └── config.json
└── support/
    ├── commands/
    │   ├── auth.ts
    │   └── form.ts
    └── utils/
        └── data-generators.ts
```

### 11.2 Naming conventions

```typescript
// ✅ Buenos nombres
describe('Registro de Usuario', () => {
  it('debe registrar usuario con datos válidos', () => {});
  it('debe mostrar error cuando email es inválido', () => {});
});

// ❌ Malos nombres
describe('Test', () => {
  it('funciona', () => {});
});
```

### 11.3 Selectors resistentes

```typescript
// ✅ Buenos selectores
cy.get('[data-cy=submit-button]'); // Data attributes
cy.get('[aria-label="Cerrar sesión"]'); // ARIA labels
cy.get('button').contains('Enviar'); // Texto visible

// ❌ Selectores frágiles
cy.get('.btn-primary'); // Clases CSS
cy.get('#button-123'); // IDs específicos
```

### 11.4 Page Object Model (opcional)

**Archivo: `cypress/support/pages/RegisterPage.ts`**
```typescript
export class RegisterPage {
  visit() {
    cy.visit('/register');
    return this;
  }

  fillForm(userData: any) {
    cy.get('input[name="cc"]').type(userData.cc);
    cy.get('input[name="name"]').type(userData.name);
    cy.get('input[name="email"]').type(userData.email);
    cy.get('input[name="pass"]').type(userData.password);
    cy.get('input[name="confirmPass"]').type(userData.password);
    return this;
  }

  submit() {
    cy.get('button[type="submit"]').click();
    return this;
  }

  shouldShowSuccessMessage() {
    cy.get('.text-green-600').should('contain', 'Usuario registrado exitosamente');
    return this;
  }

  shouldShowError(message: string) {
    cy.get('.text-red-600').should('contain', message);
    return this;
  }
}

// Uso en tests
import { RegisterPage } from '../support/pages/RegisterPage';

it('debe registrar usuario', () => {
  const registerPage = new RegisterPage();
  
  registerPage
    .visit()
    .fillForm(userData)
    .submit()
    .shouldShowSuccessMessage();
});
```

---

## ✅ Paso 12: Checklist final

Verifica que todo esté configurado correctamente:

###  Instalación
- [ ] `cypress` instalado como devDependency
- [ ] `start-server-and-test` instalado
- [ ] `@types/cypress` instalado para TypeScript
- [ ] Node.js versión 18+ instalado

###  Configuración
- [ ] `cypress.config.ts` existe y está configurado
- [ ] `baseUrl` configurada correctamente
- [ ] Timeouts apropiados configurados
- [ ] Scripts agregados a `package.json`

###  Estructura
- [ ] Directorio `cypress/e2e/` existe
- [ ] Directorio `cypress/support/` existe
- [ ] Directorio `cypress/fixtures/` existe
- [ ] Archivos `.ts` (no `.js`) en support/

###  Tests
- [ ] Al menos un test básico funciona
- [ ] Comandos personalizados configurados
- [ ] Fixtures con datos de prueba creadas
- [ ] Tests cubren casos principales

###  Ejecución
- [ ] `npm run cypress:test:open` funciona
- [ ] `npm run cypress:test` funciona en headless
- [ ] Tests pasan sin errores
- [ ] Servidor inicia automáticamente

### ´ Desarrollo
- [ ] TypeScript funciona sin errores
- [ ] Autocompletado funciona en IDE
- [ ] Debugging habilitado
- [ ] Screenshots en fallos configurados

###  CI/CD Ready
- [ ] Tests ejecutan en modo headless
- [ ] Exit codes correctos
- [ ] Sin dependencias de estado global
- [ ] Datos de prueba únicos por test

---

##  Comandos de verificación rápida

**Verificar instalación completa:**
```bash
# 1. Verificar dependencias
npm list cypress start-server-and-test @types/cypress

# 2. Verificar estructura
find cypress -name "*.ts" -o -name "*.json" | head -10

# 3. Test rápido
npm run cypress:test 2>/dev/null && echo "✅ Todo funciona" || echo "❌ Hay errores"
```

**Test de configuración:**
```bash
# Ejecutar test básico
npx cypress run --spec "cypress/e2e/home.cy.ts" --browser electron
```

---

##  ¡Configuración Completa!

Si llegaste hasta aquí y todos los checkboxes están marcados ✅, ¡felicidades! Tienes una configuración completa y profesional de Cypress.

###  Próximos pasos recomendados:

1. **Escribir tests específicos** para tu aplicación
2. **Configurar CI/CD** para ejecutar tests automáticamente
3. **Implementar Page Object Models** para proyectos grandes
4. **Agregar tests de performance** con Lighthouse
5. **Configurar tests visuales** con herramientas como Percy

###  Recursos adicionales:

- [Documentación oficial de Cypress](https://docs.cypress.io/)
- [Best practices de Cypress](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app) - Ejemplo completo

