// src/components/admin/clients/ClientsList.tsx
"use client";

import { Client } from "@/lib/mockData";
import { formatFCFA } from "@/lib/admin-utils";
import { MessageCircle, Phone } from "lucide-react";

function cleanPhone(phone: string | null): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

export function ClientsList({ clients }: { clients: Client[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => (
        <div
          key={client.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-bold text-slate-900">{client.name}</div>
              <div className="text-xs text-slate-500">
                {client.city}, {client.country}
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
            <div className="text-xs text-slate-500">Total dépensé</div>
            <div className="text-lg font-bold text-slate-900">
              {formatFCFA(client.total_spent_fcfa)}
            </div>
          </div>

          {client.notes && (
            <p className="text-xs text-slate-500 mb-4 italic">"{client.notes}"</p>
          )}

          <div className="flex gap-2">
            {client.whatsapp && (
              <a
                href={`https://wa.me/${cleanPhone(client.whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            )}
            {client.phone && (
              <a
                href={`tel:${client.phone}`}
                className="flex items-center justify-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}