import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ClientsList } from "@/components/admin/clients/ClientsList";
import { NewClientButton } from "@/components/admin/clients/NewClientButton";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const supabase = createAdminClient();
  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("name");

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-700">
        <p className="font-bold text-lg mb-2">Erreur Supabase</p>
        <pre className="text-xs whitespace-pre-wrap">{error.message}</pre>
        <p className="text-xs mt-2">Code : {error.code}</p>
        <p className="text-xs">Détail : {error.details}</p>
        <p className="text-xs">Hint : {error.hint}</p>
      </div>
    );
  }

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
