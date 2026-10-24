// src/components/admin/settings/ExchangeRateSection.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, Save, Loader2, ArrowRightLeft } from "lucide-react";
import { formatDate } from "@/lib/admin-utils";
import { Button } from "@/components/admin/ui/Button";
import { useToast } from "@/components/admin/ui/ToastProvider";
import type { Settings } from "@/lib/order-client";

interface Props {
  settings: Settings;
}

export function ExchangeRateSection({ settings }: Props) {
  const router = useRouter();
  const toast = useToast();
  
  const [rateAed, setRateAed] = useState(settings.exchange_rate_aed_to_fcfa.toString());
  const [rateUsd, setRateUsd] = useState(settings.exchange_rate_usd_to_fcfa.toString());
  const [loading, setLoading] = useState(false);

  const hasChanged =
    rateAed !== settings.exchange_rate_aed_to_fcfa.toString() ||
    rateUsd !== settings.exchange_rate_usd_to_fcfa.toString();

  async function handleSave() {
    const numAed = parseFloat(rateAed);
    const numUsd = parseFloat(rateUsd);
    if (!numAed || numAed <= 0 || !numUsd || numUsd <= 0) {
      toast.error("Les taux doivent être supérieurs à 0");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exchange_rate_aed_to_fcfa: numAed,
          exchange_rate_usd_to_fcfa: numUsd,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Taux mis à jour ✅");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 shrink-0">
            <ArrowRightLeft className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Taux de change</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Utilisés pour calculer vos prix et vos marges en Dollars.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Taux USD (La monnaie principale en RDC) */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-1">
            💵 Taux du Dollar (USD)
          </label>
          <p className="text-xs text-slate-500 mb-2">Combien vaut 1 Dollar en Franc Congolais (FCFA) aujourd'hui ?</p>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min={1}
              value={rateUsd}
              onChange={(e) => setRateUsd(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="flex items-center text-sm font-semibold text-slate-500">FCFA</span>
          </div>
        </div>

        {/* Taux AED (La monnaie de Dubaï) */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-1">
            💰 Taux du Dirham (AED)
          </label>
          <p className="text-xs text-slate-500 mb-2">Combien vaut 1 Dirham de Dubaï en Franc Congolais (FCFA) ?</p>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min={1}
              value={rateAed}
              onChange={(e) => setRateAed(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="flex items-center text-sm font-semibold text-slate-500">FCFA</span>
          </div>
        </div>

        {/* Info actuelle */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 flex justify-between items-center">
          <div>
            <span className="font-semibold text-slate-900">Actuellement :</span> 1 $ = {settings.exchange_rate_usd_to_fcfa} FCFA · 1 AED = {settings.exchange_rate_aed_to_fcfa} FCFA
          </div>
          {settings.updated_at && (
            <div className="text-slate-400">Modifié le {formatDate(settings.updated_at)}</div>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={loading || !hasChanged}
          loading={loading}
          className="w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white"
        >
          {!loading && <Save className="h-4 w-4" />}
          Enregistrer les taux
        </Button>
      </div>
    </div>
  );
}