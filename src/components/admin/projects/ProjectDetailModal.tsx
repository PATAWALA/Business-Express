// src/components/admin/projects/ProjectDetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  MessageCircle,
  MapPin,
  Calendar,
  Briefcase,
  Wallet,
  FileText,
  Save,
  Loader2,
  Trash2,
  Copy,
  Check,
  ShoppingBag,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/admin-utils";
import { Avatar } from "@/components/admin/ui/Avatar";
import { Button } from "@/components/admin/ui/Button";
import { useToast } from "@/components/admin/ui/ToastProvider";
import type { ProjectRequest, ProjectStatus } from "./ProjectCard";

interface Props {
  project: ProjectRequest | null;
  onClose: () => void;
}

const statusOptions: { key: ProjectStatus; label: string; color: string }[] = [
  { key: "new", label: "🆕 Nouveau", color: "bg-blue-600" },
  { key: "contacted", label: "📞 Contacté", color: "bg-amber-500" },
  { key: "quoted", label: "💰 Devis envoyé", color: "bg-purple-600" },
  { key: "converted", label: "✅ Converti", color: "bg-emerald-600" },
  { key: "archived", label: "📁 Archivé", color: "bg-slate-500" },
];

export function ProjectDetailModal({ project, onClose }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [status, setStatus] = useState<ProjectStatus>("new");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (project) {
      setStatus(project.status);
      setNotes(project.notes ?? "");
      setLinkCopied(false);
    }
  }, [project]);

  if (!project) return null;

  function cleanPhone(phone: string): string {
    return phone.replace(/\D/g, "");
  }

  // URL du lien de commande
  const orderUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/commander`
      : "https://business-express.vercel.app/commander";

  // Message WhatsApp pour envoyer le lien de commande
  const orderWhatsappMessage = `Bonjour ${project.full_name}, ici Business Express.

Votre projet "${project.project_type ?? "import/sourcing"}" a bien été étudié ✅

Pour finaliser votre commande et l'enregistrer officiellement, cliquez sur ce lien sécurisé :

${orderUrl}

Vous pourrez y confirmer :
• L'article et la quantité
• Le prix convenu
• Votre date de livraison souhaitée

Une fois validée, votre commande sera immédiatement prise en charge. 🚀

— Business Express`;

  const orderWhatsappUrl = `https://wa.me/${cleanPhone(project.whatsapp)}?text=${encodeURIComponent(orderWhatsappMessage)}`;

  async function copyOrderLink() {
    try {
      await navigator.clipboard.writeText(orderUrl);
      setLinkCopied(true);
      toast.success("Lien de commande copié ✅");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier. Sélectionnez manuellement.");
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/project-requests/${project!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes: notes || null }),
      });
      if (!res.ok) throw new Error();
      toast.success("Mis à jour ✅");
      onClose();
      router.refresh();
    } catch {
      toast.error("Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        `Supprimer définitivement la demande de ${project!.full_name} ?`
      )
    )
      return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/project-requests/${project!.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Demande supprimée");
      onClose();
      router.refresh();
    } catch {
      toast.error("Erreur");
    } finally {
      setDeleting(false);
    }
  }

  // Vérifie si ce projet est déjà converti ou déjà en devis
  const canSendOrderLink =
    status === "contacted" || status === "quoted" || status === "converted";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Avatar name={project.full_name} size="md" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {project.full_name}
              </h2>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                {project.city} · Reçu le {formatDate(project.created_at)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              title="Supprimer"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Contact WhatsApp */}
          <a
            href={`https://wa.me/${cleanPhone(project.whatsapp)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Contacter sur WhatsApp ({project.whatsapp})
          </a>

          {/* Type + Budget */}
          <div className="grid grid-cols-2 gap-3">
            {project.project_type && (
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center gap-1 text-[10px] uppercase font-semibold text-slate-500 mb-1">
                  <Briefcase className="h-3 w-3" />
                  Type de projet
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {project.project_type}
                </div>
              </div>
            )}
            {project.budget && (
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center gap-1 text-[10px] uppercase font-semibold text-slate-500 mb-1">
                  <Wallet className="h-3 w-3" />
                  Budget
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {project.budget}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-1 text-[10px] uppercase font-semibold text-slate-500 mb-2">
              <FileText className="h-3 w-3" />
              Description du projet
            </div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Statut du suivi
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setStatus(opt.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    status === opt.key
                      ? `${opt.color} text-white shadow-sm`
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ENVOI DU LIEN DE COMMANDE — Le pont projet → commande */}
          {canSendOrderLink ? (
            <div className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50 p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0 shadow-lg shadow-emerald-500/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-emerald-900 text-sm">
                    🚀 Prêt à passer commande
                  </h3>
                  <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                    Le client a validé les détails. Envoyez-lui ce lien pour
                    qu'il enregistre sa commande officielle (elle apparaîtra
                    dans <strong>Commandes</strong>).
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={orderWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Envoyer via WhatsApp
                </a>
                <button
                  onClick={copyOrderLink}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-700 text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                  {linkCopied ? (
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
                </button>
              </div>

              {/* Lien affiché */}
              <div className="mt-3 rounded-lg bg-white/70 border border-emerald-200 px-3 py-2">
                <div className="text-[10px] uppercase font-semibold text-emerald-700 mb-0.5">
                  Lien à partager
                </div>
                <code className="text-xs text-emerald-900 font-mono break-all">
                  {orderUrl}
                </code>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200 text-slate-500 shrink-0">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 text-sm">
                    Lien de commande non disponible
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Passez d'abord le statut à <strong>📞 Contacté</strong> ou{" "}
                    <strong>💰 Devis envoyé</strong> pour débloquer l'envoi du
                    lien de commande.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Guide procédure */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <div className="text-[10px] uppercase font-semibold text-blue-700 mb-2">
              💡 Rappel du parcours
            </div>
            <ol className="text-xs text-blue-900 space-y-1">
              <li>
                1️⃣ <strong>Contacter</strong> le client sur WhatsApp
              </li>
              <li>
                2️⃣ <strong>Envoyer le devis</strong> (prix, délai)
              </li>
              <li>
                3️⃣ <strong>Envoyer le lien</strong> si le client accepte
              </li>
              <li>
                4️⃣ La commande passe en <strong>🟡 Sourcing</strong> dans
                Commandes
              </li>
            </ol>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Notes internes (privées)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Ex: A rappelé le 24/10, intéressé par 20 iPhones, budget confirmé..."
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-5 border-t border-slate-200">
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={handleSave} loading={saving} className="gap-2">
            {!saving && <Save className="h-4 w-4" />}
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}