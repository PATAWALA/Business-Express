// src/components/admin/ui/Toast.tsx
"use client";

import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

const styles: Record<
  ToastType,
  { bg: string; icon: typeof CheckCircle2; iconColor: string }
> = {
  success: {
    bg: "bg-white border-emerald-200",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
  },
  error: {
    bg: "bg-white border-red-200",
    icon: AlertCircle,
    iconColor: "text-red-500",
  },
  info: {
    bg: "bg-white border-blue-200",
    icon: Info,
    iconColor: "text-blue-500",
  },
};

export function Toast({ type, message, onClose }: ToastProps) {
  const s = styles[type];
  const Icon = s.icon;

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-white p-4 shadow-lg animate-slide-up",
        s.bg
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", s.iconColor)} />
      <p className="flex-1 text-sm font-medium text-slate-800">{message}</p>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-700"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}