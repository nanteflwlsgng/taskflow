import pool from "@/lib/db";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "doing" | "done";
  created_at: string;
  updated_at: string;
  user_id: string; // Ajouté
};

export const TaskService = {
  async getAll(userId: string): Promise<Task[]> {
    const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
    return result.rows;
  },

  async create(userId: string, title: string, description?: string): Promise<Task> {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *`,
      [title, description, userId]
    );
    return result.rows[0];
  },

  // MODIFIÉ : On demande userId pour vérifier l'appartenance
  async update(userId: string, taskId: string, fields: Partial<Omit<Task, "id" | "created_at">>): Promise<Task | null> {
    const keys = Object.keys(fields).filter(k => fields[k as keyof typeof fields] !== undefined);
    if (keys.length === 0) return null;

    const setString = keys.map((key, index) => `"${key}"=$${index + 1}`).join(", ");
    const values = keys.map(k => fields[k as keyof typeof fields]);

    // On ajoute userId dans la condition WHERE
    const query = `UPDATE tasks SET ${setString}, updated_at=NOW() WHERE id=$${keys.length + 1} AND user_id=$${keys.length + 2} RETURNING *`;
    
    const result = await pool.query(query, [...values, taskId, userId]);
    return result.rows[0] || null;
  },

  // MODIFIÉ : On demande userId
  async delete(userId: string, taskId: string): Promise<boolean> {
    const result = await pool.query("DELETE FROM tasks WHERE id=$1 AND user_id=$2", [taskId, userId]);
    return (result.rowCount ?? 0) > 0;
  },
};