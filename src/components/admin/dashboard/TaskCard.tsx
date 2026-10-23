// src/components/admin/dashboard/TaskCard.tsx
"use client";

import { useState } from "react";
import { Check, Trash2, Loader2, Calendar } from "lucide-react";
import type { Task } from "@/lib/order-client";
import {
  formatDate,
  getPriorityColor,
  getPriorityLabel,
} from "@/lib/admin-utils";
import { useToast } from "@/components/admin/ui/ToastProvider";
import { useRouter } from "next/navigation";

interface Props {
  task: Task;
}

export function TaskCard({ task }: Props) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const isDone = task.completed ?? false;
  const isOverdue =
    !isDone && task.due_date && new Date(task.due_date) < new Date(new Date().toDateString());

  async function toggle() {
    setToggling(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !isDone }),
      });
      if (!res.ok) throw new Error();
      toast.success(isDone ? "Tâche réactivée" : "Tâche complétée ✅");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setToggling(false);
    }
  }

  async function remove() {
    if (!confirm("Supprimer cette tâche ?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Tâche supprimée");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className={`group flex items-start gap-3 rounded-xl border p-4 transition-all ${
        isDone
          ? "border-slate-200 bg-slate-50 opacity-70"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={toggle}
        disabled={toggling}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          isDone
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-300 hover:border-emerald-500"
        } disabled:opacity-50`}
        aria-label={isDone ? "Marquer non complétée" : "Marquer complétée"}
      >
        {toggling ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : isDone ? (
          <Check className="h-3 w-3" />
        ) : null}
      </button>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${getPriorityColor(
              task.priority
            )}`}
          >
            {getPriorityLabel(task.priority)}
          </span>
          {task.due_date && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] ${
                isOverdue ? "text-red-600 font-semibold" : "text-slate-500"
              }`}
            >
              <Calendar className="h-3 w-3" />
              {formatDate(task.due_date)}
              {isOverdue && " (en retard)"}
            </span>
          )}
        </div>
        <div
          className={`text-sm font-semibold ${
            isDone ? "text-slate-500 line-through" : "text-slate-900"
          }`}
        >
          {task.title}
        </div>
        {task.description && (
          <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">
            {task.description}
          </div>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={remove}
        disabled={deleting}
        className="shrink-0 p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
        aria-label="Supprimer"
      >
        {deleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}