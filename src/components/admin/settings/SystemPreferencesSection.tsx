// src/components/admin/settings/SystemPreferencesSection.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sliders, Bell, Zap } from "lucide-react";
import { useToast } from "@/components/admin/ui/ToastProvider";
import type { Settings } from "@/lib/order-client";

interface Props {
  settings: Settings;
}

export function SystemPreferencesSection({ settings }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [notifications, setNotifications] = useState(
    settings.notifications_enabled ?? true
  );
  const [autoTasks, setAutoTasks] = useState(
    settings.auto_tasks_enabled ?? true
  );

  async function update(field: string, value: boolean) {
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error();
      toast.success("Préférence mise à jour ✅");
      router.refresh();
    } catch {
      toast.error("Erreur");
      // Revert
      if (field === "notifications_enabled") setNotifications(!value);
      if (field === "auto_tasks_enabled") setAutoTasks(!value);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 shrink-0">
            <Sliders className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Préférences système</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automatisations et comportements par défaut
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {/* Notifications */}
        <div className="flex items-start justify-between gap-4 p-5">
          <div className="flex items-start gap-3 flex-1">
            <Bell className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Notifications
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Recevoir des alertes pour les nouvelles commandes et tâches
              </div>
            </div>
          </div>
          <ToggleSwitch
            checked={notifications}
            onChange={(v) => {
              setNotifications(v);
              update("notifications_enabled", v);
            }}
          />
        </div>

        {/* Auto-tasks */}
        <div className="flex items-start justify-between gap-4 p-5">
          <div className="flex items-start gap-3 flex-1">
            <Zap className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Tâches automatiques
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Générer automatiquement des tâches quand une commande est créée
              </div>
            </div>
          </div>
          <ToggleSwitch
            checked={autoTasks}
            onChange={(v) => {
              setAutoTasks(v);
              update("auto_tasks_enabled", v);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}