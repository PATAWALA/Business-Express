

// src/components/admin/shared/ShareOrderLink.tsx
"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle, Lock, ShoppingBag, Link2 } from "lucide-react";
import { Button } from "@/components/admin/ui/Button";
import { useToast } from "@/components/admin/ui/ToastProvider";

export function ShareOrderLink() {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const orderUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/commander`
      : "https://business-express.vercel.app/commander";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(orderUrl);
      setCopied(true);
      toast.success("Lien de commande copié ✅");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier");
    }
  }

  const whatsappText = `Bonjour, veuillez enregistrer votre commande validée en cliquant sur ce lien : ${orderUrl}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shrink-0">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">Lien d'enregistrement de commande</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Envoyez ce lien uniquement aux clients qui ont validé les détails avec vous.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 mb-4 flex items-center gap-2">
        <ShoppingBag className="h-4 w-4 text-slate-500 shrink-0" />
        <code className="flex-1 text-xs text-slate-700 truncate font-mono">
          {orderUrl}
        </code>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Button onClick={copyLink} variant="outline" className="flex-1 gap-2">
          {copied ? (
            <><Check className="h-4 w-4 text-emerald-600" /> Copié !</>
          ) : (
            <><Copy className="h-4 w-4" /> Copier le lien</>
          )}
        </Button>
        <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="primary" className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 border-0 text-white">
            <MessageCircle className="h-4 w-4" /> Envoyer via WhatsApp
          </Button>
        </a>
      </div>

      <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
        <span className="shrink-0">⚠️</span>
        <p>
          <strong>Rappel :</strong> Le client doit s'enregistrer avec le même numéro WhatsApp qu'il a utilisé pour vous contacter.
        </p>
      </div>
    </div>
  );
}