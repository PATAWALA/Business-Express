// src/app/(admin)/admin/taches/page.tsx
import { TasksClient } from "@/components/admin/dashboard/TasksClient";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Task } from "@/lib/order-client";

export const dynamic = "force-dynamic";

export default async function TachesPage() {
  const supabase = createAdminClient();
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .order("completed", { ascending: true })
    .order("due_date", { ascending: true });

  return <TasksClient tasks={(tasks as Task[] | null) ?? []} />;
}