import axios from "axios";

// Interface para los datos del usuario a registrar
export interface ProductsProps {
  nameProduct: string;
  price: number;
  file: File | null;
}

// Función para registrar un nuevo usuario
export const newProduct = async (productData: ProductsProps): Promise<any> => {
  try {
    const response = await axios.post('/api/products', productData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('Error desconocido al registrar producto');
  }
};