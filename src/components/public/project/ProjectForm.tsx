// src/components/public/project/ProjectForm.tsx
"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  User,
  Phone,
  MapPin,
  Briefcase,
  Wallet,
  FileText,
} from "lucide-react";
import { Button } from "@/components/public/ui/Button";

const cities = [
  "Bukavu",
  "Goma",
  "Kinshasa",
  "Lubumbashi",
  "Kisangani",
  "Bunia",
  "Uvira",
  "Dubaï (EAU)",
  "Autre",
];

const projectTypes = [
  "Sourcing & Import de marchandises",
  "Achat de produits électroniques",
  "Import textile & vêtements",
  "Pièces auto & accessoires",
  "Conteneur complet",
  "Voyage d'affaires à Dubaï",
  "Tourisme VIP à Dubaï",
  "Autre projet",
];

const budgets = [
  "Moins de 1 000 000 FCFA",
  "1 000 000 – 5 000 000 FCFA",
  "5 000 000 – 20 000 000 FCFA",
  "20 000 000 – 50 000 000 FCFA",
  "Plus de 50 000 000 FCFA",
  "À définir ensemble",
];

interface SuccessData {
  agent_whatsapp: string;
  full_name: string;
}

export function ProjectForm() {
  const [form, setForm] = useState({
    full_name: "",
    whatsapp: "",
    city: "Bukavu",
    project_type: "",
    budget: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessData | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      !form.full_name.trim() ||
      !form.whatsapp.trim() ||
      !form.description.trim()
    ) {
      setError("Merci de remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/public/project-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setSuccess({
        agent_whatsapp: data.agent_whatsapp,
        full_name: form.full_name,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // État de succès
  if (success) {
    const whatsappMessage = `Bonjour Prince, je viens de déposer mon projet sur votre site. Mon nom est ${success.full_name}. Merci de m'en dire plus.`;
    const whatsappLink = `https://wa.me/${success.agent_whatsapp}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6 animate-slide-up">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3">
          Projet reçu avec succès ✅
        </h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Merci <strong>{success.full_name}</strong> ! Nous étudions votre
          demande et nous vous recontactons <strong>sous 48h</strong>.
        </p>

        <div className="space-y-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Discuter maintenant sur WhatsApp
          </a>
          <p className="text-xs text-slate-500">
            Vous pouvez aussi fermer cette page. Nous vous contacterons sur
            WhatsApp.
          </p>
        </div>
      </div>
    );
  }

  // Formulaire
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-200 overflow-hidden"
    >
      {/* Header du formulaire */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold mb-3">
          <Sparkles className="h-3 w-3" />
          Sans engagement · Réponse sous 48h
        </div>
        <h2 className="text-xl font-bold">Décrivez votre projet</h2>
        <p className="text-sm text-blue-100 mt-1">
          Nous étudions votre demande et revenons vers vous rapidement.
        </p>
      </div>

      <div className="p-6 space-y-5">
        {/* Nom */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
            <User className="h-4 w-4 text-slate-400" />
            Votre nom complet *
          </label>
          <input
            type="text"
            required
            value={form.full_name}
            onChange={(e) => update("full_name", e.target.value)}
            placeholder="Ex: Marie Kabongo"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* WhatsApp + Ville */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
              <Phone className="h-4 w-4 text-slate-400" />
              Numéro WhatsApp *
            </label>
            <input
              type="tel"
              required
              value={form.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              placeholder="+243 970 000 000"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              Votre ville *
            </label>
            <select
              required
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type de projet */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
            <Briefcase className="h-4 w-4 text-slate-400" />
            Type de projet
          </label>
          <select
            value={form.project_type}
            onChange={(e) => update("project_type", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">— Choisir —</option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
            <Wallet className="h-4 w-4 text-slate-400" />
            Budget estimé
          </label>
          <select
            value={form.budget}
            onChange={(e) => update("budget", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">— Choisir —</option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
            <FileText className="h-4 w-4 text-slate-400" />
            Décrivez votre projet *
          </label>
          <textarea
            required
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={5}
            placeholder="Ex: Je souhaite importer 50 smartphones de Dubaï vers Bukavu pour les revendre. J'ai besoin d'aide pour le sourcing, le transport et la douane."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-slate-500 mt-1.5">
            Plus votre description est précise, mieux nous pourrons vous aider.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className="w-full gap-2"
        >
          {loading ? (
            "Envoi en cours..."
          ) : (
            <>
              Envoyer mon projet
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-xs text-center text-slate-500">
          🔒 Vos informations sont confidentielles. Aucun engagement.
        </p>
      </div>
    </form>
  );
}