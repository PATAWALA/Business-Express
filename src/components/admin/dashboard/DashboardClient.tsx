// src/components/admin/dashboard/DashboardClient.tsx
"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  Package,
  AlertCircle,
  Plus,
  RefreshCw,
  ArrowRight,
  Users,
  CheckCircle2,
  ArrowDownRight,
} from "lucide-react";
import type { Order, Task, Client } from "@/lib/order-client";
import { formatFCFA } from "@/lib/admin-utils";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Button } from "@/components/admin/ui/Button";
import { ShareProjectLink } from "@/components/admin/shared/ShareProjectLink";
import { RevenueChart } from "./RevenueChart";
import { UrgentTasks } from "./UrgentTasks";
import { RecentOrders } from "./RecentOrders";

type OrderWithClient = Order & { clients: Client | null };

interface Props {
  orders: OrderWithClient[];
  tasks: Task[];
  usdRate: number;
}

export function DashboardClient({ orders, tasks, usdRate = 2800 }: Props) {
  const router = useRouter();

  const stats = useMemo(() => {
    // --- CHIFFRES FINANCIERS ---
    const totalRevenue = orders.reduce((s, o) => s + (o.sale_price_fcfa ?? 0), 0);
    const totalMargin = orders.reduce((s, o) => s + (o.margin_fcfa ?? 0), 0);
    
    // Dépenses (Uniquement ceux qui ont un prix d'achat renseigné)
    const totalCostAED = orders.reduce((s, o) => s + (o.purchase_price_aed ?? 0) + (o.transport_cost_aed ?? 0), 0);
    const totalTransferUSD = orders.reduce((s, o) => s + (o.transfer_fee_usd ?? 0), 0);
    const totalSpent = (totalCostAED * (orders[0]?.exchange_rate_aed_to_fcfa || 762)) + (totalTransferUSD * usdRate);

    // --- STATUTS COMMANDES ---
    const newProspects = orders.filter((o) => o.status === "new").length;
    const inSourcing = orders.filter((o) => o.status === "sourcing" || o.status === "quoted").length;
    const inTransit = orders.filter((o) => o.status === "freight" || o.status === "purchased").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;

    const marginRate = totalRevenue > 0 ? ((totalMargin / totalRevenue) * 100).toFixed(1) : "0";

    // Sparklines (6 mois)
    const revenueSparkline: number[] = [];
    const marginSparkline: number[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthOrders = orders.filter((o) => {
        if (!o.created_at) return false;
        const od = new Date(o.created_at);
        return `${od.getFullYear()}-${String(od.getMonth() + 1).padStart(2, "0")}` === key;
      });
      revenueSparkline.push(monthOrders.reduce((s, o) => s + (o.sale_price_fcfa ?? 0), 0));
      marginSparkline.push(monthOrders.reduce((s, o) => s + (o.margin_fcfa ?? 0), 0));
    }

    return {
      totalRevenue, totalMargin, totalSpent,
      newProspects, inSourcing, inTransit, delivered,
      marginRate, revenueSparkline, marginSparkline,
    };
  }, [orders, usdRate]);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER ULTRA-ÉPURÉ */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-sm text-slate-500 mt-1 capitalize">{today}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.refresh()} className="bg-white gap-2">
            <RefreshCw className="h-4 w-4" /> Actualiser
          </Button>
          <Link href="/admin/commandes">
            <Button variant="primary" size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Nouvelle commande
            </Button>
          </Link>
        </div>
      </div>

      {/* ALERTE PROSPECTS (Uniquement si nouveaux) */}
      {stats.newProspects > 0 && (
        <Link
          href="/admin/commandes?status=new"
          className="flex items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-4 hover:bg-red-100 transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shrink-0 animate-pulse">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-red-900">
              Action requise : {stats.newProspects} nouveau{stats.newProspects > 1 ? "x" : ""} prospect{stats.newProspects > 1 ? "s" : ""}
            </div>
            <div className="text-xs text-red-700">
              Ces clients ont besoin d'un devis. Cliquez pour traiter.
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-red-600" />
        </Link>
      )}

      {/* --- SECTION 1 : FINANCES --- */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Vue financière (Tout le temps)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Argent Dépensé (Achat + Fret)"
            value={formatFCFA(stats.totalSpent)}
            icon={ArrowDownRight}
            color="amber"
            trend="Investi à Dubaï"
            trendUp={false}
          />
          <StatCard
            label="Chiffre d'Affaires Attendu"
            value={formatFCFA(stats.totalRevenue)}
            icon={Wallet}
            color="blue"
            variant="dark"
            sparklineData={stats.revenueSparkline}
          />
          <StatCard
            label="Votre Bénéfice (Marge)"
            value={formatFCFA(stats.totalMargin)}
            icon={TrendingUp}
            color="green"
            trend={`${stats.marginRate}% du CA`}
            sparklineData={stats.marginSparkline}
          />
        </div>
      </div>

      {/* --- SECTION 2 : ÉTAT DES COMMANDES --- */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">État des commandes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/commandes?status=new">
            <StatCard label="Nouveaux prospects" value={`${stats.newProspects}`} icon={Users} color="red" />
          </Link>
          <Link href="/admin/commandes?status=sourcing">
            <StatCard label="En recherche / devis" value={`${stats.inSourcing}`} icon={AlertCircle} color="amber" />
          </Link>
          <Link href="/admin/commandes?status=freight">
            <StatCard label="En transport" value={`${stats.inTransit}`} icon={Package} color="purple" />
          </Link>
          <Link href="/admin/commandes?status=delivered">
            <StatCard label="Livrées (terminées)" value={`${stats.delivered}`} icon={CheckCircle2} color="green" />
          </Link>
        </div>
      </div>

      {/* GRAPHIQUE ET LIEN */}
      <div className="grid lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2">
          <RevenueChart orders={orders} />
        </div>
        <div>
          <ShareProjectLink />
        </div>
      </div>

      {/* TÂCHES ET DERNIÈRES COMMANDES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        <UrgentTasks tasks={tasks} />
        <RecentOrders orders={orders} />
      </div>
    </div>
  );
}