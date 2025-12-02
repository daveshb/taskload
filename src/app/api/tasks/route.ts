import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/database";
import Task from "@/database/models/Task";

export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await dbConnection();

    // Obtener datos del request
    const body = await request.json();
    const { title, description, limitDate, subtareas } = body;

    // Validar campos requeridos
    if (!title || !description || !limitDate) {
      return NextResponse.json(
        { success: false, message: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Crear nuevo task
    const newTask = new Task({
      title,
      description,
      limitDate: new Date(limitDate),
      subtareas: subtareas || [],
    });

    const savedTask = await newTask.save();

    return NextResponse.json(
      {
        success: true,
        message: "Tarea creada correctamente",
        data: savedTask,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await dbConnection();

    // Obtener parámetros de la query
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");
    const search = searchParams.get("search") || "";

    // Validar parámetros
    const validPage = Math.max(1, page);
    const validPerPage = Math.max(1, Math.min(100, perPage)); // Máximo 100 por página

    // Crear filtro de búsqueda
    const filter = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    // Contar total de documentos que coinciden con el filtro
    const total = await Task.countDocuments(filter);

    // Calcular skip
    const skip = (validPage - 1) * validPerPage;

    // Obtener las tareas paginadas
    const tasks = await Task.find(filter)
      .skip(skip)
      .limit(validPerPage)
      .sort({ createdAt: -1 });

    // Calcular total de páginas
    const totalPages = Math.ceil(total / validPerPage);

    return NextResponse.json(
      {
        success: true,
        data: tasks,
        pagination: {
          page: validPage,
          perPage: validPerPage,
          total,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
