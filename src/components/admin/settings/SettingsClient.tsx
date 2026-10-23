// src/components/admin/settings/SettingsClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { formatDate } from "@/lib/admin-utils";
import { Save, Loader2, CheckCircle2, DollarSign } from "lucide-react";
import type { Settings } from "@/lib/order-client";

interface Props {
  initialSettings: Settings;
}

export function SettingsClient({ initialSettings }: Props) {
  const router = useRouter();
  const [rate, setRate] = useState(initialSettings.exchange_rate_aed_to_fcfa.toString());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentRate = initialSettings.exchange_rate_aed_to_fcfa;

  async function handleSave() {
    const numericRate = parseFloat(rate);
    if (!numericRate || numericRate <= 0) {
      setError("Le taux doit être supérieur à 0");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchange_rate_aed_to_fcfa: numericRate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setMessage("Taux mis à jour avec succès");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Paramètres"
        subtitle="Configuration globale du système"
      />

      <div className="max-w-2xl space-y-6">
        {/* Taux de change */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Taux de change</h2>
              <p className="text-sm text-slate-500">
                Utilisé pour convertir les prix d'achat en AED vers FCFA
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 mb-4 text-sm">
            <div className="text-slate-600">
              Taux actuel :{" "}
              <strong className="text-slate-900">
                1 AED = {currentRate} FCFA
              </strong>
            </div>
            {initialSettings.updated_at && (
              <div className="text-xs text-slate-500 mt-1">
                Dernière modification : {formatDate(initialSettings.updated_at)}
              </div>
            )}
          </div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Nouveau taux (FCFA pour 1 AED)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min={1}
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSave}
              disabled={loading || rate === currentRate.toString()}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-lg"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Enregistrer
            </button>
          </div>

          {message && (
            <div className="mt-3 rounded-lg bg-green-50 border border-green-200 p-3 text-xs text-green-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {message}
            </div>
          )}
          {error && (
            <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="mt-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-800">
            ⚠️ <strong>Note importante</strong> : le taux n'affecte <strong>que les nouvelles commandes</strong>. Les commandes existantes gardent leur taux historique pour préserver la vérité comptable.
          </div>
        </div>

        {/* Info future */}
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <h3 className="font-bold text-slate-700 mb-2">🚧 Paramètres à venir</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Informations de l'entreprise (logo, adresse, contacts)</li>
            <li>• Notifications (email, WhatsApp)</li>
            <li>• Gestion des rôles utilisateurs</li>
            <li>• Export des données</li>
          </ul>
        </div>
      </div>
    </div>
  );
}