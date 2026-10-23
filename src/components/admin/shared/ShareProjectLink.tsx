// src/components/admin/shared/ShareProjectLink.tsx
"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle, Link2, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/admin/ui/Button";
import { useToast } from "@/components/admin/ui/ToastProvider";

export function ShareProjectLink({ variant = "card" }: { variant?: "card" | "compact" }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const projectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/projet`
      : "https://business-express-one.vercel.app/projet";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(projectUrl);
      setCopied(true);
      toast.success("Lien copié ✅");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier");
    }
  }

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Bonjour ! Vous avez un projet d'import/export avec Dubaï ? Remplissez ce formulaire en 30 secondes, nous étudierons votre demande gratuitement : ${projectUrl}`
  )}`;

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
        <Link2 className="h-4 w-4 text-blue-600 shrink-0" />
        <code className="flex-1 text-xs text-blue-800 truncate">
          {projectUrl}
        </code>
        <button
          onClick={copyLink}
          className="shrink-0 p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
          title="Copier"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-blue-600" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-3 mb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shrink-0">
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-base">
            🎯 Attirez de nouveaux clients 24h/24
          </h2>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Partagez ce lien sur votre WhatsApp, TikTok ou Instagram. Vos futurs clients 
            y décrivent leur projet. Vous les retrouvez directement dans <strong>Demandes projet</strong>, 
            sans avoir à les chercher.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 mb-3">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-slate-500 shrink-0" />
          <code className="flex-1 text-xs text-slate-700 truncate font-mono">
            {projectUrl}
          </code>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Button
          onClick={copyLink}
          variant="outline"
          className="flex-1 gap-2 bg-white"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              Copié !
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copier le lien
            </>
          )}
        </Button>
        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="primary" className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 border-0 text-white">
            <MessageCircle className="h-4 w-4" />
            Partager sur WhatsApp
          </Button>
        </a>
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">
        <Sparkles className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
        <p>
          <strong>Astuce Pro :</strong> Mettez ce lien dans la bio de votre compte TikTok 
          ou Instagram. Les clients peuvent déposer leur projet même quand vous dormez !
        </p>
      </div>
    </div>
  );
}