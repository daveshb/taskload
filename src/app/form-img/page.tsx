"use client";
import React, { useState } from "react";
import { Button } from "@/components/button/Button";
import Image from "next/image";
import { createProduct } from "@/services/product";

export default function FormImg() {
  const [nameProduct, setNameProduct] = useState("");
  const [price, setPrice] = useState(0);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await createProduct({ nameProduct, price, file });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      setPreviewUrl("");
      return;
    }
    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Cargar imagen
          </h1>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre del producto
              </label>
              <input
                id="nombreProdcuto"
                name="nombreProdcuto"
                type="text"
                required
                value={nameProduct}
                onChange={(e) => setNameProduct(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Ingrese el nombre del producto"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Precio
              </label>
              <input
                id="precio"
                name="precio"
                type="number"
                required
                value={price}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setPrice(value);
                }}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Ingrese el nombre del producto"
              />
            </div>
            <div>
              <label
                htmlFor="img"
                className="block text-sm font-medium text-gray-700"
              >
                Imagen
              </label>
              <input
                id="img"
                name="img"
                type="file"
                required
                // value={file}
                onChange={handleFileChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Ingrese el nombre del producto"
              />
            </div>
          </div>

          {/* Mensajes de error */}

          <div className="space-y-3">
            <div className="text-center">
              {previewUrl ? (
                <div>
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={400}
                    height={400}
                  />
                </div>
              ) : (
                <p className="text-black">No file selected</p>
              )}
            </div>
            <Button
              //   text={isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              text={"cargar imagen"}
              type="submit"
              variant="primary"
              size="lg"
              fullWidth={true}
              //   disabled={isLoading}
              aria-label="Iniciar sesión en la aplicación"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
