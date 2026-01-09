import axios from "axios";

// Interface para los datos del producto
export interface CreateProductData {
  nameProduct: string;
  price: number;
  file: File | null;
}

// Interface para la respuesta
export interface CreateProductResponse {
  success: boolean;
  message?: string;
  data?: {
    nameProduct: string;
    price: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  };
}

// Función para crear producto con archivo
export const createProduct = async (
  productData: CreateProductData
): Promise<CreateProductResponse> => {
  try {
    // Crear FormData para enviar archivo
    const formData = new FormData();
    formData.append("nameProduct", productData.nameProduct);
    formData.append("price", productData.price.toString());
    if (productData.file) {
      formData.append("file", productData.file);
    }

    // Enviar con axios
    const response = await axios.post("/api/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("Error desconocido al crear producto");
  }
};