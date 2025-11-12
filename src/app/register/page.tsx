'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/services/register';
import { Button } from '@/components/button/Button';

interface FormData {
  cc: string;
  name: string;
  tel: string;
  email: string;
  pass: string;
  confirmPass: string;
}

interface FormErrors {
  cc?: string;
  name?: string;
  tel?: string;
  email?: string;
  pass?: string;
  confirmPass?: string;
  submit?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    cc: '',
    name: '',
    tel: '',
    email: '',
    pass: '',
    confirmPass: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar CC
    if (!formData.cc.trim()) {
      newErrors.cc = 'La cédula es requerida';
    }

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    // Validar email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar contraseña
    if (!formData.pass) {
      newErrors.pass = 'La contraseña es requerida';
    } else if (formData.pass.length < 6) {
      newErrors.pass = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (formData.pass !== formData.confirmPass) {
      newErrors.confirmPass = 'Las contraseñas no coinciden';
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
    if (errors[name as keyof FormErrors]) {
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
    setSuccessMessage('');

    try {
      const userData = {
        cc: formData.cc,
        name: formData.name,
        tel: formData.tel,
        email: formData.email,
        pass: formData.pass,
      };

      await registerUser(userData);
      
      setSuccessMessage('Usuario registrado exitosamente');
      
      // Redirigir al home después de 2 segundos
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
      setFormData({
        cc: '',
        name: '',
        tel: '',
        email: '',
        pass: '',
        confirmPass: '',
      });
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setErrors({
          submit: axiosError.response?.data?.message || 'Error al registrar usuario'
        });
      } else {
        setErrors({
          submit: 'Error al registrar usuario'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear nueva cuenta
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Cédula */}
            <div>
              <label htmlFor="cc" className="block text-sm font-medium text-gray-700">
                Cédula *
              </label>
              <input
                id="cc"
                name="cc"
                type="text"
                required
                value={formData.cc}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Ingrese su cédula"
              />
              {errors.cc && <p className="mt-1 text-sm text-red-600">{errors.cc}</p>}
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Ingrese su nombre completo"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                id="tel"
                name="tel"
                type="tel"
                value={formData.tel}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Ingrese su teléfono"
              />
              {errors.tel && <p className="mt-1 text-sm text-red-600">{errors.tel}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
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
                Contraseña *
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

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña *
              </label>
              <input
                id="confirmPass"
                name="confirmPass"
                type="password"
                required
                value={formData.confirmPass}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirme su contraseña"
              />
              {errors.confirmPass && <p className="mt-1 text-sm text-red-600">{errors.confirmPass}</p>}
            </div>
          </div>

          {/* Mensajes de error y éxito */}
          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {successMessage && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          {/* Botón de envío */}
          <div>
            <Button
              text={isLoading ? "Registrando..." : "Crear cuenta"}
              type="submit"
              variant="primary"
              size="lg"
              fullWidth={true}
              disabled={isLoading}
              aria-label="Crear nueva cuenta de usuario"
            />
          </div>
        </form>

        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
