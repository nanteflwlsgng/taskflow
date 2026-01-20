import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // 1. Vérifier si l'email existe déjà
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }

    // 2. Hasher le mot de passe (IMPORTANT ! Ne jamais stocker en clair)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insérer dans la base
    const newUser = await pool.query(
      "INSERT INTO users (email, password, provider) VALUES ($1, $2, 'credentials') RETURNING id, email",
      [email, hashedPassword]
    );

    return NextResponse.json(newUser.rows[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}