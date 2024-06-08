import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Untuk mengupdate task
export async function PATCH(
  request: Request,
  { params }: { params: { code: string; taskId: string } }
) {
  try {
    const { taskId } = params;
    const { name, description, deadline, isDone } = await request.json();

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        name,
        description,
        deadline: deadline ? new Date(deadline) : null,
        isDone: isDone || false,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// Untuk menghapus task
export async function DELETE(
  request: Request,
  { params }: { params: { code: string; taskId: string } }
) {
  try {
    const { taskId } = params;

    const deletedTask = await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json(deletedTask);
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}