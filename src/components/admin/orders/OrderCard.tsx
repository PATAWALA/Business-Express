// src/components/admin/orders/OrderCard.tsx
"use client";

import { ArrowRight, Truck, CheckCircle2, Zap, Loader2, Eye, Calendar, AlertCircle } from "lucide-react";
import type { Order, Client } from "@/lib/order-client";
import { formatFCFA, formatDate } from "@/lib/admin-utils";
import { Avatar } from "@/components/admin/ui/Avatar";
import { Button } from "@/components/admin/ui/Button";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

type OrderWithClient = Order & { clients: Client | null };

interface Props {
  order: OrderWithClient;
  isLoading: boolean;
  onAdvanceStatus: () => void;
  onOpenDetails: () => void;
}

export function OrderCard({ order, isLoading, onAdvanceStatus, onOpenDetails }: Props) {
  const isNew = order.status === "new";
  const hasPrice = !!order.sale_price_fcfa && order.sale_price_fcfa > 0;
  const isNegativeMargin = hasPrice && (order.margin_fcfa ?? 0) < 0;

  // Configuration du bouton d'action selon le statut
  let actionLabel = "Gérer";
  let actionIcon = ArrowRight;
  let actionColor = "bg-blue-600 text-white hover:bg-blue-700";
  let showAction = true;

  if (isNew) {
    actionLabel = "Traiter";
    actionIcon = Zap;
    actionColor = "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/30";
  } else if (order.status === "quoted") {
    actionLabel = "Valider";
    actionIcon = CheckCircle2;
    actionColor = "bg-blue-600 text-white hover:bg-blue-700";
  } else if (order.status === "sourcing") {
    actionLabel = "Marquer Acheté";
    actionIcon = CheckCircle2;
    actionColor = "bg-orange-500 text-white hover:bg-orange-600";
  } else if (order.status === "purchased") {
    actionLabel = "En Transport";
    actionIcon = Truck;
    actionColor = "bg-indigo-600 text-white hover:bg-indigo-700";
  } else if (order.status === "freight") {
    actionLabel = "Marquer Livré";
    actionIcon = CheckCircle2;
    actionColor = "bg-emerald-600 text-white hover:bg-emerald-700";
  } else if (order.status === "delivered") {
    showAction = false;
  }

  const ActionIcon = actionIcon;

  return (
    <div className={`relative rounded-2xl border transition-all flex flex-col p-5 ${
      isNew 
        ? "border-red-200 bg-red-50/20 shadow-sm" 
        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
    }`}>
      
      {/* 1. En-tête : Client + Référence */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar name={order.clients?.name ?? "?"} size="md" />
          <div>
            <div className="font-bold text-slate-900 truncate">{order.clients?.name ?? "Client inconnu"}</div>
            <div className="text-xs font-mono text-slate-500">{order.order_ref}</div>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* 2. Article demandé */}
      <div className="mb-4 bg-slate-50 rounded-lg p-3 border border-slate-100">
        <div className="text-sm font-semibold text-slate-800 line-clamp-2">{order.items_description}</div>
        <div className="text-xs text-slate-500 flex items-center gap-1 mt-2">
          <Calendar className="h-3 w-3" />
          {formatDate(order.created_at)}
        </div>
      </div>

      {/* 3. Finances */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 border border-slate-100">
          <div className="text-[10px] uppercase font-bold text-slate-400">Prix Client</div>
          {hasPrice ? (
            <div className="font-bold text-slate-900">{formatFCFA(order.sale_price_fcfa)}</div>
          ) : (
            <div className="font-semibold text-amber-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> À calculer</div>
          )}
        </div>
        <div className={`rounded-lg p-3 border ${isNegativeMargin ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-100"}`}>
          <div className={`text-[10px] uppercase font-bold ${isNegativeMargin ? "text-red-500" : "text-emerald-600"}`}>Votre Marge</div>
          <div className={`font-bold ${isNegativeMargin ? "text-red-600" : "text-emerald-600"}`}>
            {hasPrice ? formatFCFA(order.margin_fcfa) : "—"}
          </div>
        </div>
      </div>

      {/* 4. Actions (Boutons en bas de la carte) */}
      <div className="mt-auto flex items-center gap-2">
        {showAction && (
          <Button
            size="sm"
            disabled={isLoading}
            onClick={(e) => { e.stopPropagation(); isNew ? onOpenDetails() : onAdvanceStatus(); }}
            className={`flex-1 gap-2 ${actionColor}`}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ActionIcon className="h-4 w-4" />}
            {actionLabel}
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => { e.stopPropagation(); onOpenDetails(); }} 
          className={`${showAction ? "flex-none px-3" : "flex-1"} gap-2`}
        >
          <Eye className="h-4 w-4" />
          {!showAction && "Voir les détails"}
        </Button>
      </div>
    </div>
  );
}