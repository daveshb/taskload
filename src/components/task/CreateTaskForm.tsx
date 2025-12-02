"use client";
import React, { useState } from "react";
import { createTask, CreateTaskData, Subtask } from "@/services/task";
import { Button } from "@/components/button/Button";

interface CreateTaskFormProps {
  onTaskCreated?: () => void;
  onError?: (error: string) => void;
}

interface FormErrors {
  title?: string;
  description?: string;
  limitDate?: string;
  submit?: string;
}

export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  onTaskCreated,
  onError,
}) => {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: "",
    description: "",
    limitDate: "",
    subtareas: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [newSubtask, setNewSubtask] = useState<Subtask>({
    title: "",
    action: "",
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar título
    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    } else if (formData.title.length < 3) {
      newErrors.title = "El título debe tener al menos 3 caracteres";
    }

    // Validar descripción
    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    } else if (formData.description.length < 5) {
      newErrors.description = "La descripción debe tener al menos 5 caracteres";
    }

    // Validar fecha límite
    if (!formData.limitDate) {
      newErrors.limitDate = "La fecha límite es requerida";
    } else {
      const selectedDate = new Date(formData.limitDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.limitDate = "La fecha límite no puede ser en el pasado";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubtaskInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Subtask
  ) => {
    const { value } = e.target;
    setNewSubtask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSubtask = () => {
    if (newSubtask.title.trim() && newSubtask.action.trim()) {
      setFormData((prev) => ({
        ...prev,
        subtareas: [...(prev.subtareas || []), { ...newSubtask }],
      }));
      setNewSubtask({ title: "", action: "" });
    }
  };

  const removeSubtask = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subtareas: prev.subtareas?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await createTask(formData);

      if (response.success) {
        // Limpiar formulario
        setFormData({
          title: "",
          description: "",
          limitDate: "",
          subtareas: [],
        });
        setNewSubtask({ title: "", action: "" });

        // Llamar callback de éxito
        if (onTaskCreated) {
          onTaskCreated();
        }
      }
    } catch (error: unknown) {
      let errorMessage = "Error al crear la tarea";

      if (error instanceof Error && "response" in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axiosError = error as any;
        errorMessage =
          axiosError.response?.data?.message || "Error al crear la tarea";
      }

      setErrors({
        submit: errorMessage,
      });

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-md"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Tarea</h2>
      </div>

      <div className="space-y-4">
        {/* Título */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Ingresa el título de la tarea"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Ingresa la descripción de la tarea"
            rows={4}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Fecha Límite */}
        <div>
          <label
            htmlFor="limitDate"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha Límite
          </label>
          <input
            id="limitDate"
            name="limitDate"
            type="date"
            required
            value={formData.limitDate}
            onChange={handleInputChange}
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
          {errors.limitDate && (
            <p className="mt-1 text-sm text-red-600">{errors.limitDate}</p>
          )}
        </div>

        {/* Subtareas */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subtareas (opcional)</h3>
          
          {/* Formulario para agregar subtareas */}
          <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-md">
            <div>
              <label htmlFor="subtask-title" className="block text-sm font-medium text-gray-700">
                Título de la subtarea
              </label>
              <input
                id="subtask-title"
                type="text"
                value={newSubtask.title}
                onChange={(e) => handleSubtaskInputChange(e, "title")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Título de la subtarea"
              />
            </div>
            <div>
              <label htmlFor="subtask-action" className="block text-sm font-medium text-gray-700">
                Acción
              </label>
              <input
                id="subtask-action"
                type="text"
                value={newSubtask.action}
                onChange={(e) => handleSubtaskInputChange(e, "action")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Acción a realizar"
              />
            </div>
            <button
              type="button"
              onClick={addSubtask}
              className="w-full px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors text-sm font-medium"
            >
              + Agregar Subtarea
            </button>
          </div>

          {/* Lista de subtareas agregadas */}
          {formData.subtareas && formData.subtareas.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Subtareas agregadas:</p>
              {formData.subtareas.map((subtask, index) => (
                <div key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{subtask.title}</p>
                    <p className="text-xs text-gray-600">{subtask.action}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubtask(index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-100 rounded-md transition-colors text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mensajes de error */}
      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Botón de envío */}
      <Button
        text={isLoading ? "Creando..." : "Crear Tarea"}
        type="submit"
        variant="primary"
        size="lg"
        fullWidth={true}
        disabled={isLoading}
        aria-label="Crear nueva tarea"
      />
    </form>
  );
};
