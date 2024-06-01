"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface Task {
  id: string;
  name: string;
  description: string;
  deadline: string | null;
}

interface ClassData {
  id: string;
  name: string;
  code: string;
  tasks: Task[];
}

export default function ClassPage({ params }: { params: { code: string } }) {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchClass() {
      try {
        const res = await fetch(`/api/classes/${params.code}`);
        if (!res.ok) throw new Error("Class not found");
        const data = await res.json();
        setClassData(data);
        setClassName(data.name);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    fetchClass();
  }, [params.code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/classes/${params.code}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description, deadline }),
    });

    if (res.ok) {
      const data = await res.json();
      setClassData((prev) =>
        prev
          ? {
              ...prev,
              tasks: [...prev.tasks, data],
            }
          : prev
      );
      setName("");
      setDescription("");
      setDeadline("");
    } else {
      alert("Failed to create task");
    }
  };

  const handleUpdateClass = async () => {
    const res = await fetch(`/api/classes/${params.code}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: className }),
    });

    if (!res.ok) {
      alert("Failed to update class name");
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    updatedTask: Partial<Task>
  ) => {
    const res = await fetch(`/api/classes/${params.code}/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    if (res.ok) {
      const data = await res.json();
      setClassData((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((task) =>
                task.id === taskId ? data : task
              ),
            }
          : prev
      );
    } else {
      alert("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const res = await fetch(`/api/classes/${params.code}/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setClassData((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.filter((task) => task.id !== taskId),
            }
          : prev
      );
    } else {
      alert("Failed to delete task");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!classData) return <p>Class not found</p>;

  return (
    <div>
      <h1>Class: {classData.name}</h1>
      <p>Class Code: {classData.code}</p>
      <input
        type="text"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />
      <button onClick={handleUpdateClass}>Update Class Name</button>
      <h2>Tasks</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classData.tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onUpdate={(updatedTask) => handleUpdateTask(task.id, updatedTask)}
              onDelete={() => handleDeleteTask(task.id)}
            />
          ))}
        </tbody>
      </table>
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Task Name:
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Description:
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Deadline:
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
}

function TaskRow({
  task,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onUpdate: (updatedTask: Partial<Task>) => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [deadline, setDeadline] = useState(
    task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : ""
  );

  const handleSave = () => {
    onUpdate({ name, description, deadline });
    setIsEditing(false);
  };

  return (
    <tr>
      {isEditing ? (
        <>
          <td>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </td>
          <td>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </td>
          <td>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </td>
          <td>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </td>
        </>
      ) : (
        <>
          <td>{task.name}</td>
          <td>{task.description}</td>
          <td>
            {task.deadline
              ? new Date(task.deadline).toLocaleString()
              : "No deadline"}
          </td>
          <td>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={onDelete}>Delete</button>
          </td>
        </>
      )}
    </tr>
  );
}
