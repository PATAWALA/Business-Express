// src/components/admin/orders/StatusDropdown.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type { Order } from "@/lib/order-client";
import { updateOrderStatus } from "@/lib/order-client";
import { useToast } from "@/components/admin/ui/ToastProvider";

const statusFlow: Order["status"][] = [
  "sourcing",
  "purchased",
  "freight",
  "delivered",
];

const statusLabels: Record<string, string> = {
  sourcing: "🟡 Sourcing",
  purchased: "🔵 Acheté",
  freight: "🟣 En fret",
  delivered: "🟢 Livré",
};

interface Props {
  orderId: string;
  currentStatus: Order["status"];
  onChanged: () => void;
}

export function StatusDropdown({ orderId, currentStatus, onChanged }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleChange(status: Order["status"]) {
    if (status === currentStatus) {
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      await updateOrderStatus(orderId, status);
      toast.success("Statut mis à jour ✅");
      setOpen(false);
      onChanged();
    } catch {
      toast.error("Erreur lors du changement de statut");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center gap-1 hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        <StatusBadge status={currentStatus} />
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-lg border border-slate-200 bg-white shadow-lg py-1">
          {statusFlow.map((s) => (
            <button
              key={s}
              onClick={() => handleChange(s)}
              disabled={loading}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 ${
                currentStatus === s ? "font-semibold text-blue-600" : "text-slate-700"
              }`}
            >
              <span>{statusLabels[s]}</span>
              {currentStatus === s && <Check className="h-3 w-3" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}