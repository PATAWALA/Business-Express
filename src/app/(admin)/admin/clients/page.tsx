// src/app/(admin)/admin/clients/page.tsx
import { ClientsClient } from "@/components/admin/clients/ClientsClient";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Client } from "@/lib/order-client";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const supabase = createAdminClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("name");

  return <ClientsClient clients={(clients as Client[] | null) ?? []} />;
}