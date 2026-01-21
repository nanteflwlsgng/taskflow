"use client";

import { useState, useEffect } from "react";
// On importe les types directement depuis Prisma (Best Practice !)
import { Task, Priority } from "@prisma/client"; 

export type CreateTaskDTO = {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string; // On envoie des strings (ISO format) au serveur
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // GET
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Erreur fetch");
      const data = await res.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // POST (Amélioré avec DTO)
  const createTask = async (data: CreateTaskDTO) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur création");
      const newTask = await res.json();
      // On ajoute la tâche en haut de la liste
      setTasks((prev) => [newTask, ...prev]);
      return true; // Succès
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // PUT
  const updateTask = async (id: string, fields: Partial<Task>) => {
    try {
      // Optimistic UI : On met à jour l'interface AVANT la réponse serveur (ultra fluide)
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...fields } as Task : t)));

      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...fields }),
      });
      
      if (!res.ok) throw new Error("Erreur update");
      // Si besoin, on remplace par la vraie donnée serveur confirmée
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: any) {
      setError(err.message);
      fetchTasks(); // En cas d'erreur, on recharge tout pour annuler l'optimistic UI
    }
  };

  // DELETE
  const deleteTask = async (id: string) => {
    try {
      // Optimistic UI
      setTasks((prev) => prev.filter((t) => t.id !== id));

      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Erreur delete");
    } catch (err: any) {
      setError(err.message);
      fetchTasks();
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  return { tasks, loading, error, createTask, updateTask, deleteTask };
}