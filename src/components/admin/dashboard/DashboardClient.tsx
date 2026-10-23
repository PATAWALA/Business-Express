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

interface ProjectMinimal {
  id: string;
  status: "new" | "contacted" | "quoted" | "converted" | "archived";
  created_at: string | null;
}

interface Props {
  orders: OrderWithClient[];
  tasks: Task[];
  projects: ProjectMinimal[];
}

export function DashboardClient({ orders, tasks, projects }: Props) {
  const router = useRouter();

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (s, o) => s + (o.sale_price_fcfa ?? 0),
      0
    );
    const totalMargin = orders.reduce((s, o) => s + (o.margin_fcfa ?? 0), 0);
    const inTransit = orders.filter((o) => o.status === "freight").length;
    const inSourcing = orders.filter((o) => o.status === "sourcing").length;

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
      inTransit,
      inSourcing,
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

  // ✅ Compte les projets "new" récents (24h), pas les commandes
  const newProjectsCount = projects.filter((p) => {
    if (!p.created_at) return false;
    return (
      p.status === "new" &&
      Date.now() - new Date(p.created_at).getTime() < 24 * 3600000
    );
  }).length;

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* HEADER                                                       */}
      {/* ============================================================ */}
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

      {/* ============================================================ */}
      {/* ALERTE : Nouveaux projets (conditionnel)                     */}
      {/* ============================================================ */}
      {newProjectsCount > 0 && (
        <Link
          href="/admin/projets"
          className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0 animate-pulse text-lg">
            🆕
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-blue-900">
              {newProjectsCount} nouveau{newProjectsCount > 1 ? "x" : ""} projet
              {newProjectsCount > 1 ? "s" : ""} reçu
              {newProjectsCount > 1 ? "s" : ""} dans les dernières 24h
            </div>
            <div className="text-xs text-blue-700">
              Cliquez pour voir les prospects
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-blue-600" />
        </Link>
      )}

      {/* ============================================================ */}
      {/* ENCART AIDE                                                  */}
      {/* ============================================================ */}
      <PageHelp
        title="💡 Comment utiliser votre dashboard"
        description="Vue d'ensemble de votre activité Business Express"
        steps={[
          {
            label: "Consultez vos chiffres en un coup d'œil",
            description:
              "Les 4 cartes en haut montrent votre chiffre d'affaires total, votre marge nette, les colis en transit et les commandes en sourcing. Cliquez sur n'importe quelle carte pour voir le détail.",
          },
          {
            label: "Suivez vos tâches urgentes",
            description:
              "Les tâches en rouge/orange sont prioritaires aujourd'hui. Cochez-les au fur et à mesure. Elles disparaissent automatiquement une fois terminées.",
          },
          {
            label: "Partagez votre lien de collecte projet",
            description:
              "Envoyez ce lien à vos prospects WhatsApp/TikTok. Ils déposent leur projet et vous les retrouvez dans 'Demandes projet'.",
          },
          {
            label: "Vérifiez les nouvelles demandes",
            description:
              "Le bandeau bleu en haut apparaît quand de nouveaux projets arrivent. Cliquez pour les traiter.",
          },
        ]}
        tips={[
          "Marge nette = ce que vous gagnez après avoir payé l'achat et le transport.",
          "Les données sont mises à jour en temps réel depuis Supabase.",
          "Utilisez le bouton 'Actualiser' si vous voulez forcer le rafraîchissement.",
        ]}
        defaultOpen={false}
      />

      {/* ============================================================ */}
      {/* 4 STAT CARDS (cliquables)                                    */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/finances" className="block">
          <StatCard
            label="Chiffre d'affaires"
            value={formatFCFA(stats.totalRevenue)}
            icon={Wallet}
            color="blue"
            variant="dark"
            sparklineData={stats.revenueSparkline}
          />
        </Link>
        <Link href="/admin/finances" className="block">
          <StatCard
            label="Marge nette"
            value={formatFCFA(stats.totalMargin)}
            icon={TrendingUp}
            color="green"
            trend={`${stats.marginRate}% du CA`}
            sparklineData={stats.marginSparkline}
          />
        </Link>
        <Link href="/admin/commandes?status=freight" className="block">
          <StatCard
            label="En transit"
            value={`${stats.inTransit} colis`}
            icon={Package}
            color="purple"
          />
        </Link>
        <Link href="/admin/commandes?status=sourcing" className="block">
          <StatCard
            label="En sourcing"
            value={`${stats.inSourcing} commandes`}
            icon={AlertCircle}
            color="amber"
          />
        </Link>
      </div>

      {/* ============================================================ */}
      {/* LIEN DE COLLECTE PROJET                                      */}
      {/* ============================================================ */}
      <ShareProjectLink variant="card" />

      {/* ============================================================ */}
      {/* GRAPHIQUE                                                    */}
      {/* ============================================================ */}
      <RevenueChart orders={orders} />

      {/* ============================================================ */}
      {/* TÂCHES + COMMANDES RÉCENTES                                  */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UrgentTasks tasks={tasks} />
        <RecentOrders orders={orders} />
      </div>
    </div>
  );
}