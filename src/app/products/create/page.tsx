'use client';

import React, { useState } from 'react';
import { createProduct } from '@/services/product';
import { Button } from '@/components/button/Button';

interface FormData {
  nameProduct: string;
  price: string;
}

interface FormErrors {
  nameProduct?: string;
  price?: string;
  file?: string;
  submit?: string;
}

export default function CreateProductForm() {
  const [formData, setFormData] = useState<FormData>({
    nameProduct: '',
    price: ''
  });

  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nameProduct.trim()) {
      newErrors.nameProduct = 'El nombre del producto es requerido';
    }

    if (!formData.price) {
      newErrors.price = 'El precio es requerido';
    } else if (isNaN(parseFloat(formData.price))) {
      newErrors.price = 'El precio debe ser un número válido';
    }

    if (!file) {
      newErrors.file = 'Debes seleccionar un archivo';
    } else if (!isValidFileType(file)) {
      newErrors.file = 'Tipo de archivo no permitido';
    } else if (file.size > 5 * 1024 * 1024) { // 5MB
      newErrors.file = 'El archivo no debe superar 5MB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidFileType = (file: File): boolean => {
    // Tipos de archivo permitidos
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return allowedTypes.includes(file.type);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (errors.file) {
        setErrors(prev => ({
          ...prev,
          file: undefined
        }));
      }
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
      if (!file) {
        throw new Error('Archivo no disponible');
      }

      const response = await createProduct({
        nameProduct: formData.nameProduct,
        price: parseFloat(formData.price),
        file
      });

      if (response.success) {
        setSuccessMessage('Producto creado exitosamente');
        setFormData({
          nameProduct: '',
          price: ''
        });
        setFile(null);

        // Limpiar input de archivo
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setErrors({
          submit: axiosError.response?.data?.message || 'Error al crear producto'
        });
      } else {
        setErrors({
          submit: 'Error al crear producto'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Crear Producto</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del Producto */}
          <div>
            <label htmlFor="nameProduct" className="block text-sm font-medium text-gray-700">
              Nombre del Producto *
            </label>
            <input
              id="nameProduct"
              name="nameProduct"
              type="text"
              required
              value={formData.nameProduct}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ingrese el nombre del producto"
            />
            {errors.nameProduct && (
              <p className="mt-1 text-sm text-red-600">{errors.nameProduct}</p>
            )}
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Precio *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ingrese el precio"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Archivo */}
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Seleccionar Archivo *
            </label>
            <input
              id="file"
              name="file"
              type="file"
              required
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 bg-gray-50 cursor-pointer"
            />
            <p className="mt-1 text-xs text-gray-500">
              Formatos permitidos: JPG, PNG, GIF, PDF, DOC, DOCX (máximo 5MB)
            </p>
            {file && (
              <div className="mt-2 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Archivo seleccionado:</strong> {file.name}
                </p>
                <p className="text-sm text-blue-600">
                  Tamaño: {(file.size / 1024 / 1024).toFixed(2)}MB
                </p>
              </div>
            )}
            {errors.file && (
              <p className="mt-1 text-sm text-red-600">{errors.file}</p>
            )}
          </div>

          {/* Mensajes */}
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
              text={isLoading ? 'Creando producto...' : 'Crear Producto'}
              type="submit"
              variant="primary"
              size="lg"
              fullWidth={true}
              disabled={isLoading}
              aria-label="Crear nuevo producto"
            />
          </div>
        </form>
      </div>
    </div>
  );
}