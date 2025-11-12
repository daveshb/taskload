import axios from "axios";

// Interface para los datos del usuario a registrar
export interface RegisterUserData {
  cc: string;
  name: string;
  tel?: string;
  email?: string;
  pass: string;
}

// Interface para la respuesta de registro
export interface RegisterResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    cc: string;
    name: string;
    tel: string;
    email: string;
    createdAt: string;
  };
}

// Función para registrar un nuevo usuario
export const registerUser = async (userData: RegisterUserData): Promise<RegisterResponse> => {
  try {
    const response = await axios.post('/api/user', userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('Error desconocido al registrar usuario');
  }
};