// src/components/admin/clients/ClientsClient.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, X, UserCheck, UserX } from "lucide-react";
import type { Client } from "@/lib/order-client";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { ShareProjectLink } from "@/components/admin/shared/ShareProjectLink";
import { NewClientButton } from "./NewClientButton";
import { ClientCard } from "./ClientCard";
import { ClientDetailModal } from "./ClientDetailModal";
import { useToast } from "@/components/admin/ui/ToastProvider";

interface Props {
  clients: Client[];
  usdRate: number; // ✅ Ajouté
}

type FilterKey = "all" | "client" | "prospect";

export function ClientsClient({ clients, usdRate }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts = useMemo(() => ({
    all: clients.length,
    client: clients.filter((c) => c.type === "client").length,
    prospect: clients.filter((c) => c.type === "prospect").length,
  }), [clients]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = clients;
    if (filter !== "all") list = list.filter((c) => c.type === filter);
    if (q) list = list.filter((c) => c.name.toLowerCase().includes(q) || (c.city ?? "").toLowerCase().includes(q) || (c.whatsapp ?? "").toLowerCase().includes(q));
    return [...list].sort((a, b) => a.type !== b.type ? (a.type === "client" ? -1 : 1) : (b.total_spent_fcfa ?? 0) - (a.total_spent_fcfa ?? 0));
  }, [clients, filter, search]);

  async function toggleType(client: Client) {
    const newType = client.type === "client" ? "prospect" : "client";
    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: newType }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Passé en ${newType}`);
      router.refresh();
    } catch {
      toast.error("Erreur");
    }
  }

  return (
    <div>
      <PageHeader 
        title="Clients & Prospects" 
        subtitle="Gérez vos contacts et convertissez vos prospects en clients." 
        action={<NewClientButton />} 
      />

      <div className="mb-6">
        <ShareProjectLink variant="card" />
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un nom, une ville..." className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"><X className="h-4 w-4" /></button>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {([ { key: "all", label: "Tous", color: "bg-slate-900 text-white" }, { key: "client", label: "Clients", color: "bg-emerald-600 text-white" }, { key: "prospect", label: "Prospects", color: "bg-amber-500 text-white" } ] as const).map((opt) => {
          const isActive = filter === opt.key;
          return (
            <button key={opt.key} onClick={() => setFilter(opt.key)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isActive ? `${opt.color} shadow-sm` : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}>
              {opt.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>{counts[opt.key]}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <EmptyState icon={Users} title="Aucun client" description="Ajoutez votre premier client pour démarrer." action={<NewClientButton />} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((client) => (
            <div key={client.id} className="relative group">
              <ClientCard client={client} onClick={() => setSelectedId(client.id)} />
              
              <button
                onClick={() => toggleType(client)}
                title={client.type === "client" ? "Rétrograder en Prospect" : "Promouvoir en Client"}
                className="absolute top-3 right-3 p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-300 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                {client.type === "client" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>
      )}

      <ClientDetailModal 
        clientId={selectedId} 
        onClose={() => setSelectedId(null)} 
        onRefresh={() => {}} 
        usdRate={usdRate} // ✅ Ajouté ici
      />
    </div>
  );
}