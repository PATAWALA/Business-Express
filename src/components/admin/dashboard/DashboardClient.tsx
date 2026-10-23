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
} from "lucide-react";
import type { Order, Task, Client } from "@/lib/order-client";
import { formatFCFA } from "@/lib/admin-utils";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Button } from "@/components/admin/ui/Button";
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

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Chiffre d'affaires"
          value={formatFCFA(stats.totalRevenue)}
          icon={Wallet}
          color="blue"
          variant="dark"
          sparklineData={stats.revenueSparkline}
        />
        <StatCard
          label="Marge nette"
          value={formatFCFA(stats.totalMargin)}
          icon={TrendingUp}
          color="green"
          trend={`${stats.marginRate}% du CA`}
          sparklineData={stats.marginSparkline}
        />
        <StatCard
          label="En transit"
          value={`${stats.inTransit} colis`}
          icon={Package}
          color="purple"
        />
        <StatCard
          label="En sourcing"
          value={`${stats.inSourcing} commandes`}
          icon={AlertCircle}
          color="amber"
        />
      </div>

      {/* Graphique */}
      <RevenueChart orders={orders} />

      {/* Tâches + Commandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UrgentTasks tasks={tasks} />
        <RecentOrders orders={orders} />
      </div>
    </div>
  );
}