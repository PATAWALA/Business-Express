// src/components/admin/finance/FinanceClient.tsx
"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { formatAED, formatFCFA, formatDate } from "@/lib/admin-utils";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { TrendingUp, Wallet, ArrowDownRight } from "lucide-react";
import type { Order, Client } from "@/lib/order-client";

interface Props {
  orders: (Order & { clients: Client | null })[];
  exchangeRate: number;
}

export function FinanceClient({ orders, exchangeRate }: Props) {
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (s, o) => s + (o.sale_price_fcfa ?? 0),
      0
    );
    const totalMargin = orders.reduce((s, o) => s + (o.margin_fcfa ?? 0), 0);
    const totalPurchase = orders.reduce(
      (s, o) => s + (o.purchase_price_aed ?? 0),
      0
    );
    const totalTransport = orders.reduce(
      (s, o) => s + (o.transport_cost_aed ?? 0),
      0
    );
    const totalCostAED = totalPurchase + totalTransport;
    const totalCostFCFA = totalCostAED * exchangeRate;

    const byStatus = {
      sourcing: orders.filter((o) => o.status === "sourcing").length,
      purchased: orders.filter((o) => o.status === "purchased").length,
      freight: orders.filter((o) => o.status === "freight").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
    };

    return {
      totalRevenue,
      totalMargin,
      totalPurchase,
      totalTransport,
      totalCostAED,
      totalCostFCFA,
      byStatus,
    };
  }, [orders, exchangeRate]);

  return (
    <div>
      <PageHeader
        title="Trésorerie & Marges"
        subtitle={`${orders.length} commandes · Taux 1 AED = ${exchangeRate} FCFA`}
      />

      {/* KPIs principaux */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase mb-2">
            <Wallet className="h-3.5 w-3.5" />
            Chiffre d'affaires
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatFCFA(stats.totalRevenue)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Toutes commandes confondues
          </div>
        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-green-700 text-xs font-semibold uppercase mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            Marge nette réelle
          </div>
          <div className="text-2xl font-bold text-green-700">
            {formatFCFA(stats.totalMargin)}
          </div>
          <div className="text-xs text-green-600 mt-1">
            {stats.totalRevenue > 0
              ? `${((stats.totalMargin / stats.totalRevenue) * 100).toFixed(1)}% du CA`
              : "—"}
          </div>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-orange-700 text-xs font-semibold uppercase mb-2">
            <ArrowDownRight className="h-3.5 w-3.5" />
            Argent engagé
          </div>
          <div className="text-2xl font-bold text-orange-700">
            {formatAED(stats.totalCostAED)}
          </div>
          <div className="text-xs text-orange-600 mt-1">
            ≈ {formatFCFA(stats.totalCostFCFA)}
          </div>
        </div>
      </div>

      {/* Répartition par statut */}
      <div className="grid gap-3 sm:grid-cols-4 mb-8">
        {[
          { key: "sourcing", label: "🟡 En sourcing", value: stats.byStatus.sourcing },
          { key: "purchased", label: "🔵 Acheté", value: stats.byStatus.purchased },
          { key: "freight", label: "🟣 En fret", value: stats.byStatus.freight },
          { key: "delivered", label: "🟢 Livré", value: stats.byStatus.delivered },
        ].map((s) => (
          <div
            key={s.key}
            className="rounded-xl border border-slate-200 bg-white p-3 text-center"
          >
            <div className="text-xs text-slate-500">{s.label}</div>
            <div className="text-xl font-bold text-slate-900">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Détail par commande */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-900">
            Détail financier par commande
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-600 uppercase font-semibold">
              <tr className="text-left">
                <th className="px-4 py-3">Réf.</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Achat AED</th>
                <th className="px-4 py-3 text-right">Transport AED</th>
                <th className="px-4 py-3 text-right">Vente FCFA</th>
                <th className="px-4 py-3 text-right">Marge FCFA</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs font-bold">
                    {o.order_ref}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {o.clients?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatAED(o.purchase_price_aed)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatAED(o.transport_cost_aed)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatFCFA(o.sale_price_fcfa)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">
                    {formatFCFA(o.margin_fcfa)}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {formatDate(o.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}