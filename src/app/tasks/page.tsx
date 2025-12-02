"use client";
import React, { useState } from "react";
import { CreateTaskForm } from "@/components/task/CreateTaskForm";

export default function TasksPage() {
  const [successMessage, setSuccessMessage] = useState("");

  const handleTaskCreated = () => {
    setSuccessMessage("¡Tarea creada exitosamente!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleError = (error: string) => {
    console.error("Error al crear tarea:", error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {successMessage && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}
        <CreateTaskForm
          onTaskCreated={handleTaskCreated}
          onError={handleError}
        />
      </div>
    </div>
  );
}
