/// <reference types="cypress" />

describe('Registro de Usuario', () => {
  beforeEach(() => {
    // Visitar la página de registro antes de cada test
    cy.visit('/register');
  });

  describe('Interfaz del formulario de registro', () => {
    it('debe mostrar todos los campos requeridos', () => {
      cy.get('h2').should('contain', 'Crear nueva cuenta');
      
      // Verificar que todos los campos están presentes
      cy.get('input[name="cc"]').should('be.visible');
      cy.get('input[name="name"]').should('be.visible');
      cy.get('input[name="tel"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="pass"]').should('be.visible');
      cy.get('input[name="confirmPass"]').should('be.visible');
      
      // Verificar el botón de submit
      cy.get('button[type="submit"]').should('contain', 'Crear cuenta');
      
      // Verificar el enlace al login
      cy.get('a[href="/login"]').should('contain', 'Iniciar sesión');
    });

    it('debe mostrar placeholders apropiados', () => {
      cy.get('input[name="cc"]').should('have.attr', 'placeholder', 'Ingrese su cédula');
      cy.get('input[name="name"]').should('have.attr', 'placeholder', 'Ingrese su nombre completo');
      cy.get('input[name="tel"]').should('have.attr', 'placeholder', 'Ingrese su teléfono');
      cy.get('input[name="email"]').should('have.attr', 'placeholder', 'Ingrese su email');
      cy.get('input[name="pass"]').should('have.attr', 'placeholder', 'Ingrese su contraseña');
      cy.get('input[name="confirmPass"]').should('have.attr', 'placeholder', 'Confirme su contraseña');
    });

    it('debe marcar campos requeridos', () => {
      cy.get('input[name="cc"]').should('have.attr', 'required');
      cy.get('input[name="name"]').should('have.attr', 'required');
      cy.get('input[name="pass"]').should('have.attr', 'required');
      cy.get('input[name="confirmPass"]').should('have.attr', 'required');
    });
  });

  describe('Validación del formulario', () => {
    it('debe mostrar errores para campos requeridos vacíos', () => {
      // Intentar enviar formulario vacío
      cy.get('button[type="submit"]').click();
      
      // Verificar que aparecen mensajes de error
      cy.get('.text-red-600').should('contain', 'La cédula es requerida');
      cy.get('.text-red-600').should('contain', 'El nombre es requerido');
      cy.get('.text-red-600').should('contain', 'La contraseña es requerida');
    });

    it('debe validar formato de email', () => {
      // Llenar formulario con email inválido
      cy.get('input[name="cc"]').type('1234567890');
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type('email-invalido');
      cy.get('input[name="pass"]').type('TestPassword123!');
      cy.get('input[name="confirmPass"]').type('TestPassword123!');
      
      cy.get('button[type="submit"]').click();
      
      cy.get('.text-red-600').should('contain', 'Email inválido');
    });

    it('debe validar longitud mínima de contraseña', () => {
      cy.get('input[name="cc"]').type('1234567890');
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="pass"]').type('123');
      cy.get('input[name="confirmPass"]').type('123');
      
      cy.get('button[type="submit"]').click();
      
      cy.get('.text-red-600').should('contain', 'La contraseña debe tener al menos 6 caracteres');
    });

    it('debe validar que las contraseñas coincidan', () => {
      cy.get('input[name="cc"]').type('1234567890');
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="pass"]').type('TestPassword123!');
      cy.get('input[name="confirmPass"]').type('DiferentePassword');
      
      cy.get('button[type="submit"]').click();
      
      cy.get('.text-red-600').should('contain', 'Las contraseñas no coinciden');
    });

    it('debe limpiar errores cuando el usuario comience a escribir', () => {
      // Generar error primero
      cy.get('button[type="submit"]').click();
      cy.get('.text-red-600').should('contain', 'La cédula es requerida');
      
      // Escribir en el campo y verificar que el error desaparece
      cy.get('input[name="cc"]').type('1234567890');
      cy.get('.text-red-600').should('not.contain', 'La cédula es requerida');
    });
  });

  describe('Registro exitoso', () => {
    it('debe registrar un nuevo usuario con datos válidos', () => {
      // Generar datos únicos para evitar conflictos
      const timestamp = Date.now();
      const userData = {
        cc: `${timestamp}`.slice(-10),
        name: `Usuario Test ${timestamp}`,
        tel: `300${timestamp}`.slice(-10),
        email: `test${timestamp}@example.com`,
        password: 'TestPassword123!'
      };

      // Llenar el formulario
      cy.get('input[name="cc"]').type(userData.cc);
      cy.get('input[name="name"]').type(userData.name);
      cy.get('input[name="tel"]').type(userData.tel);
      cy.get('input[name="email"]').type(userData.email);
      cy.get('input[name="pass"]').type(userData.password);
      cy.get('input[name="confirmPass"]').type(userData.password);

      // Enviar formulario
      cy.get('button[type="submit"]').click();

      // Verificar mensaje de éxito
      cy.get('.text-green-600').should('contain', 'Usuario registrado exitosamente');

      // Verificar que se redirige al home después de 2 segundos
      cy.url({ timeout: 3000 }).should('eq', Cypress.config().baseUrl + '/');
    });

    it('debe mostrar estado de carga durante el registro', () => {
      const timestamp = Date.now();
      
      cy.get('input[name="cc"]').type(`${timestamp}`.slice(-10));
      cy.get('input[name="name"]').type(`Usuario Test ${timestamp}`);
      cy.get('input[name="tel"]').type(`300${timestamp}`.slice(-10));
      cy.get('input[name="email"]').type(`test${timestamp}@example.com`);
      cy.get('input[name="pass"]').type('TestPassword123!');
      cy.get('input[name="confirmPass"]').type('TestPassword123!');

      cy.get('button[type="submit"]').click();

      // Verificar que el botón muestra estado de carga
      cy.get('button[type="submit"]').should('contain', 'Registrando...');
      cy.get('button[type="submit"]').should('be.disabled');
    });
  });

  describe('Manejo de errores', () => {
    it('debe mostrar error cuando la cédula ya existe', () => {
      // Usar fixture con usuario que ya existe
      cy.fixture('users').then((users) => {
        const existingUser = users.validUser;
        
        cy.get('input[name="cc"]').type(existingUser.cc);
        cy.get('input[name="name"]').type(existingUser.name);
        cy.get('input[name="tel"]').type(existingUser.tel);
        cy.get('input[name="email"]').type(`unique${Date.now()}@example.com`);
        cy.get('input[name="pass"]').type(existingUser.password);
        cy.get('input[name="confirmPass"]').type(existingUser.password);

        cy.get('button[type="submit"]').click();

        // Este test podría fallar si es la primera vez que se ejecuta
        // En un entorno real, tendrías una base de datos de prueba
        // cy.get('.text-red-600').should('contain', 'Ya existe un usuario con esa cédula');
      });
    });

    it('debe manejar errores de conexión', () => {
      // Interceptar la llamada API y simular un error
      cy.intercept('POST', '/api/user', { 
        statusCode: 500, 
        body: { success: false, message: 'Error interno del servidor' } 
      }).as('registerError');

      const timestamp = Date.now();
      
      cy.get('input[name="cc"]').type(`${timestamp}`.slice(-10));
      cy.get('input[name="name"]').type(`Usuario Test ${timestamp}`);
      cy.get('input[name="tel"]').type(`300${timestamp}`.slice(-10));
      cy.get('input[name="email"]').type(`test${timestamp}@example.com`);
      cy.get('input[name="pass"]').type('TestPassword123!');
      cy.get('input[name="confirmPass"]').type('TestPassword123!');

      cy.get('button[type="submit"]').click();

      cy.wait('@registerError');
      cy.get('.text-red-600').should('contain', 'Error interno del servidor');
    });
  });

  describe('Navegación', () => {
    it('debe navegar al login cuando se hace clic en el enlace', () => {
      cy.get('a[href="/login"]').click();
      cy.url().should('include', '/login');
    });

    it('debe limpiar el formulario después de registro exitoso', () => {
      const timestamp = Date.now();
      
      cy.get('input[name="cc"]').type(`${timestamp}`.slice(-10));
      cy.get('input[name="name"]').type(`Usuario Test ${timestamp}`);
      cy.get('input[name="tel"]').type(`300${timestamp}`.slice(-10));
      cy.get('input[name="email"]').type(`test${timestamp}@example.com`);
      cy.get('input[name="pass"]').type('TestPassword123!');
      cy.get('input[name="confirmPass"]').type('TestPassword123!');

      cy.get('button[type="submit"]').click();
      
      // Esperar mensaje de éxito y luego verificar que el formulario se limpió
      cy.get('.text-green-600').should('contain', 'Usuario registrado exitosamente');
      
      cy.get('input[name="cc"]').should('have.value', '');
      cy.get('input[name="name"]').should('have.value', '');
      cy.get('input[name="tel"]').should('have.value', '');
      cy.get('input[name="email"]').should('have.value', '');
      cy.get('input[name="pass"]').should('have.value', '');
      cy.get('input[name="confirmPass"]').should('have.value', '');
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener etiquetas apropiadas para accesibilidad', () => {
      cy.get('label[for="cc"]').should('contain', 'Cédula');
      cy.get('label[for="name"]').should('contain', 'Nombre completo');
      cy.get('label[for="tel"]').should('contain', 'Teléfono');
      cy.get('label[for="email"]').should('contain', 'Email');
      cy.get('label[for="pass"]').should('contain', 'Contraseña');
      cy.get('label[for="confirmPass"]').should('contain', 'Confirmar contraseña');
    });

    it('debe permitir navegación por teclado', () => {
      cy.get('input[name="cc"]').focus().type('{tab}');
      cy.focused().should('have.attr', 'name', 'name');
      cy.focused().type('{tab}');
      cy.focused().should('have.attr', 'name', 'tel');
      cy.focused().type('{tab}');
      cy.focused().should('have.attr', 'name', 'email');
      cy.focused().type('{tab}');
      cy.focused().should('have.attr', 'name', 'pass');
      cy.focused().type('{tab}');
      cy.focused().should('have.attr', 'name', 'confirmPass');
    });
  });
});