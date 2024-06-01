import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
export async function PATCH(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;
  const { name } = await request.json();

  const updatedClass = await prisma.class.update({
    where: { code },
    data: { name },
  });

  if (!updatedClass) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  return NextResponse.json(updatedClass);
}
