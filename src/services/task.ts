import axios from "axios";

// Interface para subtarea
export interface Subtask {
  title: string;
  action: string;
}

// Interface para los datos de creación de task
export interface CreateTaskData {
  title: string;
  description: string;
  limitDate: string;
  subtareas?: Subtask[];
}

// Interface para la respuesta de creación de task
export interface CreateTaskResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    title: string;
    description: string;
    createDate: string;
    limitDate: string;
    subtareas?: Subtask[];
  };
}

// Función para crear un task
export const createTask = async (taskData: CreateTaskData): Promise<CreateTaskResponse> => {
  try {
    const response = await axios.post('/api/tasks', taskData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('Error desconocido al crear la tarea');
  }
};

// Función para obtener todos los tasks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTasks = async (page = 1, perPage = 10, search = ""): Promise<{ success: boolean; data?: any[]; pagination?: any }> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
      ...(search && { search }),
    });
    const response = await axios.get(`/api/tasks?${params}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('Error desconocido al obtener las tareas');
  }
};

// Función para obtener un task por ID
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTaskById = async (taskId: string): Promise<{ success: boolean; data?: any }> => {
  try {
    const response = await axios.get(`/api/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('Error desconocido al obtener la tarea');
  }
};
