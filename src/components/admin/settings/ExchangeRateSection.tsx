// src/components/admin/settings/ExchangeRateSection.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, Save, Loader2, CheckCircle2 } from "lucide-react";
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
  const [rate, setRate] = useState(
    settings.exchange_rate_aed_to_fcfa.toString()
  );
  const [loading, setLoading] = useState(false);

  const currentRate = settings.exchange_rate_aed_to_fcfa;
  const hasChanged = rate !== currentRate.toString();

  async function handleSave() {
    const numericRate = parseFloat(rate);
    if (!numericRate || numericRate <= 0) {
      toast.error("Le taux doit être supérieur à 0");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchange_rate_aed_to_fcfa: numericRate }),
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
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Taux de change</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Utilisé pour convertir les prix d'achat en AED vers FCFA
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Taux actuel */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
          <div className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-1">
            Taux actuel
          </div>
          <div className="text-2xl font-bold text-slate-900">
            1 AED = {currentRate} FCFA
          </div>
          {settings.updated_at && (
            <div className="text-xs text-slate-500 mt-1">
              Modifié le {formatDate(settings.updated_at)}
            </div>
          )}
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Nouveau taux (FCFA pour 1 AED)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.01"
                min={1}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                FCFA
              </span>
            </div>
            <Button
              onClick={handleSave}
              disabled={loading || !hasChanged}
              loading={loading}
              className="gap-2"
            >
              {!loading && <Save className="h-4 w-4" />}
              Enregistrer
            </Button>
          </div>
        </div>

        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
          ⚠️ Le taux n'affecte <strong>que les nouvelles commandes</strong>. Les
          commandes existantes gardent leur taux historique.
        </div>
      </div>
    </div>
  );
}