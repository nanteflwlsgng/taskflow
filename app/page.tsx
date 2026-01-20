import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import TasksClient from "./tasks/TasksClient";

export default async function Tasks() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <TasksClient />;
}
