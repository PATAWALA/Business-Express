// src/components/admin/dashboard/DashboardClient.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { KpiCard } from "@/components/admin/ui/KpiCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import {
  formatFCFA,
  formatDate,
  getPriorityLabel,
  getPriorityColor,
} from "@/lib/admin-utils";
import { Wallet, TrendingUp, Package, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import type { Order, Task } from "@/lib/order-client";

interface Props {
  orders: Order[];
  tasks: Task[];
}

export function DashboardClient({ orders, tasks }: Props) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Recalcul KPIs
  const totalRevenue = useMemo(
    () => orders.reduce((s, o) => s + (o.sale_price_fcfa ?? 0), 0),
    [orders]
  );
  const totalMargin = useMemo(
    () => orders.reduce((s, o) => s + (o.margin_fcfa ?? 0), 0),
    [orders]
  );
  const inTransit = orders.filter((o) => o.status === "freight").length;
  const inSourcing = orders.filter((o) => o.status === "sourcing").length;

  const urgentTasks = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed)
        .filter((t) => t.priority === "urgent" || t.priority === "high")
        .slice(0, 4),
    [tasks]
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
        .slice(0, 5),
    [orders]
  );

  async function handleRefresh() {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 600);
  }

  async function toggleTask(taskId: string, completed: boolean) {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <PageHeader
          title="Bonjour Prince 👋"
          subtitle="Voici votre activité du jour"
        />
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Actualiser</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Chiffre d'affaires"
          value={formatFCFA(totalRevenue)}
          icon={Wallet}
          color="green"
        />
        <KpiCard
          title="Marge nette"
          value={formatFCFA(totalMargin)}
          icon={TrendingUp}
          color="blue"
        />
        <KpiCard
          title="En transit"
          value={`${inTransit} colis`}
          icon={Package}
          color="purple"
        />
        <KpiCard
          title="En sourcing"
          value={`${inSourcing} commandes`}
          icon={AlertCircle}
          color="yellow"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tâches urgentes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              ⚠️ Tâches urgentes
            </h2>
            <a
              href="/admin/taches"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Voir tout
            </a>
          </div>
          {urgentTasks.length === 0 ? (
            <div className="text-sm text-slate-500 text-center py-6">
              🎉 Aucune tâche urgente !
            </div>
          ) : (
            <div className="space-y-2">
              {urgentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50"
                >
                  <button
                    onClick={() => toggleTask(task.id, task.completed ?? false)}
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 hover:border-green-500"
                    aria-label="Marquer comme complétée"
                  >
                    <CheckCircle2 className="h-3 w-3 text-transparent hover:text-green-500" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-xs font-semibold px-2 py-0.5 rounded inline-block mb-1 ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {getPriorityLabel(task.priority)}
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {task.title}
                    </div>
                    {task.due_date && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        Échéance : {formatDate(task.due_date)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dernières commandes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              📦 Dernières commandes
            </h2>
            <a
              href="/admin/commandes"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Voir tout
            </a>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-sm text-slate-500 text-center py-6">
              Aucune commande pour l'instant.
            </div>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <a
                  key={order.id}
                  href="/admin/commandes"
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 font-mono">
                      {order.order_ref}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {order.items_description}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <StatusBadge status={order.status} />
                    <div className="text-xs font-semibold text-green-600 mt-1">
                      {formatFCFA(order.margin_fcfa)}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}