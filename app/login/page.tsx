"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-xl font-bold mb-6">Connexion</h1>

      <input
        className="w-full border p-2 mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-3"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={() =>
          signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/",
          })
        }
        className="w-full bg-blue-500 text-white p-2 rounded mb-3"
      >
        Connexion avec Email
      </button>

      <button
        onClick={() => signIn("google",{callbackUrl: "/", })}
        className="w-full border p-2 rounded"
      >
        Continuer avec Google
      </button>
    </div>
  );
}
