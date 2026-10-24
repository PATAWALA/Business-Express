// src/app/(admin)/admin/commandes/page.tsx
import { Suspense } from "react";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, Client } from "@/lib/order-client";

export const dynamic = "force-dynamic";

type OrderWithClient = Order & { clients: Client | null };

export default async function CommandesPage() {
  const supabase = createAdminClient();
  
  const [{ data: orders }, { data: settings }] = await Promise.all([
    supabase.from("orders").select("*, clients(*)").order("created_at", { ascending: false }),
    supabase.from("settings").select("exchange_rate_usd_to_fcfa").eq("id", 1).single()
  ]);

  const usdRate = settings?.exchange_rate_usd_to_fcfa ?? 2800;

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Chargement...</div>}>
      <OrdersTable initialOrders={(orders as OrderWithClient[] | null) ?? []} usdRate={usdRate} />
    </Suspense>
  );
}