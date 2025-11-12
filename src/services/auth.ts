import axios from "axios";

// Interface para los datos de login
export interface LoginData {
  email: string;
  pass: string;
}

// Interface para la respuesta de login
export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      _id: string;
      cc: string;
      name: string;
      tel: string;
      email: string;
    };
    token?: string;
  };
}

// Función para hacer login
export const loginUser = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    const response = await axios.post('/api/auth/login', loginData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('Error desconocido al iniciar sesión');
  }
};