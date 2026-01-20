"use client";

import { useState } from "react";
import { Task } from "@/services/task.service";

type Props = {
  task: Task;
  onClose: () => void;
  onSave: (id: string, data: { title: string; description?: string }) => void;
};

export default function EditTaskModal({ task, onClose, onSave }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");

  const handleSave = () => {
    onSave(task.id, { title, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center z-[9999] justify-center">
      <div className="bg-white p-4 rounded w-96">
        <h2 className="text-lg font-bold mb-3">Modifier la tâche</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-2"
          placeholder="Titre"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-4"
          placeholder="Description"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Annuler</button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}
