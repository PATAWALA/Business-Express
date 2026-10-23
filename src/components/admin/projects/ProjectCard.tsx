// src/components/admin/projects/ProjectCard.tsx
"use client";

import { MessageCircle, Calendar, MapPin, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/admin-utils";
import { Avatar } from "@/components/admin/ui/Avatar";
import { Badge } from "@/components/admin/ui/Badge";

export type ProjectStatus = "new" | "contacted" | "quoted" | "converted" | "archived";

export interface ProjectRequest {
  id: string;
  client_id: string | null;
  full_name: string;
  whatsapp: string;
  city: string;
  project_type: string | null;
  budget: string | null;
  description: string;
  status: ProjectStatus;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const statusConfig: Record<
  ProjectStatus,
  { label: string; variant: "info" | "warning" | "purple" | "success" | "default" }
> = {
  new: { label: "🆕 Nouveau", variant: "info" },
  contacted: { label: "📞 Contacté", variant: "warning" },
  quoted: { label: "💰 Devis envoyé", variant: "purple" },
  converted: { label: "✅ Converti", variant: "success" },
  archived: { label: "📁 Archivé", variant: "default" },
};

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function isRecent(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr).getTime() >= Date.now() - 24 * 3600000;
}

interface Props {
  project: ProjectRequest;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: Props) {
  const cfg = statusConfig[project.status];
  const recent = isRecent(project.created_at);

  return (
    <div
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:border-slate-300 cursor-pointer transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar name={project.full_name} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-900 truncate">
                {project.full_name}
              </span>
              {recent && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700">
                  <Sparkles className="h-2 w-2" />
                  24h
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" />
              {project.city}
            </div>
          </div>
        </div>
        <Badge variant={cfg.variant}>{cfg.label}</Badge>
      </div>

      {/* Type + budget */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.project_type && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {project.project_type}
          </span>
        )}
        {project.budget && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            {project.budget}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed">
        {project.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <Calendar className="h-3 w-3" />
          {formatDate(project.created_at)}
        </div>
        <a
          href={`https://wa.me/${cleanPhone(project.whatsapp)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}