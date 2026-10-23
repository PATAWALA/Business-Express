// src/components/admin/projects/ProjectsClient.tsx
"use client";

import { useMemo, useState } from "react";
import { Search, X, Inbox } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PageHelp } from "@/components/admin/ui/PageHelp";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { ProjectCard, type ProjectRequest, type ProjectStatus } from "./ProjectCard";
import { ProjectDetailModal } from "./ProjectDetailModal";

interface Props {
  projects: ProjectRequest[];
}

type FilterKey = "all" | ProjectStatus;

const filters: { key: FilterKey; label: string; color: string }[] = [
  { key: "all", label: "Tous", color: "bg-slate-900 text-white" },
  { key: "new", label: "🆕 Nouveaux", color: "bg-blue-600 text-white" },
  { key: "contacted", label: "📞 Contactés", color: "bg-amber-500 text-white" },
  { key: "quoted", label: "💰 Devis", color: "bg-purple-600 text-white" },
  { key: "converted", label: "✅ Convertis", color: "bg-emerald-600 text-white" },
  { key: "archived", label: "📁 Archivés", color: "bg-slate-500 text-white" },
];

export function ProjectsClient({ projects }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selected, setSelected] = useState<ProjectRequest | null>(null);

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = {
      all: projects.length,
      new: 0,
      contacted: 0,
      quoted: 0,
      converted: 0,
      archived: 0,
    };
    projects.forEach((p) => {
      c[p.status]++;
    });
    return c;
  }, [projects]);

  const filtered = useMemo(() => {
    let list = projects;
    if (filter !== "all") list = list.filter((p) => p.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.full_name.toLowerCase().includes(q) ||
          p.whatsapp.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          (p.project_type ?? "").toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [projects, filter, search]);

  return (
    <div>
      <PageHeader
        title="Demandes de projet"
        subtitle={`${counts.all} demande${counts.all > 1 ? "s" : ""} · ${counts.new} nouvelle${counts.new > 1 ? "s" : ""} à traiter`}
      />

      {/* Encart pédagogique */}
      <div className="mb-4">
        <PageHelp
          title="💡 Comment traiter vos demandes de projet"
          description="Ces demandes viennent de votre lien /projet (partagé sur WhatsApp, TikTok, etc.)"
          steps={[
            {
              label: "Ouvrez une demande",
              description:
                "Cliquez sur une carte pour voir le projet complet (nom, description, budget).",
            },
            {
              label: "Contactez le client",
              description:
                "Cliquez sur 'Contacter sur WhatsApp' pour démarrer la discussion. Négociez les détails et le prix.",
            },
            {
              label: "Mettez à jour le statut",
              description:
                "Changez le statut : 🆕 Nouveau → 📞 Contacté → 💰 Devis envoyé. Vous savez toujours où vous en êtes.",
            },
            {
              label: "Envoyez le lien de commande",
              description:
                "Quand le client accepte, le bouton 'Envoyer via WhatsApp' apparaît. Le client enregistre sa commande, elle apparaît dans /admin/commandes.",
            },
          ]}
          tips={[
            "Une demande = un prospect. Une commande = un client qui a payé.",
            "Partagez votre lien /projet sur TikTok/Instagram dans votre bio pour capter de nouveaux prospects 24h/24.",
            "Les notes internes sont privées (visibles seulement par vous).",
          ]}
        />
      </div>

      {/* Recherche */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, ville, type..."
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => {
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? `${f.color} shadow-sm`
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {f.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/20" : "bg-slate-100 text-slate-500"
                }`}
              >
                {counts[f.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grille */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <EmptyState
            icon={Inbox}
            title={
              search || filter !== "all"
                ? "Aucun résultat"
                : "Aucune demande pour l'instant"
            }
            description={
              search || filter !== "all"
                ? "Essayez d'ajuster votre recherche ou vos filtres."
                : "Partagez votre lien /projet à vos prospects WhatsApp. Leurs demandes apparaîtront ici."
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onClick={() => setSelected(p)}
            />
          ))}
        </div>
      )}

      <ProjectDetailModal
        project={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}