// src/app/(admin)/admin/commandes/page.tsx
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function CommandesPage() {
  const supabase = createAdminClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, clients(*)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Commandes"
        subtitle={`${orders?.length ?? 0} commandes au total`}
      />
      <OrdersTable initialOrders={orders ?? []} />
    </div>
  );
}