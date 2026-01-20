import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const result = await pool.query(
          "SELECT * FROM users WHERE email=$1",
          [credentials.email]
        );

        const user = result.rows[0];
        if (!user?.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return { id: user.id, email: user.email };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],


  callbacks: {
    // Ce callback se déclenche quand on tente de se connecter
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { email, id } = user; // id ici est l'ID Google, pas celui de ta DB

          // 1. On regarde si cet email existe déjà dans notre DB
          const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

          if (result.rows.length === 0) {
            // 2. L'utilisateur n'existe pas -> On le CRÉE
            // On ne met pas de mot de passe car il vient de Google
            const newUser = await pool.query(
              "INSERT INTO users (email, provider) VALUES ($1, 'google') RETURNING *",
              [email]
            );
            // Astuce : On attache le NOUVEL ID (UUID) de la DB à l'objet user de NextAuth
            user.id = newUser.rows[0].id;
          } else {
            // 3. L'utilisateur existe -> On récupère son UUID
            user.id = result.rows[0].id;
          }
          return true; // Connexion acceptée
        } catch (error) {
          console.error("Erreur login Google:", error);
          return false; // Connexion refusée
        }
      }
      return true; // Pour Credentials, on laisse passer (vérif déjà faite dans authorize)
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // On récupère l'UUID qu'on a préparé dans signIn ou authorize
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
};
