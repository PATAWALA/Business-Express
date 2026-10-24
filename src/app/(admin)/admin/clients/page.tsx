// src/app/(admin)/admin/clients/page.tsx
import { ClientsClient } from "@/components/admin/clients/ClientsClient";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Client } from "@/lib/order-client";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const supabase = createAdminClient();
  
  // On récupère les clients ET le taux de change USD en même temps
  const [{ data: clients }, { data: settings }] = await Promise.all([
    supabase.from("clients").select("*").order("name"),
    supabase.from("settings").select("exchange_rate_usd_to_fcfa").eq("id", 1).single(),
  ]);

  const usdRate = settings?.exchange_rate_usd_to_fcfa ?? 2800;

  return (
    <ClientsClient 
      clients={(clients as Client[] | null) ?? []} 
      usdRate={usdRate} 
    />
  );
}