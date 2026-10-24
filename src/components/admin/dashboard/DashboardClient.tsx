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
  Inbox,
  Users,
  CheckCircle2,
} from "lucide-react";
import type { Order, Task, Client } from "@/lib/order-client";
import { formatFCFA } from "@/lib/admin-utils";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Button } from "@/components/admin/ui/Button";
import { PageHelp } from "@/components/admin/ui/PageHelp";
import { ShareProjectLink } from "@/components/admin/shared/ShareProjectLink";
import { RevenueChart } from "./RevenueChart";
import { UrgentTasks } from "./UrgentTasks";
import { RecentOrders } from "./RecentOrders";

type OrderWithClient = Order & { clients: Client | null };

interface Props {
  orders: OrderWithClient[];
  tasks: Task[];
}

export function DashboardClient({ orders, tasks }: Props) {
  const router = useRouter();

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (s, o) => s + (o.sale_price_fcfa ?? 0),
      0
    );
    const totalMargin = orders.reduce((s, o) => s + (o.margin_fcfa ?? 0), 0);
    
    // Nouveaux calculs
    const newProspects = orders.filter((o) => o.status === "new").length;
    const inSourcing = orders.filter((o) => o.status === "sourcing").length;
    const inTransit = orders.filter((o) => o.status === "freight").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;

    const marginRate =
      totalRevenue > 0 ? ((totalMargin / totalRevenue) * 100).toFixed(1) : "0";

    const revenueSparkline: number[] = [];
    const marginSparkline: number[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthOrders = orders.filter((o) => {
        if (!o.created_at) return false;
        const od = new Date(o.created_at);
        return (
          `${od.getFullYear()}-${String(od.getMonth() + 1).padStart(2, "0")}` ===
          key
        );
      });
      revenueSparkline.push(
        monthOrders.reduce((s, o) => s + (o.sale_price_fcfa ?? 0), 0)
      );
      marginSparkline.push(
        monthOrders.reduce((s, o) => s + (o.margin_fcfa ?? 0), 0)
      );
    }

    return {
      totalRevenue,
      totalMargin,
      newProspects,
      inSourcing,
      inTransit,
      delivered,
      marginRate,
      revenueSparkline,
      marginSparkline,
    };
  }, [orders]);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 capitalize">
            {today}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Bonjour Prince 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {pendingTasksCount > 0
              ? `${pendingTasksCount} tâche${pendingTasksCount > 1 ? "s" : ""} en attente aujourd'hui`
              : "Tout est à jour, bonne journée !"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => router.refresh()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Actualiser</span>
          </Button>
          <Link href="/admin/commandes">
            <Button variant="primary" size="md" className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle commande
            </Button>
          </Link>
        </div>
      </div>

      {/* ALERTE ROUGE + AIDE CÔTE À CÔTE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {stats.newProspects > 0 ? (
          <Link
            href="/admin/commandes?status=new"
            className="group relative overflow-hidden flex items-center gap-4 rounded-2xl border-2 border-red-300 bg-gradient-to-r from-red-500 to-red-600 p-5 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white shrink-0 animate-pulse">
              <Inbox className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="text-base font-bold text-white">
                ⚠️ {stats.newProspects} nouvelle{stats.newProspects > 1 ? "s" : ""} demande{stats.newProspects > 1 ? "s" : ""} !
              </div>
              <div className="text-sm text-red-100 mt-0.5">
                Cliquez ici pour traiter les prospects en attente.
              </div>
            </div>
            <ArrowRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm h-full">
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-700">
                Aucun prospect en attente
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Vous avez traité toutes les demandes.
              </div>
            </div>
          </div>
        )}

        <PageHelp
          title="💡 Aide & Statistiques"
          description="Comprenez votre activité en un clin d'œil"
          steps={[
            {
              label: "Prospects en attente",
              description: "Ce sont les clients qui ont rempli le formulaire sur votre site. Contactez-les sur WhatsApp !",
            },
            {
              label: "En Sourcing",
              description: "Vous avez validé le prix. Vous cherchez maintenant la marchandise à Dubaï.",
            },
            {
              label: "En Transit",
              description: "La marchandise a été achetée et est en route vers l'Afrique.",
            },
            {
              label: "Livré",
              description: "Le client a reçu sa commande. L'argent est encaissé.",
            },
          ]}
          tips={[
            "Marge nette = ce que vous gagnez après avoir payé le fournisseur et le transport.",
            "Partagez votre lien /projet pour avoir plus de prospects.",
          ]}
          defaultOpen={false}
        />
      </div>

      {/* 4 STAT CARDS (Maintenant plus claires) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/commandes?status=new" className="block">
          <StatCard
            label="Prospects en attente"
            value={`${stats.newProspects} demandes`}
            icon={Users}
            color="red"
          />
        </Link>
        <Link href="/admin/commandes?status=sourcing" className="block">
          <StatCard
            label="En Sourcing"
            value={`${stats.inSourcing} commandes`}
            icon={AlertCircle}
            color="amber"
          />
        </Link>
        <Link href="/admin/commandes?status=freight" className="block">
          <StatCard
            label="En Transit"
            value={`${stats.inTransit} colis`}
            icon={Package}
            color="purple"
          />
        </Link>
        <Link href="/admin/commandes?status=delivered" className="block">
          <StatCard
            label="Clients Livrés"
            value={`${stats.delivered} commandes`}
            icon={CheckCircle2}
            color="green"
          />
        </Link>
      </div>

      {/* FINANCES (CA et Marge) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/finances" className="block">
          <StatCard
            label="Chiffre d'affaires total"
            value={formatFCFA(stats.totalRevenue)}
            icon={Wallet}
            color="blue"
            variant="dark"
            sparklineData={stats.revenueSparkline}
          />
        </Link>
        <Link href="/admin/finances" className="block">
          <StatCard
            label="Marge nette totale"
            value={formatFCFA(stats.totalMargin)}
            icon={TrendingUp}
            color="green"
            trend={`${stats.marginRate}% du CA`}
            sparklineData={stats.marginSparkline}
          />
        </Link>
      </div>

      {/* LIEN DE COLLECTE PROJET */}
      <ShareProjectLink variant="card" />

      {/* GRAPHIQUE */}
      <RevenueChart orders={orders} />

      {/* TÂCHES + COMMANDES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UrgentTasks tasks={tasks} />
        <RecentOrders orders={orders} />
      </div>
    </div>
  );
}