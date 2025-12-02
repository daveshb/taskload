"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Pagination } from "@nextui-org/react";
import { getTasks } from "@/services/task";
import { Button } from "@/components/button/Button";

interface Subtask {
  title: string;
  action: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  createDate: string;
  limitDate: string;
  subtareas?: Subtask[];
}

interface TaskListProps {
  onClose?: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onClose }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoizar la función de formateo de fecha
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  // Debounce para la búsqueda
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchInput]);

  // Usar useCallback para evitar recrear la función de fetch
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getTasks(currentPage, perPage, search);
      if (response.success && response.data) {
        setTasks(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
          setTotal(response.pagination.total);
        }
      }
    } catch (err) {
      setError("Error al cargar las tareas");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, perPage, search]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Todas mis tareas</h2>
        {onClose && (
          <Button
            text="Cerrar"
            variant="outline"
            size="md"
            onClick={onClose}
            aria-label="Cerrar lista de tareas"
          />
        )}
      </div>

      {/* Input de búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar tareas por título..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 text-lg">
            No tienes tareas creadas aún.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            ¡Crea tu primera tarea para comenzar!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-600 hover:shadow-md transition-shadow"
            >
              {/* Header de la tarea */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3 my-3 p-2 bg-gray-50 rounded text-xs">
                <div>
                  <p className="font-medium text-gray-500">Creación</p>
                  <p className="text-gray-900 font-medium">
                    {formatDate(task.createDate)}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Límite</p>
                  <p className="text-gray-900 font-medium">
                    {formatDate(task.limitDate)}
                  </p>
                </div>
              </div>

              {/* Subtareas */}
              {task.subtareas && task.subtareas.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-900 mb-1">
                    Subtareas ({task.subtareas.length}):
                  </p>
                  <div className="space-y-1">
                    {task.subtareas.map((subtask, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-1 bg-blue-50 rounded text-xs"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={false}
                          className="mt-0.5 w-3 h-3 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                          aria-label={`Marcar como completado: ${subtask.title}`}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {subtask.title}
                          </p>
                          <p className="text-gray-600">{subtask.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="mt-3 flex gap-2">
                <Button
                  text="Editar"
                  variant="secondary"
                  size="sm"
                  onClick={() => console.log("Editar", task._id)}
                  aria-label={`Editar tarea: ${task.title}`}
                />
                <Button
                  text="Eliminar"
                  variant="danger"
                  size="sm"
                  onClick={() => console.log("Eliminar", task._id)}
                  aria-label={`Eliminar tarea: ${task.title}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {!isLoading && tasks.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="text-sm text-gray-600">
            Mostrando {(currentPage - 1) * perPage + 1} a{" "}
            {Math.min(currentPage * perPage, total)} de {total} tareas
          </div>
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={currentPage}
            total={totalPages}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};