import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/database";
import cloudinary from "@/lib/cloudinary";
import Products from "@/database/models/Products";

export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await dbConnection();

    // Obtener FormData en lugar de JSON
    const formData = await request.formData();

    // Extraer campos del FormData
    const nameProduct = formData.get("nameProduct") as string;
    const price = formData.get("price") as string;
    const file = formData.get("file") as File;

    // Validar campos requeridos
    if (!nameProduct || !price || !file) {
      return NextResponse.json(
        { success: false, message: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Verificar que es un archivo válido
    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "El archivo es inválido" },
        { status: 400 }
      );
    }

    // Convertir archivo a buffer
    const buffer = await file.arrayBuffer();
    const dataUri = `data:${file.type};base64,${Buffer.from(buffer).toString(
      "base64"
    )}`;

    // Crear nuevo producto
    const newProduct = new Products({
      nameProduct,
      price: parseFloat(price),
      file: {
        originalName: file.name,
        size: file.size,
        type: file.type,
      },
    });

    const savedProduct = await newProduct.save();

    return NextResponse.json(
      {
        success: true,
        message: "Producto creado correctamente",
        data: savedProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Validar campos requeridos
// if (!nameProduct || !price || !file) {
//   return NextResponse.json(
//     { success: false, message: "Todos los campos son requeridos" },
//     { status: 400 }
//   );
// }

// Verificar que es un archivo válido
// if (!(file instanceof File)) {
//   return NextResponse.json(
//     { success: false, message: "El archivo es inválido" },
//     { status: 400 }
//   );
// }
