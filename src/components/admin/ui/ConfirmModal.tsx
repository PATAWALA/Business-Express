// src/components/admin/ui/ConfirmModal.tsx
"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "./Button";

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "danger",
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  if (!open) return null;

  const colors = {
    danger: {
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      btn: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30",
    },
    warning: {
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      btn: "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30",
    },
    info: {
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      btn: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30",
    },
  }[variant];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 text-center">
          <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${colors.iconBg}`}>
            <AlertTriangle className={`h-7 w-7 ${colors.iconColor}`} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>

        <div className="flex gap-2 p-4 pt-0">
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} disabled={loading} className={`flex-1 ${colors.btn}`}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}