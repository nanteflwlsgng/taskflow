export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { TaskService } from "@/services/task.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Fonction helper pour récupérer l'ID user
async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;
  return session.user.id;
}

// GET
export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const tasks = await TaskService.getAll(userId);
    return NextResponse.json(tasks);
  } catch (err: any) {
    console.error("Erreur GET tasks:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST
export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    // On récupère les nouveaux champs
    const { title, description, priority, dueDate } = body;

    if (!title) return NextResponse.json({ error: "Titre requis" }, { status: 400 });

    const task = await TaskService.create(userId, title, description, priority, dueDate);
    return NextResponse.json(task, { status: 201 });

  } catch (err: any) {
    console.error("Erreur POST task:", err);
    return NextResponse.json({ error: err.message || "Erreur création" }, { status: 400 });
  }
}

// PUT
export async function PUT(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...fields } = body; // On sépare l'ID des autres champs

    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const updatedTask = await TaskService.update(userId, id, fields);
    
    if (!updatedTask) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

    return NextResponse.json(updatedTask);
  } catch (err: any) {
    console.error("Erreur PUT task:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const deleted = await TaskService.delete(userId, id);

    if (!deleted) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

    return NextResponse.json({ message: "Supprimé" });
  } catch (err: any) {
    console.error("Erreur DELETE task:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}