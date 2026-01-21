import { prisma } from "@/lib/prisma";
import { Task, Priority, TaskStatus } from "@prisma/client";

// On ré-exporte les types pour que le frontend puisse les utiliser
export type { Task };

export const TaskService = {
  // GET : Récupérer et trier
  async getAll(userId: string) {
    return await prisma.task.findMany({
      where: { userId },
      orderBy: [
        // Prisma trie dans l'ordre de la liste :
        { status: 'asc' },   // 1. "todo" avant "done"
        { priority: 'desc' }, // 2. "high" avant "low"
        { dueDate: 'asc' },   // 3. Les dates les plus proches en premier
        { createdAt: 'desc' } // 4. Les plus récentes en dernier recours
      ],
    });
  },

  // POST : Créer avec Priorité et Date
  async create(userId: string, title: string, description?: string, priority?: Priority, dueDate?: string) {
    return await prisma.task.create({
      data: {
        userId,
        title,
        description,
        // Si priority est undefined, Prisma utilisera la valeur par défaut du schéma (medium)
        priority: priority || "medium",
        // Si dueDate est une string vide ou undefined, on met null
        dueDate: dueDate ? new Date(dueDate) : null, 
      },
    });
  },

  // PUT : Mise à jour sécurisée
  async update(userId: string, taskId: string, fields: Partial<Task>) {
    // 1. Vérification de sécurité : La tâche appartient-elle au user ?
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!existingTask) return null;

    // 2. Mise à jour
    return await prisma.task.update({
      where: { id: taskId },
      data: fields,
    });
  },

  // DELETE : Suppression sécurisée
  async delete(userId: string, taskId: string) {
    const result = await prisma.task.deleteMany({
      where: {
        id: taskId,
        userId: userId, // Sécurité : on supprime seulement si c'est MON task
      },
    });
    return result.count > 0;
  },
};