// src/app/(admin)/admin/page.tsx
import { DashboardClient } from "@/components/admin/dashboard/DashboardClient";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, Task, Client } from "@/lib/order-client";

export const dynamic = "force-dynamic";

type OrderWithClient = Order & { clients: Client | null };

export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const [{ data: orders }, { data: tasks }, { data: settings }] = await Promise.all([
    supabase.from("orders").select("*, clients(*)").order("created_at", { ascending: false }),
    supabase.from("tasks").select("*"),
    supabase.from("settings").select("exchange_rate_usd_to_fcfa").eq("id", 1).single(),
  ]);

  const usdRate = settings?.exchange_rate_usd_to_fcfa ?? 2800;

  return (
    <DashboardClient
      orders={(orders as OrderWithClient[] | null) ?? []}
      tasks={(tasks as Task[] | null) ?? []}
      usdRate={usdRate}
    />
  );
}