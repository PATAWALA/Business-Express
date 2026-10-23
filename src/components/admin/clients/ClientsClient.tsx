// src/components/admin/clients/ClientsClient.tsx
"use client";

import { useMemo, useState } from "react";
import { Search, Users, X } from "lucide-react";
import type { Client } from "@/lib/order-client";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PageHelp } from "@/components/admin/ui/PageHelp";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { ShareProjectLink } from "@/components/admin/shared/ShareProjectLink";
import { NewClientButton } from "./NewClientButton";
import { ClientCard } from "./ClientCard";
import { ClientDetailModal } from "./ClientDetailModal";

interface Props {
  clients: Client[];
}

type FilterKey = "all" | "client" | "prospect";

export function ClientsClient({ clients }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      all: clients.length,
      client: clients.filter((c) => c.type === "client").length,
      prospect: clients.filter((c) => c.type === "prospect").length,
    }),
    [clients]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = clients;

    if (filter !== "all") {
      list = list.filter((c) => c.type === filter);
    }

    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.city ?? "").toLowerCase().includes(q) ||
          (c.whatsapp ?? "").toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      if (a.type !== b.type) return a.type === "client" ? -1 : 1;
      return (b.total_spent_fcfa ?? 0) - (a.total_spent_fcfa ?? 0);
    });
  }, [clients, filter, search]);

  return (
    <div>
      <PageHeader
        title="Clients & Prospects"
        subtitle={`${counts.client} clients · ${counts.prospect} prospects`}
        action={<NewClientButton />}
      />

      {/* Encart pédagogique */}
      <div className="mb-4">
        <PageHelp
          title="💡 Comment gérer vos clients"
          description="Tous vos clients et prospects au même endroit"
          steps={[
            {
              label: "Comprenez la différence",
              description:
                "🟢 Client = a déjà acheté. 🟡 Prospect = n'a pas encore acheté (vient du formulaire /projet).",
            },
            {
              label: "Ajoutez un client manuellement",
              description:
                "Cliquez '+ Nouveau client'. Remplissez au minimum le nom et le WhatsApp.",
            },
            {
              label: "Ou partagez votre lien /projet",
              description:
                "Envoyez ce lien à vos prospects. Ils remplissent eux-mêmes, et apparaissent automatiquement dans cette liste.",
            },
            {
              label: "Ouvrez une fiche client",
              description:
                "Cliquez sur une carte pour voir : historique, total dépensé, marge générée, notes internes. Vous pouvez tout modifier.",
            },
          ]}
          tips={[
            "Les badges '🆕 Nouveau' apparaissent pour les clients ajoutés dans les 7 derniers jours.",
            "Le bouton WhatsApp ouvre directement la conversation avec le client.",
            "Les notes internes sont visibles uniquement par vous.",
          ]}
        />
      </div>

      {/* Lien de collecte */}
      <div className="mb-6">
        <ShareProjectLink variant="card" />
      </div>

      {/* Recherche */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, ville ou WhatsApp..."
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              aria-label="Effacer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(
          [
            { key: "all", label: "Tous", color: "bg-slate-900 text-white" },
            {
              key: "client",
              label: "Clients",
              color: "bg-emerald-600 text-white",
            },
            {
              key: "prospect",
              label: "Prospects",
              color: "bg-amber-500 text-white",
            },
          ] as const
        ).map((opt) => {
          const isActive = filter === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? `${opt.color} shadow-sm`
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {opt.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/20" : "bg-slate-100 text-slate-500"
                }`}
              >
                {counts[opt.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grille */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <EmptyState
            icon={Users}
            title={
              search || filter !== "all"
                ? "Aucun résultat"
                : "Aucun client pour l'instant"
            }
            description={
              search || filter !== "all"
                ? "Essayez d'ajuster votre recherche ou vos filtres."
                : "Ajoutez votre premier client pour démarrer."
            }
            action={!search && filter === "all" ? <NewClientButton /> : undefined}
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onClick={() => setSelectedId(client.id)}
            />
          ))}
        </div>
      )}

      <ClientDetailModal
        clientId={selectedId}
        onClose={() => setSelectedId(null)}
        onRefresh={() => {}}
      />
    </div>
  );
}