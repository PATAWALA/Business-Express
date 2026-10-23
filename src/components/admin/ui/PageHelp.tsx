// src/components/admin/ui/PageHelp.tsx
"use client";

import { useState } from "react";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { HelpSection } from "./HelpSection";
import type { LucideIcon } from "lucide-react";

interface PageHelpProps {
  title: string;
  description?: string;
  steps: {
    icon?: LucideIcon;
    label: string;
    description: string;
  }[];
  tips?: string[];
  defaultOpen?: boolean;
}

export function PageHelp({
  title,
  description,
  steps,
  tips,
  defaultOpen = false,
}: PageHelpProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50/50 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-amber-100/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-white shrink-0">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-amber-900">{title}</div>
            {description && (
              <div className="text-xs text-amber-700 mt-0.5">
                {description}
              </div>
            )}
          </div>
        </div>
        <div className="shrink-0 ml-3 flex items-center gap-2">
          <span className="hidden sm:inline text-xs font-medium text-amber-700">
            {open ? "Masquer" : "Afficher l'aide"}
          </span>
          {open ? (
            <ChevronUp className="h-5 w-5 text-amber-700" />
          ) : (
            <ChevronDown className="h-5 w-5 text-amber-700" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4">
          <HelpSection steps={steps} tips={tips} />
        </div>
      )}
    </div>
  );
}