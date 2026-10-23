// src/app/(admin)/admin/page.tsx
import { DashboardClient } from "@/components/admin/dashboard/DashboardClient";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const [{ data: orders }, { data: tasks }] = await Promise.all([
    supabase.from("orders").select("*"),
    supabase.from("tasks").select("*"),
  ]);

  return <DashboardClient orders={orders ?? []} tasks={tasks ?? []} />;
}