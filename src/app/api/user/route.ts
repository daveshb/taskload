import { NextRequest, NextResponse } from 'next/server';
import Users from '@/database/models/Users';
import dbConnection from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await dbConnection();
    
    // Obtener datos del body
    const { cc, name, tel, email, pass } = await request.json();
    
    // Validar campos requeridos
    if (!cc || !name || !pass) {
      return NextResponse.json(
        { success: false, message: 'CC, nombre y contraseña son requeridos' },
        { status: 400 }
      );
    }
    
    // Verificar si ya existe un usuario con esa cédula
    const existingUser = await Users.findOne({ cc });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Ya existe un usuario con esa cédula' },
        { status: 409 }
      );
    }
    
    // Crear nuevo usuario
    const newUser = new Users({
      cc,
      name,
      tel: tel || '',
      email: email || '',
      pass, // En producción deberías hashear la contraseña
    });
    
    const savedUser = await newUser.save();
    
    // Respuesta exitosa (sin enviar la contraseña)
    return NextResponse.json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: {
        _id: savedUser._id,
        cc: savedUser.cc,
        name: savedUser.name,
        tel: savedUser.tel,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error al crear usuario:', error);
    
    // Error de validación de MongoDB
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: 'Datos de usuario inválidos' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnection();
    
    const users = await Users.find({}).select('-pass'); // No incluir contraseñas
    
    return NextResponse.json({
      success: true,
      data: users
    });
    
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}