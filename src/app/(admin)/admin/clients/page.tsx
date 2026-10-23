// src/app/(admin)/admin/clients/page.tsx
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ClientsList } from "@/components/admin/clients/ClientsList";
import { mockClients } from "@/lib/mockData";

export default function ClientsPage() {
  const clients = mockClients.filter((c) => c.type === "client").length;
  const prospects = mockClients.filter((c) => c.type === "prospect").length;

  return (
    <div>
      <PageHeader
        title="Clients & Prospects"
        subtitle={`${clients} clients · ${prospects} prospects`}
      />
      <ClientsList clients={mockClients} />
    </div>
  );
}