// src/components/admin/dashboard/TasksClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  formatDate,
  getPriorityLabel,
  getPriorityColor,
} from "@/lib/admin-utils";
import { Plus, CheckCircle2, Circle, Trash2, Loader2, X } from "lucide-react";
import type { Task } from "@/lib/order-client";

interface Props {
  tasks: Task[];
}

export function TasksClient({ tasks }: Props) {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "normal" | "high" | "urgent">("normal");
  const [newDueDate, setNewDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const pending = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  async function toggle(task: Task) {
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  }

  async function remove(taskId: string) {
    if (!confirm("Supprimer cette tâche ?")) return;
    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  }

  async function createTask() {
    if (!newTitle.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          priority: newPriority,
          due_date: newDueDate || null,
        }),
      });
      setNewTitle("");
      setNewDueDate("");
      setNewPriority("normal");
      setShowNew(false);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <PageHeader
          title="Tâches"
          subtitle={`${pending.length} en attente · ${done.length} terminées`}
        />
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nouvelle tâche
        </button>
      </div>

      {/* Modal nouveau */}
      {showNew && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900">Nouvelle tâche</h3>
            <button
              onClick={() => setShowNew(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Titre de la tâche"
              autoFocus
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm"
              >
                <option value="low">Basse</option>
                <option value="normal">Normale</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgente</option>
              </select>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <button
              onClick={createTask}
              disabled={loading || !newTitle.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded-lg"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Créer
            </button>
          </div>
        </div>
      )}

      {/* En attente */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
          En attente ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500 text-sm">
            🎉 Aucune tâche en attente
          </div>
        ) : (
          <div className="space-y-2">
            {pending.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 hover:bg-slate-50"
              >
                <button
                  onClick={() => toggle(task)}
                  className="mt-0.5 text-slate-400 hover:text-green-500"
                  aria-label="Marquer comme complétée"
                >
                  <Circle className="h-5 w-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {getPriorityLabel(task.priority)}
                    </span>
                    {task.due_date && (
                      <span className="text-xs text-slate-500">
                        · {formatDate(task.due_date)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      {task.description}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => remove(task.id)}
                  className="text-slate-300 hover:text-red-500 p-1"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Terminées */}
      {done.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
            Terminées ({done.length})
          </h2>
          <div className="space-y-2">
            {done.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 opacity-60"
              >
                <button
                  onClick={() => toggle(task)}
                  className="mt-0.5 text-green-500"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-500 line-through">
                    {task.title}
                  </div>
                </div>
                <button
                  onClick={() => remove(task.id)}
                  className="text-slate-300 hover:text-red-500 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}