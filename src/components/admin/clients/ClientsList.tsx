// src/components/admin/clients/ClientsList.tsx
"use client";

import { useMemo, useState } from "react";
import { Search, MessageCircle, Sparkles } from "lucide-react";
import { type Client } from "@/lib/order-client";
import { formatFCFA } from "@/lib/admin-utils";
import { ClientDetailModal } from "./ClientDetailModal";

interface Props {
  clients: Client[];
  onRefresh: () => void;
}

function cleanPhone(phone: string | null): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

function isRecent(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const created = new Date(dateStr).getTime();
  const sevenDaysAgo = Date.now() - 7 * 86400000;
  return created >= sevenDaysAgo;
}

export function ClientsList({ clients, onRefresh }: Props) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? clients.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            (c.city ?? "").toLowerCase().includes(q)
        )
      : clients;

    // Tri : clients (par dépenses) puis prospects
    return [...list].sort((a, b) => {
      if (a.type !== b.type) return a.type === "client" ? -1 : 1;
      return (b.total_spent_fcfa ?? 0) - (a.total_spent_fcfa ?? 0);
    });
  }, [clients, query]);

  return (
    <>
      {/* Barre de recherche */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un client par nom ou ville..."
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500 text-sm">
          Aucun client ne correspond à "{query}".
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client) => {
            const whatsapp = client.whatsapp ?? client.phone;
            const recent = isRecent(client.created_at);
            return (
              <div
                key={client.id}
                onClick={() => setSelectedId(client.id)}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {client.name}
                        {recent && (
                          <span className="flex items-center gap-0.5 text-[9px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                            <Sparkles className="h-2 w-2" />
                            Nouveau
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        {client.city}
                        {client.country ? `, ${client.country}` : ""}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      client.type === "client"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {client.type === "client" ? "Client" : "Prospect"}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-[10px] uppercase font-semibold text-slate-500">
                    Total dépensé
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {formatFCFA(client.total_spent_fcfa ?? 0)}
                  </div>
                </div>

                {client.notes && (
                  <p className="text-xs text-slate-500 mb-3 italic line-clamp-2">
                    "{client.notes}"
                  </p>
                )}

                <div className="flex gap-2">
                  {whatsapp && (
                    <a
                      href={`https://wa.me/${cleanPhone(whatsapp)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ClientDetailModal
        clientId={selectedId}
        onClose={() => setSelectedId(null)}
        onRefresh={onRefresh}
      />
    </>
  );
}