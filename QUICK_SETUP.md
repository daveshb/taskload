#  Guía Rápida: Cypress Setup en 10 minutos

##  1. Instalación (2 min)

```bash
# Instalar Cypress y dependencias
npm install -D cypress start-server-and-test @types/cypress

# Primera ejecución para crear estructura
npx cypress open
```

##  2. Configuración básica (3 min)

### Crear `cypress.config.ts`:
```typescript
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    setupNodeEvents() {},
  },
});
```

### Actualizar `package.json`:
```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:test": "start-server-and-test dev 3000 cypress:run",
    "cypress:test:open": "start-server-and-test dev 3000 cypress:open"
  }
}
```

##  3. Estructura de archivos (2 min)

```bash
# Convertir archivos a TypeScript
mv cypress/support/e2e.js cypress/support/e2e.ts
mv cypress/support/commands.js cypress/support/commands.ts

# Crear directorios adicionales
mkdir -p cypress/fixtures
```

##  4. Primer test (2 min)

### Crear `cypress/e2e/basic.cy.ts`:
```typescript
describe('Mi primer test', () => {
  it('debe cargar la página', () => {
    cy.visit('/');
    cy.contains('h1').should('be.visible');
  });
});
```

##  5. Ejecutar (1 min)

```bash
# Con interfaz gráfica
npm run cypress:test:open

# En modo headless
npm run cypress:test
```

##  ¡Listo en 10 minutos!

Ya tienes Cypress funcionando. Para tests más avanzados, consulta la guía completa en `CYPRESS_SETUP_GUIDE.md`.

### Comandos esenciales:
- `npm run cypress:test:open` - Desarrollo con UI
- `npm run cypress:test` - CI/CD headless
- `cy.visit('/')` - Navegar a página
- `cy.get('selector')` - Seleccionar elemento
- `cy.type('texto')` - Escribir texto
- `cy.click()` - Hacer clic
- `cy.should('be.visible')` - Verificar estado