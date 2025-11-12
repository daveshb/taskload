'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/auth';
import { Button } from "@/components/button/Button";

interface LoginFormData {
  email: string;
  pass: string;
}

interface LoginErrors {
  email?: string;
  pass?: string;
  submit?: string;
}

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    pass: ''
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar contraseña
    if (!formData.pass) {
      newErrors.pass = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof LoginErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await loginUser(formData);
      
      if (response.success) {
        // Guardar datos del usuario en localStorage (opcional)
        if (response.data?.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        // Redirigir al dashboard
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setErrors({
          submit: axiosError.response?.data?.message || 'Error al iniciar sesión'
        });
      } else {
        setErrors({
          submit: 'Error al iniciar sesión'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">TaskLoad</h1>
          <h2 className="text-2xl font-bold text-gray-700">Iniciar Sesión</h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Ingrese su email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="pass" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="pass"
                name="pass"
                type="password"
                required
                value={formData.pass}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Ingrese su contraseña"
              />
              {errors.pass && <p className="mt-1 text-sm text-red-600">{errors.pass}</p>}
            </div>
          </div>

          {/* Mensajes de error */}
          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Botones */}
          <div className="space-y-3">
            <Button
              text={isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              type="submit"
              variant="primary"
              size="lg"
              fullWidth={true}
              disabled={isLoading}
              aria-label="Iniciar sesión en la aplicación"
            />
            
            <div className="text-center">
              <Button
                text="¿No tienes cuenta? Registrarse"
                type="button"
                variant="outline"
                size="md"
                fullWidth={true}
                onClick={goToRegister}
                aria-label="Ir a la página de registro"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
