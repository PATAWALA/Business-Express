// src/components/admin/clients/ClientCard.tsx
"use client";

import { MessageCircle, Sparkles, TrendingUp } from "lucide-react";
import type { Client } from "@/lib/order-client";
import { formatFCFA } from "@/lib/admin-utils";
import { Avatar } from "@/components/admin/ui/Avatar";

interface Props {
  client: Client;
  onClick: () => void;
}

function cleanPhone(phone: string | null): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

function isRecent(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr).getTime() >= Date.now() - 7 * 86400000;
}

export function ClientCard({ client, onClick }: Props) {
  const whatsapp = client.whatsapp ?? client.phone;
  const recent = isRecent(client.created_at);

  return (
    <div
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:border-slate-300 cursor-pointer transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={client.name} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-900 truncate">
                {client.name}
              </span>
              {recent && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700">
                  <Sparkles className="h-2 w-2" />
                  Nouveau
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {client.city ?? "—"}
              {client.country ? `, ${client.country}` : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Type badge */}
      <div className="mb-4">
        <span
          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            client.type === "client"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          {client.type === "client" ? "Client" : "Prospect"}
        </span>
      </div>

      {/* KPI */}
      <div className="mb-4">
        <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wide mb-1">
          Total dépensé
        </div>
        <div className="text-lg font-bold text-slate-900">
          {formatFCFA(client.total_spent_fcfa ?? 0)}
        </div>
      </div>

      {/* Notes */}
      {client.notes && (
        <p className="text-xs text-slate-500 italic mb-3 line-clamp-2">
          "{client.notes}"
        </p>
      )}

      {/* Actions */}
      {whatsapp && (
        <a
          href={`https://wa.me/${cleanPhone(whatsapp)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold py-2 transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp
        </a>
      )}
    </div>
  );
}