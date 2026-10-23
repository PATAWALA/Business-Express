// src/components/admin/dashboard/UrgentTasks.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, Sparkles } from "lucide-react";
import type { Task } from "@/lib/order-client";
import {
  formatDate,
  getPriorityLabel,
  getPriorityColor,
} from "@/lib/admin-utils";
import { Card } from "@/components/admin/ui/Card";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { useToast } from "@/components/admin/ui/ToastProvider";

interface Props {
  tasks: Task[];
}

const priorityOrder: Record<string, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export function UrgentTasks({ tasks }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const urgent = tasks
    .filter((t) => !t.completed)
    .filter((t) => t.priority === "urgent" || t.priority === "high")
    .sort((a, b) => {
      const pa = priorityOrder[a.priority] ?? 99;
      const pb = priorityOrder[b.priority] ?? 99;
      if (pa !== pb) return pa - pb;
      return (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999");
    })
    .slice(0, 5);

  async function toggleTask(task: Task) {
    setTogglingId(task.id);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!res.ok) throw new Error();
      toast.success("Tâche complétée ✅");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Tâches urgentes
            </h2>
            <p className="text-xs text-slate-500">
              {urgent.length} à traiter aujourd'hui
            </p>
          </div>
        </div>
        <Link
          href="/admin/taches"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Voir tout
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {urgent.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="Tout est à jour !"
          description="Aucune tâche urgente en attente."
          className="py-10"
        />
      ) : (
        <div className="divide-y divide-slate-100">
          {urgent.map((task) => {
            const isToggling = togglingId === task.id;
            return (
              <div
                key={task.id}
                className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
              >
                <button
                  onClick={() => toggleTask(task)}
                  disabled={isToggling}
                  className="mt-0.5 shrink-0 text-slate-300 hover:text-emerald-500 transition-colors disabled:opacity-50"
                  aria-label="Marquer comme complétée"
                >
                  <Circle className="h-5 w-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}
                    >
                      {getPriorityLabel(task.priority)}
                    </span>
                    {task.due_date && (
                      <span className="text-[11px] text-slate-500">
                        {formatDate(task.due_date)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-slate-900 leading-snug">
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {task.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}