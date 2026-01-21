"use client";

import { signIn } from "next-auth/react";
import { useState,useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const container = useRef(null);
  const googleBtn = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Intro Exagérée : Les textes explosent ou glissent
    tl.from(".hero-text", {
      y: 200,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: "power4.out",
    });

    // 2. Le Bouton Google apparaît comme une alerte système après 2.5s
    gsap.to(googleBtn.current, {
      y: 0, // Il remonte à sa place
      opacity: 1,
      duration: 1,
      delay: 2.5,
      ease: "elastic.out(1, 0.5)", // Effet rebond
    });
  }, { scope: container });

  return (
    <div ref={container} className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center text-white selection:bg-neon-purple">
      
      {/* BACKGROUND AMBIANCE (Glows qui bougent) */}
      <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-purple-900/30 rounded-full blur-[150px] animate-pulse" />
      
      {/* TYPOGRAPHIE MASSIVE */}
      <h1 className="hero-text text-[12vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-800 z-10">
        TASK
      </h1>
      <h1 className="hero-text text-[12vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-t from-purple-500 to-slate-900 z-10 -mt-4 mix-blend-screen">
        FLOW
      </h1>
      
      <p className="hero-text text-xl uppercase tracking-[1em] text-slate-500 mt-10">
        System Override
      </p>

      {/* BOUTON GOOGLE (Style Alerte Système) */}
      <div 
        ref={googleBtn}
        className="fixed bottom-10 z-50 translate-y-32 opacity-0" // Caché au départ
      >
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-full shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] hover:bg-white hover:text-black transition-all duration-300 group"
        >
          <div className="w-3 h-3 rounded-full bg-green-500 animate-ping" />
          <span className="font-bold tracking-widest text-sm">INITIALIZE SESSION // GOOGLE</span>
        </button>
      </div>
    </div>
  );
}
