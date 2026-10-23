// src/components/admin/dashboard/RecentOrders.tsx
"use client";

import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import type { Order, Client } from "@/lib/order-client";
import { formatFCFA } from "@/lib/admin-utils";
import { Card } from "@/components/admin/ui/Card";
import { Avatar } from "@/components/admin/ui/Avatar";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { EmptyState } from "@/components/admin/ui/EmptyState";

type OrderWithClient = Order & { clients: Client | null };

interface Props {
  orders: OrderWithClient[];
}

export function RecentOrders({ orders }: Props) {
  const recent = [...orders]
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
    .slice(0, 5);

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
            <Package className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Commandes récentes
            </h2>
            <p className="text-xs text-slate-500">Les 5 dernières</p>
          </div>
        </div>
        <Link
          href="/admin/commandes"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Voir tout
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Aucune commande"
          description="Créez votre première commande pour commencer."
          className="py-10"
        />
      ) : (
        <div className="divide-y divide-slate-100">
          {recent.map((order) => (
            <Link
              key={order.id}
              href="/admin/commandes"
              className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
            >
              <Avatar name={order.clients?.name ?? "?"} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {order.order_ref}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {order.clients?.name ?? "—"} · {order.items_description}
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <div className="text-xs font-semibold text-slate-900">
                  {formatFCFA(order.sale_price_fcfa)}
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">
                  +{formatFCFA(order.margin_fcfa)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}