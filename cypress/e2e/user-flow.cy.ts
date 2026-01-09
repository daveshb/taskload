/// <reference types="cypress" />

describe('Flujo completo de registro y login', () => {
  it('debe permitir registrarse y luego hacer login', () => {
    const timestamp = Date.now();
    const userData = {
      cc: `${timestamp}`.slice(-10),
      name: `Usuario Test ${timestamp}`,
      tel: `300${timestamp}`.slice(-10),
      email: `test${timestamp}@example.com`,
      password: 'TestPassword123!'
    };

    // 1. Ir a registro
    cy.visit('/register');
    
    // 2. Llenar formulario de registro
    cy.get('input[name="cc"]').type(userData.cc);
    cy.get('input[name="name"]').type(userData.name);
    cy.get('input[name="tel"]').type(userData.tel);
    cy.get('input[name="email"]').type(userData.email);
    cy.get('input[name="pass"]').type(userData.password);
    cy.get('input[name="confirmPass"]').type(userData.password);

    // 3. Enviar registro
    cy.get('button[type="submit"]').click();
    
    // 4. Verificar mensaje de éxito
    cy.get('.text-green-600').should('contain', 'Usuario registrado exitosamente');
    
    // 5. Esperar redirección al home
    cy.url({ timeout: 3000 }).should('eq', Cypress.config().baseUrl + '/');
    
    // 6. Verificar que estamos en la página de login
    cy.get('h2').should('contain', 'Iniciar Sesión');
    
    // 7. Hacer login con las credenciales del registro
    cy.get('input[name="email"]').type(userData.email);
    cy.get('input[name="pass"]').type(userData.password);
    cy.get('button[type="submit"]').click();
    
    // 8. Verificar redirección al dashboard
    cy.url({ timeout: 5000 }).should('include', '/dashboard');
    
    // 9. Verificar que estamos en el dashboard
    cy.get('h1').should('contain', 'TaskLoad Dashboard');
    cy.get('.text-sm.text-gray-600').should('contain', `Bienvenido, ${userData.name}`);
    
    // 10. Verificar que la información del usuario es correcta
    cy.get('.text-gray-600').should('contain', userData.cc);
    cy.get('.text-gray-600').should('contain', userData.email);
    cy.get('.text-gray-600').should('contain', userData.tel);
  });

  it('debe manejar errores de login con credenciales incorrectas', () => {
    cy.visit('/');
    
    // Intentar login con credenciales incorrectas
    cy.get('input[name="email"]').type('usuario@noexiste.com');
    cy.get('input[name="pass"]').type('PasswordIncorrecto');
    cy.get('button[type="submit"]').click();
    
    // Verificar mensaje de error
    cy.get('.text-red-600').should('contain', 'Credenciales inválidas');
    
    // Verificar que permanecemos en la página de login
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('debe permitir logout desde el dashboard', () => {
    // Primero registrar un usuario y hacer login
    const timestamp = Date.now();
    const userData = {
      cc: `${timestamp}`.slice(-10),
      name: `Usuario Test ${timestamp}`,
      tel: `300${timestamp}`.slice(-10),
      email: `test${timestamp}@example.com`,
      password: 'TestPassword123!'
    };

    // Registro
    cy.visit('/register');
    cy.get('input[name="cc"]').type(userData.cc);
    cy.get('input[name="name"]').type(userData.name);
    cy.get('input[name="tel"]').type(userData.tel);
    cy.get('input[name="email"]').type(userData.email);
    cy.get('input[name="pass"]').type(userData.password);
    cy.get('input[name="confirmPass"]').type(userData.password);
    cy.get('button[type="submit"]').click();

    // Esperar redirección y hacer login
    cy.url({ timeout: 3000 }).should('eq', Cypress.config().baseUrl + '/');
    cy.get('input[name="email"]').type(userData.email);
    cy.get('input[name="pass"]').type(userData.password);
    cy.get('button[type="submit"]').click();

    // Verificar que estamos en dashboard
    cy.url({ timeout: 5000 }).should('include', '/dashboard');
    
    // Hacer logout
    cy.get('button').contains('Cerrar Sesión').click();
    
    // Verificar que volvemos al home
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('h2').should('contain', 'Iniciar Sesión');
  });
});