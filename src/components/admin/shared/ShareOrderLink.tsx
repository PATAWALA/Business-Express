// src/components/admin/shared/ShareOrderLink.tsx
"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle, ShoppingBag, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/admin/ui/Button";
import { useToast } from "@/components/admin/ui/ToastProvider";

export function ShareOrderLink() {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const orderUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/commander`
      : "https://business-express-one.vercel.app/commander";

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

  const whatsappText = `Bonjour, je vous confirme que votre commande est prête à être enregistrée. Cliquez ici pour valider vos informations en 30 secondes : ${orderUrl}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-sm">
      {/* En-tête orienté bénéfice */}
      <div className="flex items-start gap-3 mb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0 shadow-lg shadow-blue-500/30">
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-base">
            🚀 Enregistrez la commande à sa place
          </h2>
          <p className="text-sm text-slate-700 mt-1 leading-relaxed">
            Ne perdez plus de temps à saisir les commandes à la main ! Envoyez ce lien à un client 
            qui a validé sur WhatsApp. Il remplit <strong>lui-même</strong> ses informations, 
            et la commande apparaît <strong>automatiquement</strong> dans votre tableau.
          </p>
        </div>
      </div>

      {/* Les 3 étapes pour Prince */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="flex items-start gap-2 bg-white/60 p-3 rounded-lg border border-blue-100">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0">1</span>
          <p className="text-xs text-slate-700"><strong>Discutez</strong> sur WhatsApp</p>
        </div>
        <div className="flex items-start gap-2 bg-white/60 p-3 rounded-lg border border-blue-100">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0">2</span>
          <p className="text-xs text-slate-700"><strong>Envoyez</strong> ce lien</p>
        </div>
        <div className="flex items-start gap-2 bg-white/60 p-3 rounded-lg border border-blue-100">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0">3</span>
          <p className="text-xs text-slate-700"><strong>C'est enregistré</strong> !</p>
        </div>
      </div>

      {/* Lien */}
      <div className="rounded-xl bg-white border border-blue-200 p-3 mb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-blue-600 shrink-0" />
          <code className="flex-1 text-xs text-slate-700 truncate font-mono">
            {orderUrl}
          </code>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <Button onClick={copyLink} variant="outline" className="flex-1 gap-2 bg-white">
          {copied ? (
            <><Check className="h-4 w-4 text-emerald-600" /> Lien copié !</>
          ) : (
            <><Copy className="h-4 w-4" /> Copier le lien</>
          )}
        </Button>
        <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="primary" className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 border-0 text-white">
            <MessageCircle className="h-4 w-4" /> Envoyer sur WhatsApp
          </Button>
        </a>
      </div>

      {/* Note rassurante */}
      <div className="flex items-start gap-2 text-xs text-slate-600 bg-white/50 p-3 rounded-lg">
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
        <p>
          <strong>100% automatique :</strong> Dès que votre client valide, la commande est
          créée avec son nom, son numéro et ses détails. Vous n'avez <strong>rien à saisir</strong>.
        </p>
      </div>
    </div>
  );
}