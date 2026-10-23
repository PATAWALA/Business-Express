// src/components/admin/settings/SettingsClient.tsx
"use client";

import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ExchangeRateSection } from "./ExchangeRateSection";
import { CompanyInfoSection } from "./CompanyInfoSection";
import { SystemPreferencesSection } from "./SystemPreferencesSection";
import type { Settings } from "@/lib/order-client";

interface Props {
  settings: Settings;
}

export function SettingsClient({ settings }: Props) {
  return (
    <div>
      <PageHeader
        title="Paramètres"
        subtitle="Configuration globale de votre système"
      />

      <div className="space-y-6 max-w-4xl">
        <ExchangeRateSection settings={settings} />
        <CompanyInfoSection settings={settings} />
        <SystemPreferencesSection settings={settings} />

        {/* Info future */}
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
            🚧 À venir
          </h3>
          <ul className="text-sm text-slate-600 space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="text-blue-500">→</span>
              Gestion des rôles utilisateurs (admin, agent, comptable)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-500">→</span>
              Templates de factures PDF personnalisables
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-500">→</span>
              Intégration WhatsApp Business API
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-500">→</span>
              Export automatique des données (backup)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}