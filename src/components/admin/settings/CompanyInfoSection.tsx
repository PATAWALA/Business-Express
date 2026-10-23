// src/components/admin/settings/CompanyInfoSection.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/admin/ui/Button";
import { useToast } from "@/components/admin/ui/ToastProvider";
import type { Settings } from "@/lib/order-client";

interface Props {
  settings: Settings;
}

export function CompanyInfoSection({ settings }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    company_name: settings.company_name ?? "Business Express",
    company_email: settings.company_email ?? "",
    company_phone: settings.company_phone ?? "",
    company_whatsapp: settings.company_whatsapp ?? "",
    company_address_dubai: settings.company_address_dubai ?? "",
    company_address_bukavu: settings.company_address_bukavu ?? "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Informations enregistrées ✅");
      router.refresh();
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 shrink-0">
            <Building2 className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Informations entreprise</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Affichées sur les factures et documents officiels
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading}
          loading={loading}
          size="sm"
          className="gap-2"
        >
          {!loading && <Save className="h-4 w-4" />}
          Enregistrer
        </Button>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              value={form.company_name}
              onChange={(e) => update("company_name", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={form.company_email}
              onChange={(e) => update("company_email", e.target.value)}
              placeholder="contact@business-express.cd"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Téléphone
            </label>
            <input
              type="tel"
              value={form.company_phone}
              onChange={(e) => update("company_phone", e.target.value)}
              placeholder="+243 970 000 000"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              WhatsApp
            </label>
            <input
              type="tel"
              value={form.company_whatsapp}
              onChange={(e) => update("company_whatsapp", e.target.value)}
              placeholder="+243 970 000 000"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
            🇦🇪 Adresse bureau Dubaï
          </label>
          <input
            type="text"
            value={form.company_address_dubai}
            onChange={(e) => update("company_address_dubai", e.target.value)}
            placeholder="Deira, Dubaï, EAU"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
            🇨🇩 Adresse bureau Bukavu
          </label>
          <input
            type="text"
            value={form.company_address_bukavu}
            onChange={(e) => update("company_address_bukavu", e.target.value)}
            placeholder="Boulevard Kivu, Bukavu, RDC"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}