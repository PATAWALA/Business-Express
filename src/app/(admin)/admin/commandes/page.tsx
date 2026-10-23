// src/app/(admin)/admin/commandes/page.tsx
import { OrdersTable } from "@/components/admin/orders/OrdersTable";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, Client } from "@/lib/order-client";

export const dynamic = "force-dynamic";

type OrderWithClient = Order & { clients: Client | null };

export default async function CommandesPage() {
  const supabase = createAdminClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, clients(*)")
    .order("created_at", { ascending: false });

  return <OrdersTable initialOrders={(orders as OrderWithClient[] | null) ?? []} />;
}