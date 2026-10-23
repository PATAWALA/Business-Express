// src/components/admin/shared/ShareProjectLink.tsx
"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/admin/ui/Button";
import { useToast } from "@/components/admin/ui/ToastProvider";

interface Props {
  variant?: "card" | "compact";
}

export function ShareProjectLink({ variant = "card" }: Props) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const projectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/projet`
      : "https://business-express.vercel.app/projet";

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
    `Bonjour ! Je vous invite à déposer votre projet Business Express ici : ${projectUrl}\n\nDécrivez votre besoin (import, sourcing, etc.). Étude gratuite, réponse sous 48h. 🚀`
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
    <div className="rounded-2xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50/30 p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0 shadow-lg shadow-blue-500/30">
          <Share2 className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-base">
            📤 Partagez votre lien de collecte
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Envoyez ce lien à vos prospects (WhatsApp, TikTok, Instagram...). Ils
            déposent leur projet, et vous les retrouvez dans{" "}
            <strong>Demandes projet</strong> automatiquement.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-blue-200 p-3 mb-3">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-blue-600 shrink-0" />
          <code className="flex-1 text-xs text-slate-700 truncate font-mono">
            {projectUrl}
          </code>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={copyLink}
          variant="outline"
          size="sm"
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
          <Button variant="primary" size="sm" className="w-full gap-2">
            <MessageCircle className="h-4 w-4" />
            Partager sur WhatsApp
          </Button>
        </a>
      </div>

      <div className="mt-3 flex items-start gap-2 text-xs text-slate-600">
        <span className="shrink-0">💡</span>
        <p>
          <strong>Astuce :</strong> mettez ce lien dans votre bio TikTok /
          Instagram pour attirer de nouveaux clients 24h/24.
        </p>
      </div>
    </div>
  );
}