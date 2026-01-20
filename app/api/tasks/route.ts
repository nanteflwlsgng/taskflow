export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { TaskService } from "@/services/task.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Fonction utilitaire pour vérifier la session (DRY - Don't Repeat Yourself)
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
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST
export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, description } = body;

    // C'est ici que tu avais le bug : on doit RETOURNER le résultat
    const task = await TaskService.create(userId, title, description);
    
    // ✅ Le voici le return manquant !
    return NextResponse.json(task, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erreur création" }, { status: 400 });
  }
}

// PUT
export async function PUT(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, title, description, status } = body;

    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    // On passe userId pour sécuriser la modification
    const updatedTask = await TaskService.update(userId, id, { title, description, status });
    
    if (!updatedTask) return NextResponse.json({ error: "Tâche introuvable ou accès refusé" }, { status: 404 });

    return NextResponse.json(updatedTask);
  } catch (err: any) {
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

    // On passe userId pour sécuriser la suppression
    const deleted = await TaskService.delete(userId, id);

    if (!deleted) return NextResponse.json({ error: "Tâche introuvable ou accès refusé" }, { status: 404 });

    return NextResponse.json({ message: "Tâche supprimée" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}