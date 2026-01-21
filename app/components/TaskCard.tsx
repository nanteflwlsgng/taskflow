"use client";

import { Task } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion"; // <--- Indispensable pour l'animation

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, fields: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  
  // Design des Badges "Tech"
  const getPriorityStyle = (p: string) => {
    switch (p) {
      case "high": return "bg-red-500/10 text-red-400 border-red-500/50 shadow-[0_0_15px_-3px_rgba(239,68,68,0.4)]";
      case "medium": return "bg-orange-500/10 text-orange-400 border-orange-500/50";
      case "low": return "bg-blue-500/10 text-cyan-400 border-cyan-500/50";
      default: return "bg-slate-500/10 text-slate-400";
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  return (
    <motion.div
      layout // Permet à la carte de glisser fluidement si une autre est supprimée
      whileHover={{ y: -5, scale: 1.02 }} // Lévitation au survol
      className={`
        group relative overflow-hidden rounded-3xl border backdrop-blur-xl p-6 transition-colors
        ${task.status === "done" 
          ? "bg-slate-900/40 border-slate-800 opacity-60 grayscale" // Mode "Éteint"
          : "bg-gradient-to-br from-white/10 to-white/[0.02] border-white/10 hover:border-purple-500/30" // Mode "Actif"
        }
      `}
    >
      
      {/* --- AMBIANCE LIGHT (Lumière dynamique) --- */}
      {/* Spot lumineux qui apparaît au survol */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-purple-500/30 blur-[50px] transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none" />
      
      {/* --- CONTENU --- */}
      <div className="relative z-10">
        
        {/* En-tête */}
        <div className="flex justify-between items-start mb-3 gap-4">
          <h3 className={`text-lg font-bold leading-tight ${task.status === "done" ? "text-slate-500 line-through" : "text-white"}`}>
            {task.title}
          </h3>
          
          {/* Badge Priorité (Style Puce Électronique) */}
          <span className={`shrink-0 px-3 py-1 text-[10px] font-mono uppercase tracking-widest rounded-full border ${getPriorityStyle(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-slate-400 font-light leading-relaxed mb-6 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Footer Technique */}
        <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
          
          {/* Date (Style Terminal) */}
          <div className="font-mono text-xs">
            {task.dueDate ? (
               <div className={`flex items-center gap-2 ${isOverdue ? "text-red-400" : "text-slate-500"}`}>
                 <span className="opacity-50">DEADLINE:</span>
                 <span className={isOverdue ? "animate-pulse font-bold" : ""}>
                   {format(new Date(task.dueDate), "dd.MM // HH:mm", { locale: fr })}
                 </span>
               </div>
            ) : (
              <span className="text-slate-600 opacity-50">NO DATA</span>
            )}
          </div>

          {/* Actions (Apparaissent au survol) */}
          <div className="flex gap-2 translate-y-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            
            {task.status !== "done" && (
              <button 
                onClick={(e) => { e.stopPropagation(); onUpdate(task.id, { status: "done" }) }}
                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all"
                title="Mission Accomplie"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
            )}
            
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(task.id) }}
              className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
              title="Détruire"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}