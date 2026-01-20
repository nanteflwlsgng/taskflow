"use client";

import { useState } from "react";
import type { Task } from "@/services/task.service";
import { useTasks } from "../hooks/useTasks";
import EditTaskModal from "../components/EditTaskModal";
import { signOut } from "next-auth/react"; // IMPORTANT pour la déconnexion

export default function TasksClient() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Gestion de l'ajout avec validation visuelle simple
  const handleAdd = async () => {
    if (!title.trim()) return;
    await createTask(title, desc);
    setTitle("");
    setDesc("");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-red-950 text-red-200">
      <p className="text-xl font-bold">Oups ! Une erreur : {error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden">
      
      {/* --- ARRIÈRE-PLAN EXAGÉRÉ (Glow Effects) --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* --- CONTENEUR PRINCIPAL (Glassmorphism) --- */}
      <div className="relative z-10 max-w-2xl mx-auto mt-10 p-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 backdrop-blur-md bg-white/5 p-4 rounded-2xl border border-white/10 shadow-xl">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
              TaskFlow
            </h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Fullstack Power</p>
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20"
          >
            <span className="text-sm font-semibold">Logout</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </button>
        </div>

        {/* --- ZONE DE CRÉATION (Input Exagéré) --- */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl mb-8 transform transition-all hover:border-purple-500/30">
          <div className="space-y-4">
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Qu'allons-nous accomplir ?" 
              className="w-full bg-black/20 text-white placeholder-slate-500 px-6 py-4 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-lg font-medium"
            />
            <div className="flex gap-4">
              <input 
                value={desc} 
                onChange={e => setDesc(e.target.value)} 
                placeholder="Détails (optionnel)" 
                className="flex-1 bg-black/20 text-white placeholder-slate-500 px-6 py-3 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
              <button 
                onClick={handleAdd}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all active:scale-95"
              >
                Go
              </button>
            </div>
          </div>
        </div>

        {/* --- LISTE DES TÂCHES --- */}
        <div className="space-y-4">
          {tasks.length === 0 && (
            <p className="text-center text-slate-500 italic py-10">Aucune tâche en vue... Profite du calme 🧘‍♂️</p>
          )}

          {tasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => setSelectedTask(task)}
              className={`
                group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                ${task.status === "done" 
                  ? "bg-emerald-900/10 border-emerald-500/20 opacity-60 hover:opacity-100" 
                  : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-purple-500/40 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] hover:-translate-y-1"
                }
              `}
            >
              {/* Barre latérale de statut */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${task.status === 'done' ? 'bg-emerald-500' : 'bg-orange-500 group-hover:bg-purple-500'}`} />

              <div className="flex justify-between items-start pl-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-1 ${task.status === "done" ? "line-through text-slate-500" : "text-white"}`}>
                    {task.title}
                  </h3>
                  {task.description && <p className="text-sm text-slate-400">{task.description}</p>}
                </div>

                {/* Boutons d'action (apparaissent au hover ou restent discrets) */}
                <div className="flex gap-2 ml-4">
                  
                  {/* Bouton Terminé */}
                  {task.status !== "done" && (
                    <button 
                      onClick={e => { e.stopPropagation(); updateTask(task.id, { status: "done" }) }}
                      className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                      title="Terminer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>
                  )}

                  {/* Bouton Supprimer */}
                  <button 
                    onClick={e => { e.stopPropagation(); deleteTask(task.id) }}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    title="Supprimer"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={(id, data) => updateTask(id, data)}
        />
      )}
    </div>
  );
}