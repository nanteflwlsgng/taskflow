"use client";

import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import TaskCard from "../components/TaskCard";
import { signOut, useSession } from "next-auth/react";
import { Priority } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import EditTaskModal from "../components/EditTaskModal"; // <--- N'oublie pas l'import
import { Task } from "@prisma/client"; // Pour le 

export default function TasksClient() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const { data: session } = useSession(); // Récupération des infos user (Avatar/Nom)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // États du formulaire
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [date, setDate] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;
    
    const success = await createTask({
      title,
      description: desc,
      priority: priority,
      dueDate: date ? new Date(date).toISOString() : undefined
    });

    if (success) {
      setTitle("");
      setDesc("");
      setPriority("medium");
      setDate("");
      setIsFormOpen(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-purple-500 font-mono tracking-widest animate-pulse">
      INITIALIZING SYSTEM...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 relative selection:bg-purple-500/30">
      
      {/* GRILLE DE FOND (Ambiance Tech) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
  
      {/* HEADER HUD */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16 relative z-20 gap-4"
      >
        {/* Logo */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            TASKFLOW<span className="text-white text-sm font-mono not-italic ml-2 opacity-50">PRO // v2.0</span>
          </h1>
        </div>

        {/* Profil & Logout (Style HUD) */}
        {session?.user && (
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full pl-2 pr-2 py-2 shadow-2xl">
            
            {/* Avatar - CORRECTIF APPLIQUÉ ICI */}
            <div className="relative">
              {session.user.image ? (
                <img 
                    src={session.user.image} 
                    alt="Avatar" 
                    referrerPolicy="no-referrer" // <--- C'EST ÇA QUI FIXE L'IMAGE
                    className="w-10 h-10 rounded-full border-2 border-purple-500/50 object-cover" 
                    onError={(e) => {
                        // Fallback si l'image casse quand même
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden'); 
                    }}
                />
              ) : null}
              
              {/* Fallback (Initiale) si pas d'image ou erreur */}
              <div className={`w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-lg ${session.user.image ? "hidden" : ""}`}>
                  {session.user.email?.[0].toUpperCase()}
              </div>

              {/* Point vert status */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
            </div>

            {/* Infos */}
            <div className="hidden sm:block text-xs font-mono pr-2">
              <p className="text-slate-300">OPERATOR</p>
              <p className="text-white font-bold tracking-wider">{session.user.name || "Unknown"}</p>
            </div>

            {/* Bouton Logout */}
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="ml-2 bg-red-500/10 border border-red-500/30 text-red-400 p-2 rounded-full hover:text-white hover:border-red-500 transition-colors"
              title="Disconnect System"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </motion.button>
          </div>
        )}
      </motion.header>
  
      <main className="max-w-6xl mx-auto relative z-10">
        
        {/* --- FORMULAIRE ACCORDÉON --- */}
        <div className="mb-16">
          <motion.div 
            layout 
            className="rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)]"
          >
             {!isFormOpen ? (
                <motion.button 
                  layout="position"
                  onClick={() => setIsFormOpen(true)}
                  whileHover={{ backgroundColor: "rgba(168, 85, 247, 0.05)" }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-6 flex flex-col items-center justify-center group cursor-pointer"
                >
                  <span className="text-3xl font-light text-slate-500 group-hover:text-purple-400 transition-colors duration-300">+</span>
                  <span className="text-xs font-mono tracking-[0.3em] text-slate-600 uppercase mt-2 group-hover:text-purple-500/70 transition-colors">Initialize New Protocol</span>
                </motion.button>
             ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="p-8"
                >
                   <div className="space-y-6">
                      
                      {/* Titre */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-purple-500/70 ml-1">PROTOCOL NAME</label>
                        <input 
                            value={title} 
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-lg font-bold placeholder-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                            placeholder="Ex: Dominer le monde..."
                            autoFocus
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-slate-500/70 ml-1">DETAILS</label>
                        <textarea 
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-slate-300 font-mono text-sm placeholder-slate-700 focus:border-purple-500/50 transition-all outline-none h-24 resize-none"
                            placeholder="// Optional instructions..."
                        />
                      </div>
                      
                      {/* Contrôles (Priorité & Date) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-mono text-slate-500/70 ml-1">PRIORITY LEVEL</label>
                            <select 
                                value={priority}
                                onChange={e => setPriority(e.target.value as Priority)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono outline-none focus:border-purple-500/50 appearance-none cursor-pointer hover:bg-white/5 transition-colors"
                            >
                                <option value="low" className="bg-slate-900">LOW // Maintenance</option>
                                <option value="medium" className="bg-slate-900">MEDIUM // Standard</option>
                                <option value="high" className="bg-slate-900 text-red-400">HIGH // Critical</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-mono text-slate-500/70 ml-1">DEADLINE</label>
                            <input 
                                type="datetime-local"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono outline-none focus:border-purple-500/50 [color-scheme:dark]"
                            />
                          </div>
                      </div>

                      {/* Boutons Actions */}
                      <div className="flex gap-4 justify-end pt-4 border-t border-white/5">
                          <button 
                            onClick={() => setIsFormOpen(false)} 
                            className="px-6 py-3 rounded-xl hover:bg-white/5 text-slate-500 font-mono text-sm transition-colors"
                          >
                            ABORT
                          </button>
                          
                          <motion.button 
                              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleAdd}
                              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold tracking-widest px-8 py-3 rounded-xl shadow-lg shadow-purple-900/20"
                          >
                              INITIATE
                          </motion.button>
                      </div>
                   </div>
                </motion.div>
             )}
          </motion.div>
        </div>
  
        {/* --- LISTE DES TÂCHES --- */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 mb-8 font-mono text-center">
             ⚠ SYSTEM ERROR: {error}
          </div>
        )}
        
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 && !loading && (
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="col-span-full text-center py-20"
                 >
                    <p className="text-slate-600 font-mono text-sm tracking-widest">SYSTEM IDLE // NO ACTIVE PROTOCOLS</p>
                 </motion.div>
            )}

            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                layout
                onClick={() => setSelectedTask(task)} 
                className="cursor-pointer"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, filter: "blur(10px)", transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <TaskCard 
                  task={task} 
                  onUpdate={updateTask} 
                  onDelete={deleteTask} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {selectedTask && (
                <EditTaskModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onSave={(id, data) => updateTask(id, data)}
                />
            )}
        </AnimatePresence>
        </motion.div>
  
      </main>
    </div>
  );
}