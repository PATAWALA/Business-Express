// src/components/admin/finance/FinanceClient.tsx
"use client";

import { useMemo, useState } from "react";
import {
  Wallet,
  TrendingUp,
  ArrowDownRight,
  Download,
  Calendar,
} from "lucide-react";
import type { Order, Client } from "@/lib/order-client";
import { formatAED, formatFCFA } from "@/lib/admin-utils";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PageHelp } from "@/components/admin/ui/PageHelp";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/admin/ui/Button";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { useToast } from "@/components/admin/ui/ToastProvider";
import { StatusPieChart } from "./StatusPieChart";

type OrderWithClient = Order & { clients: Client | null };
type Period = "all" | "month" | "3months";

interface Props {
  orders: OrderWithClient[];
  exchangeRate: number;
}

export function FinanceClient({ orders, exchangeRate }: Props) {
  const [period, setPeriod] = useState<Period>("all");
  const toast = useToast();

  const filtered = useMemo(() => {
    if (period === "all") return orders;
    const now = Date.now();
    const limit = period === "month" ? 30 : 90;
    return orders.filter((o) => {
      if (!o.created_at) return false;
      return now - new Date(o.created_at).getTime() <= limit * 86400000;
    });
  }, [orders, period]);

  const stats = useMemo(() => {
    const totalRevenue = filtered.reduce(
      (s, o) => s + (o.sale_price_fcfa ?? 0),
      0
    );
    const totalMargin = filtered.reduce((s, o) => s + (o.margin_fcfa ?? 0), 0);
    const totalPurchase = filtered.reduce(
      (s, o) => s + (o.purchase_price_aed ?? 0),
      0
    );
    const totalTransport = filtered.reduce(
      (s, o) => s + (o.transport_cost_aed ?? 0),
      0
    );
    const totalCostAED = totalPurchase + totalTransport;
    const totalCostFCFA = totalCostAED * exchangeRate;
    const marginRate =
      totalRevenue > 0 ? ((totalMargin / totalRevenue) * 100).toFixed(1) : "0";

    return {
      totalRevenue,
      totalMargin,
      totalCostAED,
      totalCostFCFA,
      marginRate,
    };
  }, [filtered, exchangeRate]);

  function exportCSV() {
    const rows = [
      [
        "Réf",
        "Client",
        "Article",
        "Statut",
        "Achat (AED)",
        "Transport (AED)",
        "Vente (FCFA)",
        "Marge (FCFA)",
        "Date",
      ],
      ...filtered.map((o) => [
        o.order_ref,
        o.clients?.name ?? "",
        o.items_description,
        o.status,
        o.purchase_price_aed ?? 0,
        o.transport_cost_aed ?? 0,
        o.sale_price_fcfa ?? 0,
        o.margin_fcfa ?? 0,
        o.created_at ? new Date(o.created_at).toLocaleDateString("fr-FR") : "",
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `business-express-finances-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV téléchargé ✅");
  }

  return (
    <div>
      <PageHeader
        title="Trésorerie & Marges"
        subtitle={`${filtered.length} commandes · Taux 1 AED = ${exchangeRate} FCFA`}
        action={
          <Button
            variant="outline"
            onClick={exportCSV}
            className="gap-2"
            disabled={filtered.length === 0}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        }
      />

      <div className="mb-4">
        <PageHelp
          title="💰 Où en est votre argent ?"
          description="Comprenez en 10 secondes combien vous gagnez avec votre business."
          steps={[
            {
              label: "Chiffre d'affaires",
              description:
                "C'est l'argent TOTAL de toutes vos ventes. Si vous vendez 10 téléphones à 1 million, ça fait 10 millions.",
            },
            {
              label: "Marge nette (Votre bénéfice)",
              description:
                "C'est ce qui vous reste dans la poche après avoir payé l'achat chez le fournisseur et le transport. C'est VOTRE argent.",
            },
            {
              label: "Argent engagé",
              description:
                "C'est l'argent que vous avez déjà dépensé à Dubaï pour acheter la marchandise (et qui va vous rapporter plus tard).",
            },
          ]}
          tips={[
            "Changez la période (30 jours, 90 jours) pour voir si vous vendez plus ce mois-ci que le mois dernier.",
            "Si votre marge est négative (en rouge), c'est que vous vendez à perte. Vérifiez vite votre prix d'achat !",
            "Téléchargez le tableau (Export CSV) pour l'envoyer à votre comptable.",
          ]}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(
          [
            { key: "all", label: "Tout" },
            { key: "month", label: "30 derniers jours" },
            { key: "3months", label: "90 derniers jours" },
          ] as const
        ).map((opt) => {
          const isActive = period === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => setPeriod(opt.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Calendar className="h-3 w-3" />
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Chiffre d'affaires"
          value={formatFCFA(stats.totalRevenue)}
          icon={Wallet}
          color="blue"
          variant="dark"
        />
        <StatCard
          label="Marge nette"
          value={formatFCFA(stats.totalMargin)}
          icon={TrendingUp}
          color="green"
          trend={`${stats.marginRate}% du CA`}
        />
        <StatCard
          label="Argent engagé"
          value={formatAED(stats.totalCostAED)}
          icon={ArrowDownRight}
          color="amber"
          trend={`≈ ${formatFCFA(stats.totalCostFCFA)}`}
          trendUp={false}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <StatusPieChart orders={filtered} />

        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-900">Détail financier</h2>
            <p className="text-xs text-slate-500">
              Toutes les commandes de la période
            </p>
          </div>
          {filtered.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="Aucune commande sur cette période"
              description="Essayez d'élargir la période."
            />
          ) : (
            <div className="overflow-x-auto max-h-[380px]">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs text-slate-600 uppercase font-semibold sticky top-0">
                  <tr className="text-left">
                    <th className="px-4 py-3">Réf.</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3 text-right">Vente</th>
                    <th className="px-4 py-3 text-right">Marge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs font-bold">
                        {o.order_ref}
                      </td>
                      <td className="px-4 py-3 text-slate-700 text-sm">
                        {o.clients?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {formatFCFA(o.sale_price_fcfa)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                        {formatFCFA(o.margin_fcfa)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}