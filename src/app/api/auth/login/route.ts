import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hash = user.password;
    if (!hash) {
      return NextResponse.json({ error: 'Password data missing' }, { status: 500 });
    }

    const isPasswordValid = bcrypt.compareSync(password.trim(), hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error('Login error details:', error);
    return NextResponse.json({ 
      error: 'Login failed', 
      message: error.message
    }, { status: 500 });
  }
}
