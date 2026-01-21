"use client";

import { useState } from "react";
import { Task } from "@prisma/client"; // Utilise le type Prisma directement
import { motion } from "framer-motion";

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
    // Overlay (Fond sombre flouté)
    <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        onClick={onClose} // Ferme si on clique à côté
    >
      {/* Boîte Modale (Hologramme) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique DANS la boîte
        className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-2xl shadow-[0_0_50px_-10px_rgba(168,85,247,0.3)] overflow-hidden"
      >
        
        {/* Header "Tech" */}
        <div className="bg-white/5 border-b border-white/5 p-4 flex justify-between items-center">
            <h2 className="text-sm font-mono tracking-widest text-purple-400 uppercase">
                // EDIT PROTOCOL: <span className="text-white">{task.id.slice(0, 8)}...</span>
            </h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-6">
            
            {/* Input Titre */}
            <div className="space-y-2">
                <label className="text-xs font-mono text-slate-500 ml-1">PROTOCOL NAME</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-lg font-bold placeholder-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                    placeholder="Titre de la tâche"
                    autoFocus
                />
            </div>

            {/* Input Description */}
            <div className="space-y-2">
                <label className="text-xs font-mono text-slate-500 ml-1">DATA CONTENT</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-slate-300 font-mono text-sm placeholder-slate-700 focus:border-purple-500/50 transition-all outline-none h-32 resize-none"
                    placeholder="// No description data..."
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
                <button 
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-slate-500 hover:bg-white/5 hover:text-white font-mono text-xs transition-colors"
                >
                    DISCARD CHANGES
                </button>
                <button
                    onClick={handleSave}
                    className="bg-purple-600/20 border border-purple-500/50 text-purple-300 px-6 py-2 rounded-lg hover:bg-purple-500 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all font-mono text-xs tracking-widest"
                >
                    OVERWRITE DATA
                </button>
            </div>
        </div>
        
        {/* Barre de chargement décorative en bas */}
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 opacity-50" />
      </motion.div>
    </div>
  );
}