import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

// Untuk membuat class baru
export async function POST(request: Request) {
  const { name } = await request.json();
  const code = nanoid(6); // Membuat kode unik sepanjang 6 karakter

  const newClass = await prisma.class.create({
    data: {
      name,
      code,
    },
  });

  return NextResponse.json(newClass);
}

export async function GET() {
  const classes = await prisma.class.findMany();
  return NextResponse.json(classes);
}
