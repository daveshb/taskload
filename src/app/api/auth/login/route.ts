import { NextRequest, NextResponse } from 'next/server';
import Users from '@/database/models/Users';
import dbConnection from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await dbConnection();
    
    // Obtener datos del body
    const { email, pass } = await request.json();
    
    // Validar campos requeridos
    if (!email || !pass) {
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }
    
    // Buscar usuario por email
    const user = await Users.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
    
    // Verificar contraseña (en producción deberías usar hash)
    if (user.pass !== pass) {
      return NextResponse.json(
        { success: false, message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
    
    // Login exitoso
    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          _id: user._id,
          cc: user.cc,
          name: user.name,
          tel: user.tel,
          email: user.email,
        }
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}