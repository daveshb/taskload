import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/database";
import cloudinary from "@/lib/cloudinary";
import Products from "@/database/models/Products";

export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos

    // Obtener FormData en lugar de JSON
    const formData = await request.formData();

    // Extraer campos del FormData
    const nameProduct = formData.get("nameProduct") as string;
    const price = formData.get("price") as string;
    const file = formData.get("file") as File;

    const buffer = await file.arrayBuffer();
    const dataUri = `data:${file.type};base64,${Buffer.from(buffer).toString(
      "base64"
    )}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "taskload",
      resource_type: "image",
    });

    console.log(uploadResult.secure_url);

    if (uploadResult.secure_url) {
      await dbConnection();
      const newProduct = new Products({
        nameProduct,
        price,
        file: uploadResult.secure_url,
      });

      const savedProdcut = await newProduct.save();

      return NextResponse.json(
        {
          success: true,
          message: "Producto creado correctamente",
          data: savedProdcut,
        },
        { status: 201 }
      );
    }
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
