// src/components/admin/ui/HelpSection.tsx
import type { LucideIcon } from "lucide-react";

interface HelpStep {
  icon?: LucideIcon;
  label: string;
  description: string;
}

interface HelpSectionProps {
  steps: HelpStep[];
  tips?: string[];
}

export function HelpSection({ steps, tips }: HelpSectionProps) {
  return (
    <div className="space-y-3">
      {/* Étapes */}
      <div className="space-y-2.5">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl bg-white/70 backdrop-blur-sm p-3 border border-amber-200/50"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-white text-xs font-bold">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900">
                {step.label}
              </div>
              <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      {tips && tips.length > 0 && (
        <div className="rounded-lg bg-white/60 border border-amber-200/50 p-3">
          <div className="text-[10px] uppercase font-bold text-amber-700 mb-1.5">
            💡 Bon à savoir
          </div>
          <ul className="space-y-1">
            {tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-1.5 text-xs text-slate-700"
              >
                <span className="shrink-0 text-amber-600">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}