// src/components/admin/dashboard/UrgentTasks.tsx
import { Task } from "@/lib/mockData";
import { formatDate, getPriorityLabel, getPriorityColor } from "@/lib/admin-utils";

export function UrgentTasks({ tasks }: { tasks: Task[] }) {
  const pending = tasks.filter((t) => !t.completed).slice(0, 4);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4">
        ⚠️ Tâches urgentes
      </h2>
      <div className="space-y-3">
        {pending.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50"
          >
            <div
              className={`text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap ${getPriorityColor(task.priority)}`}
            >
              {getPriorityLabel(task.priority)}
            </div>
            <div className="flex-1 min-w-0">
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
    </div>
  );
}