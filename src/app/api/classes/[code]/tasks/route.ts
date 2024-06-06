import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Untuk mendapatkan semua tasks dalam class tertentu
export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    const classData = await prisma.class.findUnique({
      where: { code },
      include: { tasks: true },
    });

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json(classData.tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// Untuk membuat task baru
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
