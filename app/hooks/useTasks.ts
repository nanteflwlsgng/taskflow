"use client";

import { useState, useEffect } from "react";
import { Task } from "@/services/task.service";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // GET toutes les tâches
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Erreur lors de la récupération");
      const data: Task[] = await res.json();
      setTasks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // POST créer une tâche
  const createTask = async (title: string, description?: string) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Impossible de créer la tâche");
      const newTask: Task = await res.json();
      setTasks((prev) => [newTask, ...prev]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // PUT mettre à jour une tâche
  const updateTask = async (id: string, fields: Partial<Task>) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...fields }),
      });
      if (!res.ok) throw new Error("Impossible de mettre à jour");
      const updatedTask: Task = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  // DELETE supprimer une tâche
  const deleteTask = async (id: string) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Impossible de supprimer");
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask };
}
