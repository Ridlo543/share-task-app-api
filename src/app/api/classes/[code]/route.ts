import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

// untuk mendapatkan data class berdasarkan code
export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  const classData = await prisma.class.findUnique({
    where: { code },
    include: { tasks: true },
  });

  if (!classData) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  return NextResponse.json(classData);
}

// untuk mengubah data class berdasarkan code
export async function PATCH(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const { code } = params;
  const { name } = await request.json();

  try {
    const updatedClass = await prisma.class.update({
      where: { code },
      data: { name },
    });

    if (!updatedClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({ class: updatedClass }, { status: 200 });
  } catch (error: Error | any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// untuk menghapus data class berdasarkan code
export async function DELETE(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  const deletedClass = await prisma.class.delete({
    where: { code },
  });

  if (!deletedClass) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Class deleted successfully" });
}
