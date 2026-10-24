// src/components/admin/shared/ShareProjectModal.tsx
"use client";

import { useState } from "react";
import { X, Copy, Check, Link2, Sparkles } from "lucide-react";
import { FaWhatsapp, FaTiktok, FaInstagram } from "react-icons/fa";
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

  const message = encodeURIComponent(
    `Vous avez un projet d'import/export avec Dubaï ? Décrivez-le ici, nous étudions votre demande gratuitement : ${projectUrl}`
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Partager mon lien</h2>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <p className="text-sm text-slate-600">
            Envoyez ce lien à vos prospects pour qu'ils déposent leur projet. Ils apparaîtront automatiquement dans vos <strong>Commandes</strong>.
          </p>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-slate-500 shrink-0" />
              <code className="flex-1 text-xs text-slate-700 truncate font-mono">{projectUrl}</code>
            </div>
          </div>

          {/* Boutons de partage direct avec les icônes FontAwesome */}
          <div className="grid grid-cols-3 gap-2">
            <a href={`https://wa.me/?text=${message}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-100">
              <FaWhatsapp className="h-5 w-5" />
              <span className="text-[10px] font-bold">WhatsApp</span>
            </a>
            <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors">
              <FaTiktok className="h-5 w-5" />
              <span className="text-[10px] font-bold">TikTok</span>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors border border-pink-100">
              <FaInstagram className="h-5 w-5" />
              <span className="text-[10px] font-bold">Instagram</span>
            </a>
          </div>

          <Button onClick={copyLink} variant="outline" className="w-full gap-2">
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            {copied ? "Lien copié !" : "Copier le lien"}
          </Button>

          <div className="flex items-start gap-2 text-xs text-slate-500 bg-blue-50 p-3 rounded-lg">
            <span className="shrink-0">💡</span>
            <p><strong>Astuce :</strong> Mettez ce lien dans votre bio TikTok ou en légende de vos vidéos. Sur Instagram, ajoutez-le dans votre lien en bio ou en story.</p>
          </div>
        </div>
      </div>
    </div>
  );
}