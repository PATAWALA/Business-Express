// src/app/(admin)/admin/page.tsx
import { DashboardClient } from "@/components/admin/dashboard/DashboardClient";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, Task, Client } from "@/lib/order-client";

export const dynamic = "force-dynamic";

type OrderWithClient = Order & { clients: Client | null };

interface ProjectMinimal {
  id: string;
  status: "new" | "contacted" | "quoted" | "converted" | "archived";
  created_at: string | null;
}

export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const [{ data: orders }, { data: tasks }, { data: projects }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("*, clients(*)")
        .order("created_at", { ascending: false }),
      supabase.from("tasks").select("*"),
      supabase
        .from("project_requests")
        .select("id, status, created_at")
        .order("created_at", { ascending: false }),
    ]);

  return (
    <DashboardClient
      orders={(orders as OrderWithClient[] | null) ?? []}
      tasks={(tasks as Task[] | null) ?? []}
      projects={(projects as ProjectMinimal[] | null) ?? []}
    />
  );
}