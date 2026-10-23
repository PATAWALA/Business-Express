// src/app/(admin)/admin/finances/page.tsx
import { FinanceClient } from "@/components/admin/finance/FinanceClient";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function FinancesPage() {
  const supabase = createAdminClient();

  const [{ data: orders }, { data: settings }] = await Promise.all([
    supabase
      .from("orders")
      .select("*, clients(*)")
      .order("created_at", { ascending: false }),
    supabase.from("settings").select("*").eq("id", 1).single(),
  ]);

  return (
    <FinanceClient
      orders={orders ?? []}
      exchangeRate={settings?.exchange_rate_aed_to_fcfa ?? 762}
    />
  );
}