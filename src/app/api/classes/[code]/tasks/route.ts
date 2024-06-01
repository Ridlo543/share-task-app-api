import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    const { name, description, deadline } = await request.json();

    const classData = await prisma.class.findUnique({
      where: { code },
    });

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const newTask = await prisma.task.create({
      data: {
        name,
        description,
        deadline: deadline ? new Date(deadline) : null,
        classId: classData.id,
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
