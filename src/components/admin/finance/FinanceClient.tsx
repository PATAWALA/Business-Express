// src/components/admin/finance/FinanceClient.tsx
"use client";

import { useMemo, useState } from "react";
import {
  Wallet, TrendingUp, ArrowDownRight, Calendar, PackageCheck
} from "lucide-react";
import type { Order, Client } from "@/lib/order-client";
import { formatFCFA } from "@/lib/admin-utils";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { StatusPieChart } from "./StatusPieChart";

type OrderWithClient = Order & { clients: Client | null };
type Period = "all" | "month" | "3months";

interface Props {
  orders: OrderWithClient[];
  exchangeRate: number;
  usdRate: number;
}

export function FinanceClient({ orders, exchangeRate, usdRate }: Props) {
  const [period, setPeriod] = useState<Period>("all");

  const filtered = useMemo(() => {
    if (period === "all") return orders;
    const now = Date.now();
    const limit = period === "month" ? 30 : 90;
    return orders.filter((o) => o.created_at && now - new Date(o.created_at).getTime() <= limit * 86400000);
  }, [orders, period]);

  const stats = useMemo(() => {
    const totalRevenue = filtered.reduce((s, o) => s + (o.sale_price_fcfa ?? 0), 0);
    const totalMargin = filtered.reduce((s, o) => s + (o.margin_fcfa ?? 0), 0);
    
    const totalCostAED = filtered.reduce((s, o) => s + (o.purchase_price_aed ?? 0) + (o.transport_cost_aed ?? 0), 0);
    const totalTransferUSD = filtered.reduce((s, o) => s + (o.transfer_fee_usd ?? 0), 0);
    const totalSpent = (totalCostAED * exchangeRate) + (totalTransferUSD * usdRate);

    // Réel (Uniquement les livrés)
    const deliveredOrders = filtered.filter(o => o.status === "delivered");
    const realizedRevenue = deliveredOrders.reduce((s, o) => s + (o.sale_price_fcfa ?? 0), 0);
    const realizedMargin = deliveredOrders.reduce((s, o) => s + (o.margin_fcfa ?? 0), 0);

    return { totalSpent, totalRevenue, totalMargin, realizedRevenue, realizedMargin };
  }, [filtered, exchangeRate, usdRate]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finances"
        subtitle="Suivi de votre trésorerie en temps réel"
        action={
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "all", label: "Tout le temps" },
                { key: "month", label: "Ce mois-ci" },
                { key: "3months", label: "3 derniers mois" },
              ] as const
            ).map((opt) => {
              const isActive = period === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setPeriod(opt.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Calendar className="h-3 w-3" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        }
      />

      {/* 4 CARTES FINANCIÈRES ULTRA-CLAIRES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Argent Dépensé"
          value={formatFCFA(stats.totalSpent)}
          icon={ArrowDownRight}
          color="amber"
          trend="Achat + Transport + Transfert"
          trendUp={false}
        />
        <StatCard
          label="Prix Total Attendu"
          value={formatFCFA(stats.totalRevenue)}
          icon={Wallet}
          color="blue"
          trend="Ce que les clients doivent payer"
        />
        <StatCard
          label="Bénéfice Prévu"
          value={formatFCFA(stats.totalMargin)}
          icon={TrendingUp}
          color="green"
          trend="Vos frais de service"
        />
        <StatCard
          label="Argent Encaissé (Livré)"
          value={formatFCFA(stats.realizedRevenue)}
          icon={PackageCheck}
          color="purple"
          variant="dark"
          trend={`+${formatFCFA(stats.realizedMargin)} de bénéfice`}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 pt-4">
        <StatusPieChart orders={filtered} />

        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-900">Détail par commande</h2>
            <p className="text-xs text-slate-500">Le vrai coût et la vraie marge de chaque opération</p>
          </div>
          {filtered.length === 0 ? (
            <EmptyState icon={Wallet} title="Aucune commande" description="Créez une commande pour voir les détails." />
          ) : (
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs text-slate-600 uppercase font-semibold sticky top-0">
                  <tr className="text-left">
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3 text-right">Dépenses</th>
                    <th className="px-4 py-3 text-right">Prix Client</th>
                    <th className="px-4 py-3 text-right">Bénéfice</th>
                    <th className="px-4 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((o) => {
                    const costAed = (o.purchase_price_aed ?? 0) + (o.transport_cost_aed ?? 0);
                    const costFcfa = (costAed * exchangeRate) + ((o.transfer_fee_usd ?? 0) * usdRate);
                    return (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{o.clients?.name ?? "—"}</div>
                          <div className="text-[10px] font-mono text-slate-500">{o.order_ref}</div>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-red-500">
                          {costFcfa > 0 ? `-${formatFCFA(costFcfa)}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                          {o.sale_price_fcfa ? formatFCFA(o.sale_price_fcfa) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600">
                          {o.margin_fcfa ? `+${formatFCFA(o.margin_fcfa)}` : "—"}
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}