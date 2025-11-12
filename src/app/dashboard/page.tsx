'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button/Button';

interface User {
  _id: string;
  cc: string;
  name: string;
  tel: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      // Verificar si hay un usuario logueado
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          router.push('/');
        }
      } else {
        // Si no hay usuario, redirigir al login
        router.push('/');
      }
      setIsLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = () => {
    // Limpiar datos del usuario
    localStorage.removeItem('user');
    // Redirigir al home
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Se redirigirá automáticamente
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TaskLoad Dashboard</h1>
              <p className="text-sm text-gray-600">Bienvenido, {user.name}</p>
            </div>
            <Button
              text="Cerrar Sesión"
              variant="danger"
              size="md"
              onClick={handleLogout}
              aria-label="Cerrar sesión y volver al inicio"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card de Información del Usuario */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Información Personal
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {user.name}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">CC:</span> {user.cc}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {user.email || 'No registrado'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Teléfono:</span> {user.tel || 'No registrado'}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Tareas */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">📝</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Mis Tareas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0 pendientes
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  No tienes tareas pendientes en este momento.
                </p>
              </div>
            </div>
          </div>

          {/* Card de Estadísticas */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">📊</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Estadísticas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Nuevo usuario
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  ¡Bienvenido a TaskLoad! Comienza creando tu primera tarea.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Acciones Rápidas */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-900 mb-2">Crear Tarea</h3>
              <p className="text-sm text-gray-600 mb-3">Agrega una nueva tarea a tu lista</p>
              <Button
                text="Nueva Tarea"
                variant="primary"
                size="sm"
                fullWidth={true}
                onClick={() => console.log('Crear tarea')}
                aria-label="Crear una nueva tarea"
              />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-900 mb-2">Ver Tareas</h3>
              <p className="text-sm text-gray-600 mb-3">Revisa todas tus tareas</p>
              <Button
                text="Ver Todas"
                variant="secondary"
                size="sm"
                fullWidth={true}
                onClick={() => console.log('Ver tareas')}
                aria-label="Ver todas las tareas"
              />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-900 mb-2">Perfil</h3>
              <p className="text-sm text-gray-600 mb-3">Edita tu información</p>
              <Button
                text="Editar Perfil"
                variant="outline"
                size="sm"
                fullWidth={true}
                onClick={() => console.log('Editar perfil')}
                aria-label="Editar información del perfil"
              />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-900 mb-2">Configuración</h3>
              <p className="text-sm text-gray-600 mb-3">Ajusta tus preferencias</p>
              <Button
                text="Configurar"
                variant="secondary"
                size="sm"
                fullWidth={true}
                onClick={() => console.log('Configuración')}
                aria-label="Ir a configuración"
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
