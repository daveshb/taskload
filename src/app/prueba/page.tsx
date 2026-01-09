"use client";

import { useState, useEffect } from "react";
import { getTasks } from "@/services/task";
import { count } from "console";

interface Task {
  _id: string;
  title: string;
  description: string;
  createDate: string;
  limitDate: string;
}

interface ApiResponse {
  success: boolean;
  data?: Task[];
  pagination?: {
    page: number;
    perPage: number;
    total: number;
  };
}

export default function PruebaPage() {
  // State to store tasks
  const [tasks, setTasks] = useState<Task[]>([]);

  // State to handle loading
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State to handle errors
  const [error, setError] = useState<string | null>(null);

  // NEW DEPENDENCY - Page number
  const [page, setPage] = useState<number>(1);

  // NEW DEPENDENCY - Counter to demonstrate re-execution
  const [renderCount, setRenderCount] = useState<number>(0);

  useEffect(() => {
    if (page % 2 == 0) {
      console.log("se ejecuto el useEffect");
    }
  }, [page]);

  // Component lifecycle - Executes on mount AND when 'page' changes
  useEffect(() => {
    // console.log(`useEffect executed - Page: ${page}, Renders: ${renderCount}`);
    fetchTasks();
  }, [page]); //  DEPENDENCY: page

  const fetchTasks = async () => {
    try {
      // Show that it's loading
      setIsLoading(true);
      setError(null);

      // Request to service with try catch - USING PAGE AS DEPENDENCY
      const response: ApiResponse = await getTasks(page, 10);

      // Verify if the response was successful
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        setError("No se pudieron cargar las tareas");
      }
    } catch (err) {
      // Catch the error
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al obtener las tareas";
      setError(errorMessage);
      console.error("Error en fetchTasks:", err);
    } finally {
      // Always executes at the end
      setIsLoading(false);
    }
  };

  // Conditional rendering
  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">
        Vista de Demostración - useState + useEffect + Dependencias
      </h1>

      {/* Control panel - Change dependencies */}
      <div className="bg-green-200 border-4 border-green-700 rounded-lg p-5 mb-6 shadow-md">
        <h3 className="text-xl font-bold text-green-900 mt-0 mb-4">
          {" "}
          Panel de Control - Cambia las dependencias:
        </h3>
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="px-5 py-3 bg-blue-700 text-white font-bold rounded-lg shadow-md hover:bg-blue-800 transition text-base"
          >
            ◀ Página Anterior
          </button>

          <strong className="px-3 py-2 bg-yellow-300 text-green-900 rounded text-lg min-w-fit">
            Página: {page}
          </strong>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-5 py-3 bg-blue-700 text-white font-bold rounded-lg shadow-md hover:bg-blue-800 transition text-base"
          >
            Página Siguiente ▶
          </button>

          <button
            onClick={() => setRenderCount((prev) => prev + 1)}
            className="ml-auto px-5 py-3 bg-red-700 text-white font-bold rounded-lg shadow-md hover:bg-red-800 transition text-base"
          >
            Solo Re-renderizar ({renderCount})
          </button>
        </div>
        <small className="text-green-900 font-medium text-sm block">
          💡 Cambiar página ejecutará el useEffect de nuevo. El botón rojo solo
          causa re-renderizado sin ejecutar useEffect.
        </small>
      </div>

      {/* Conditional rendering - Loading state */}
      {isLoading && (
        <div className="bg-blue-300 border-2 border-blue-900 rounded-lg p-5 mb-5 shadow-md">
          <p className="text-blue-900 font-bold text-base">
            ⏳ Cargando tareas de la página {page}...
          </p>
        </div>
      )}

      {/* Conditional rendering - Error */}
      {error && !isLoading && (
        <div className="bg-red-300 border-2 border-red-900 rounded-lg p-5 mb-5 shadow-md">
          <p className="text-red-900 font-bold text-base">❌ Error: {error}</p>
        </div>
      )}

      {/* Conditional rendering - Tasks loaded successfully */}
      {!isLoading && !error && tasks.length > 0 && (
        <div>
          <p className="text-green-900 font-bold text-base bg-green-200 px-3 py-3 rounded mb-5">
            ✅ Se cargaron {tasks.length} tarea(s) exitosamente
          </p>

          <div className="grid gap-4 mt-5">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="border-2 border-blue-500 bg-blue-100 rounded-lg p-4 shadow-lg"
              >
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  {task.title}
                </h3>
                <p className="text-blue-900 font-medium my-2">
                  {task.description}
                </p>
                <small className="text-gray-700">
                  Creado: {new Date(task.createDate).toLocaleDateString()} |
                  Límite: {new Date(task.limitDate).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conditional rendering - No tasks */}
      {!isLoading && !error && tasks.length === 0 && (
        <div className="bg-orange-300 border-2 border-orange-700 rounded-lg p-5 mb-5 shadow-md">
          <p className="text-orange-700 font-bold text-base">
            📋 No hay tareas disponibles
          </p>
        </div>
      )}

      {/* Educational information */}
      <div className="mt-12 p-6 bg-indigo-100 rounded-lg border-l-4 border-l-blue-900 shadow-lg">
        <h3 className="text-xl font-bold text-blue-900 mt-0 mb-3">
          📚 Conceptos Utilizados:
        </h3>
        <ul className="text-blue-900 text-sm space-y-2">
          <li>
            <strong>useState:</strong> Maneja el estado local (tasks, isLoading,
            error, page, renderCount)
          </li>
          <li>
            <strong>useEffect:</strong> Se ejecuta al montar y cuando `page`
            cambia
          </li>
          <li>
            <strong>try catch:</strong> Maneja errores en la petición asíncrona
          </li>
          <li>
            <strong>finally:</strong> Siempre ejecuta setIsLoading(false)
          </li>
          <li>
            <strong>Renderizado condicional:</strong> Muestra diferente
            contenido según el estado
          </li>
        </ul>

        <h3 className="text-lg font-bold text-red-900 mt-6 mb-3">
          🔴 ARRAY DE DEPENDENCIAS EN useEffect:
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border-2 border-blue-900 p-3 text-left font-bold">
                  Array de Dependencias
                </th>
                <th className="border-2 border-blue-900 p-3 text-left font-bold">
                  ¿Cuándo se ejecuta?
                </th>
                <th className="border-2 border-blue-900 p-3 text-left font-bold">
                  Ejemplo
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-blue-900 p-3 bg-yellow-200 text-blue-900 font-medium font-mono">
                  <strong>[]</strong> (vacío)
                </td>
                <td className="border border-blue-900 p-3 text-blue-900">
                  Solo UNA VEZ al montar el componente
                </td>
                <td className="border border-blue-900 p-3 text-sm text-blue-900">
                  Ideal para cargar datos iniciales, autenticación
                </td>
              </tr>
              <tr className="bg-green-200">
                <td className="border border-blue-900 p-3 bg-green-300 text-green-900 font-bold font-mono">
                  <strong>[page]</strong> (con dependencias)
                </td>
                <td className="border border-blue-900 p-3 text-green-900 font-medium">
                  Al montar Y cada vez que `page` cambia ✅{" "}
                  <strong>ACTUAL</strong>
                </td>
                <td className="border border-blue-900 p-3 text-sm text-green-900">
                  Cargar datos cuando cambia un parámetro
                </td>
              </tr>
              <tr>
                <td className="border border-blue-900 p-3 bg-orange-300 text-red-900 font-medium font-mono">
                  <strong>Sin array</strong>
                </td>
                <td className="border border-blue-900 p-3 text-red-900 font-medium">
                  Después de CADA renderizado ⚠️ CUIDADO
                </td>
                <td className="border border-blue-900 p-3 text-sm text-red-900">
                  Rara vez necesario (puede causar loops infinitos)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-5 p-4 bg-blue-300 border border-blue-900 text-blue-900 font-medium rounded">
          <strong> En esta vista:</strong> El botón `Página Siguiente/Anterior`
          cambia la dependencia `page`, lo que causa que useEffect se ejecute de
          nuevo. El botón rojo `Solo Re-renderizar` NO cambia ninguna
          dependencia, por eso useEffect NO se ejecuta. Abre la consola para
          verlo en los logs.
        </p>
      </div>
    </div>
  );
}
