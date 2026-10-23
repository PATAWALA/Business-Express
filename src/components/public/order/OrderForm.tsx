// src/components/public/order/OrderForm.tsx
"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  ShoppingBag,
  Package,
  Wallet,
  Calendar,
  FileText,
  Phone,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/public/ui/Button";

interface SuccessData {
  order_ref: string;
  agent_whatsapp: string;
  client_name: string;
}

export function OrderForm() {
  const [form, setForm] = useState({
    whatsapp: "",
    items_description: "",
    quantity: 1,
    sale_price_fcfa: "",
    expected_delivery: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessData | null>(null);

  function update<K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K]
  ) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      !form.whatsapp.trim() ||
      !form.items_description.trim() ||
      !form.sale_price_fcfa
    ) {
      setError("Merci de remplir tous les champs obligatoires.");
      return;
    }

    const price = parseInt(form.sale_price_fcfa.replace(/\s/g, ""), 10);
    if (!price || price <= 0) {
      setError("Le prix doit être supérieur à 0.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/public/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity) || 1,
          sale_price_fcfa: price,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setSuccess({
        order_ref: data.order_ref,
        agent_whatsapp: data.agent_whatsapp,
        client_name: data.client_name,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Succès
  if (success) {
    const whatsappMessage = `Bonjour, je viens de passer la commande ${success.order_ref} sur le lien Business Express. Merci de me confirmer la réception.`;
    const whatsappLink = `https://wa.me/${success.agent_whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6 animate-slide-up">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3">
          Commande enregistrée ✅
        </h2>
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 mb-6 inline-block">
          <div className="text-xs text-blue-700 uppercase font-semibold mb-1">
            Votre numéro de commande
          </div>
          <div className="text-2xl font-black text-blue-900 font-mono">
            {success.order_ref}
          </div>
        </div>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Merci <strong>{success.client_name}</strong> ! Votre commande est
          enregistrée. Nous vous contactons rapidement pour le suivi.
        </p>

        <div className="space-y-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Confirmer sur WhatsApp
          </a>
          <p className="text-xs text-slate-500">
            Conservez le numéro <strong>{success.order_ref}</strong> pour tout
            suivi.
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
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold mb-3">
          <ShoppingBag className="h-3 w-3" />
          Enregistrement de commande
        </div>
        <h2 className="text-xl font-bold">Finalisez votre commande</h2>
        <p className="text-sm text-blue-100 mt-1">
          Réservé aux clients ayant validé les détails avec Business Express.
        </p>
      </div>

      <div className="p-6 space-y-5">
        {/* WhatsApp */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
            <Phone className="h-4 w-4 text-slate-400" />
            Votre numéro WhatsApp *
          </label>
          <input
            type="tel"
            required
            value={form.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            placeholder="+243 970 000 000"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-500 mt-1.5">
            ⚠️ Utilisez le même numéro que celui validé avec Prince sur WhatsApp.
          </p>
        </div>

        {/* Article */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
            <Package className="h-4 w-4 text-slate-400" />
            Article / Marchandise *
          </label>
          <input
            type="text"
            required
            value={form.items_description}
            onChange={(e) => update("items_description", e.target.value)}
            placeholder="Ex: 10x Samsung Galaxy S24 256GB"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Quantité + Prix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
              <ShoppingBag className="h-4 w-4 text-slate-400" />
              Quantité
            </label>
            <input
              type="number"
              min={1}
              value={form.quantity}
              onChange={(e) => update("quantity", Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
              <Wallet className="h-4 w-4 text-slate-400" />
              Prix convenu (FCFA) *
            </label>
            <input
              type="text"
              required
              value={form.sale_price_fcfa}
              onChange={(e) => update("sale_price_fcfa", e.target.value)}
              placeholder="8500000"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
            />
          </div>
        </div>

        {/* Date livraison */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            Date de livraison souhaitée
          </label>
          <input
            type="date"
            value={form.expected_delivery}
            onChange={(e) => update("expected_delivery", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
            <FileText className="h-4 w-4 text-slate-400" />
            Notes complémentaires
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            placeholder="Ex: Merci de livrer avant Noël. Adresse précise : avenue Patrice Lumumba, Bukavu."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className="w-full gap-2"
        >
          {loading ? (
            "Enregistrement..."
          ) : (
            <>
              Valider ma commande
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-xs text-center text-slate-500">
          🔒 Vos informations sont confidentielles et sécurisées.
        </p>
      </div>
    </form>
  );
}