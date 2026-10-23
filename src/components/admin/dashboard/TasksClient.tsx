// src/components/admin/dashboard/TasksClient.tsx
"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X, ListTodo, CheckCircle2 } from "lucide-react";
import type { Task } from "@/lib/order-client";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Button } from "@/components/admin/ui/Button";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { TaskCard } from "./TaskCard";
import { NewTaskModal } from "./NewTaskModal";

interface Props {
  tasks: Task[];
}

type StatusFilter = "all" | "pending" | "done";
type PriorityFilter = "all" | "urgent" | "high" | "normal" | "low";

const priorityOrder: Record<string, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export function TasksClient({ tasks }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [newOpen, setNewOpen] = useState(false);

  const counts = useMemo(
    () => ({
      all: tasks.length,
      pending: tasks.filter((t) => !t.completed).length,
      done: tasks.filter((t) => t.completed).length,
    }),
    [tasks]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = tasks;

    if (statusFilter === "pending") list = list.filter((t) => !t.completed);
    if (statusFilter === "done") list = list.filter((t) => t.completed);

    if (priorityFilter !== "all") {
      list = list.filter((t) => t.priority === priorityFilter);
    }

    if (q) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q)
      );
    }

    // Tri : non complétées d'abord, puis par priorité, puis par échéance
    return [...list].sort((a, b) => {
      if ((a.completed ?? false) !== (b.completed ?? false)) {
        return a.completed ? 1 : -1;
      }
      const pa = priorityOrder[a.priority] ?? 99;
      const pb = priorityOrder[b.priority] ?? 99;
      if (pa !== pb) return pa - pb;
      return (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999");
    });
  }, [tasks, statusFilter, priorityFilter, search]);

  const pending = filtered.filter((t) => !t.completed);
  const done = filtered.filter((t) => t.completed);

  return (
    <div>
      <PageHeader
        title="Tâches"
        subtitle={`${counts.pending} en attente · ${counts.done} terminée${counts.done > 1 ? "s" : ""}`}
        action={
          <Button
            variant="primary"
            onClick={() => setNewOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle tâche
          </Button>
        }
      />

      {/* Recherche */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une tâche..."
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              aria-label="Effacer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filtres statut */}
      <div className="flex flex-wrap gap-2 mb-3">
        {(
          [
            { key: "all", label: "Toutes", color: "bg-slate-900 text-white" },
            { key: "pending", label: "En attente", color: "bg-amber-500 text-white" },
            { key: "done", label: "Terminées", color: "bg-emerald-600 text-white" },
          ] as const
        ).map((opt) => {
          const isActive = statusFilter === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => setStatusFilter(opt.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? `${opt.color} shadow-sm`
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {opt.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/20" : "bg-slate-100 text-slate-500"
                }`}
              >
                {counts[opt.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filtres priorité */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(
          [
            { key: "all", label: "Toutes priorités" },
            { key: "urgent", label: "🔴 Urgentes" },
            { key: "high", label: "🟠 Hautes" },
            { key: "normal", label: "🔵 Normales" },
            { key: "low", label: "⚪ Basses" },
          ] as const
        ).map((opt) => {
          const isActive = priorityFilter === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => setPriorityFilter(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Contenu */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <EmptyState
            icon={ListTodo}
            title={
              search || priorityFilter !== "all"
                ? "Aucun résultat"
                : statusFilter === "done"
                ? "Aucune tâche terminée"
                : statusFilter === "pending"
                ? "Aucune tâche en attente 🎉"
                : "Aucune tâche"
            }
            description={
              search || priorityFilter !== "all"
                ? "Essayez d'ajuster votre recherche ou vos filtres."
                : statusFilter === "pending"
                ? "Tout est à jour !"
                : "Créez votre première tâche pour commencer."
            }
            action={
              statusFilter !== "done" && !search && priorityFilter === "all" ? (
                <Button onClick={() => setNewOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nouvelle tâche
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* En attente */}
          {pending.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  À faire ({pending.length})
                </h2>
              </div>
              <div className="space-y-2">
                {pending.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Terminées */}
          {done.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Terminées ({done.length})
                </h2>
              </div>
              <div className="space-y-2">
                {done.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal création */}
      <NewTaskModal open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  );
}