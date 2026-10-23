// src/app/(admin)/admin/clients/page.tsx
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ClientsList } from "@/components/admin/clients/ClientsList";
import { NewClientButton } from "@/components/admin/clients/NewClientButton";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const supabase = createAdminClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("name");

  const all = clients ?? [];
  const nbClients = all.filter((c) => c.type === "client").length;
  const nbProspects = all.filter((c) => c.type === "prospect").length;

  return (
    <div>
      <PageHeader
        title="Clients & Prospects"
        subtitle={`${nbClients} clients · ${nbProspects} prospects`}
        action={<NewClientButton onCreated={() => {}} />}
      />
      <ClientsList clients={all} onRefresh={() => {}} />
    </div>
  );
}