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
    // Calculs en FCFA (base de données)
    const totalRevenueFcfa = filtered.reduce((s, o) => s + (o.sale_price_fcfa ?? 0), 0);
    const totalMarginFcfa = filtered.reduce((s, o) => s + (o.margin_fcfa ?? 0), 0);
    
    const totalCostAED = filtered.reduce((s, o) => s + (o.purchase_price_aed ?? 0) + (o.transport_cost_aed ?? 0), 0);
    const totalTransferUSD = filtered.reduce((s, o) => s + (o.transfer_fee_usd ?? 0), 0);
    const totalSpentFcfa = (totalCostAED * exchangeRate) + (totalTransferUSD * usdRate);

    const deliveredOrders = filtered.filter(o => o.status === "delivered");
    const realizedRevenueFcfa = deliveredOrders.reduce((s, o) => s + (o.sale_price_fcfa ?? 0), 0);
    const realizedMarginFcfa = deliveredOrders.reduce((s, o) => s + (o.margin_fcfa ?? 0), 0);

    // Conversion en USD pour l'affichage principal
    return { 
      totalSpent: Math.round(totalSpentFcfa / usdRate),
      totalRevenue: Math.round(totalRevenueFcfa / usdRate),
      totalMargin: Math.round(totalMarginFcfa / usdRate),
      realizedRevenue: Math.round(realizedRevenueFcfa / usdRate),
      realizedMargin: Math.round(realizedMarginFcfa / usdRate),
      // Garder les valeurs FCFA pour les sous-titres
      totalSpentFcfa, totalRevenueFcfa, totalMarginFcfa, realizedRevenueFcfa, realizedMarginFcfa
    };
  }, [filtered, exchangeRate, usdRate]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finances"
        subtitle="Votre argent, vos dépenses et vos bénéfices en Dollars."
        action={
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "all", label: "Tout" },
                { key: "month", label: "Ce mois-ci" },
                { key: "3months", label: "3 mois" },
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

      {/* 4 CARTES FINANCIÈRES (Affichage en Dollars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Argent Dépensé"
          value={`${stats.totalSpent.toLocaleString("fr-FR")} $`}
          icon={ArrowDownRight}
          color="amber"
          trend={`≈ ${formatFCFA(stats.totalSpentFcfa)}`}
          trendUp={false}
        />
        <StatCard
          label="Prix Total Attendu"
          value={`${stats.totalRevenue.toLocaleString("fr-FR")} $`}
          icon={Wallet}
          color="blue"
          trend={`≈ ${formatFCFA(stats.totalRevenueFcfa)}`}
        />
        <StatCard
          label="Bénéfice Prévu"
          value={`${stats.totalMargin.toLocaleString("fr-FR")} $`}
          icon={TrendingUp}
          color="green"
          trend={`≈ ${formatFCFA(stats.totalMarginFcfa)}`}
        />
        <StatCard
          label="Argent Encaissé (Livré)"
          value={`${stats.realizedRevenue.toLocaleString("fr-FR")} $`}
          icon={PackageCheck}
          color="purple"
          variant="dark"
          trend={`+${stats.realizedMargin.toLocaleString("fr-FR")} $ de marge`}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 pt-4">
        <StatusPieChart orders={filtered} />

        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-900">Détail par commande</h2>
            <p className="text-xs text-slate-500">Le vrai coût et la vraie marge de chaque opération (en $)</p>
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
                    
                    // Conversion en USD pour l'affichage
                    const costUsd = Math.round(costFcfa / usdRate);
                    const saleUsd = Math.round((o.sale_price_fcfa ?? 0) / usdRate);
                    const marginUsd = Math.round((o.margin_fcfa ?? 0) / usdRate);
                    
                    const isNegative = marginUsd < 0;

                    return (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{o.clients?.name ?? "—"}</div>
                          <div className="text-[10px] font-mono text-slate-500">{o.order_ref}</div>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-red-500">
                          {costUsd > 0 ? `-${costUsd.toLocaleString("fr-FR")} $` : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                          {saleUsd > 0 ? `${saleUsd.toLocaleString("fr-FR")} $` : "—"}
                        </td>
                        <td className={`px-4 py-3 text-right font-bold ${isNegative ? "text-red-600" : "text-emerald-600"}`}>
                          {marginUsd !== 0 ? `${isNegative ? "" : "+"}${marginUsd.toLocaleString("fr-FR")} $` : "—"}
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