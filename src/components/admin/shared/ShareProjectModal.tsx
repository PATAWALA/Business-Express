// src/components/admin/shared/ShareProjectModal.tsx
"use client";

import { useState } from "react";
import { X, Copy, Check, MessageCircle, Link2, Sparkles } from "lucide-react";
import { Button } from "@/components/admin/ui/Button";
import { useToast } from "@/components/admin/ui/ToastProvider";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ShareProjectModal({ open, onClose }: Props) {
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Partager mon lien</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600">
            Envoyez ce lien à vos prospects. Ils déposent leur projet et apparaissent
            automatiquement dans <strong>Commandes</strong>.
          </p>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-slate-500 shrink-0" />
              <code className="flex-1 text-xs text-slate-700 truncate font-mono">
                {projectUrl}
              </code>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={copyLink}
              variant="outline"
              className="flex-1 gap-2"
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
              <Button
                variant="primary"
                className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 border-0 text-white"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            </a>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-500 bg-blue-50 p-3 rounded-lg">
            <span className="shrink-0">💡</span>
            <p>
              <strong>Astuce :</strong> Mettez ce lien dans la bio de votre compte
              TikTok ou Instagram pour capter des clients 24h/24.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}