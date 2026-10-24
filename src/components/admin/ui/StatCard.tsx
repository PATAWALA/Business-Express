// src/components/admin/ui/StatCard.tsx
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sparkline } from "./Sparkline";

type Color = "blue" | "green" | "amber" | "red" | "purple" | "slate";

interface Props {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: Color;
  trend?: string;
  trendUp?: boolean;
  sparklineData?: number[];
  variant?: "light" | "dark";
}

const colorMap: Record<Color, { bg: string; icon: string; sparkline: string }> = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", sparkline: "#1e50ff" },
  green: { bg: "bg-emerald-50", icon: "text-emerald-600", sparkline: "#10b981" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", sparkline: "#f59e0b" },
  red: { bg: "bg-red-50", icon: "text-red-600", sparkline: "#ef4444" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", sparkline: "#a855f7" },
  slate: { bg: "bg-slate-100", icon: "text-slate-600", sparkline: "#64748b" },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  color = "blue",
  trend,
  trendUp = true,
  sparklineData,
  variant = "light",
}: Props) {
  const c = colorMap[color];

  if (variant === "dark") {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-5 text-white shadow-sm h-full flex flex-col min-h-[148px]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_white_0%,_transparent_60%)]" />
        <div className="relative flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Icon className="h-4 w-4 text-white" />
            </div>
            {sparklineData && sparklineData.length > 1 && (
              <Sparkline data={sparklineData} color="#ffffff" width={80} height={32} className="opacity-60" />
            )}
          </div>
          <p className="text-xs font-medium text-slate-300 uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
          <div className="mt-auto pt-2 h-5">
            {trend && (
              <p className={cn("text-xs font-medium", trendUp ? "text-emerald-400" : "text-red-400")}>
                {trendUp ? "↗" : "↘"} {trend}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] h-full flex flex-col min-h-[148px]">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", c.bg)}>
          <Icon className={cn("h-4 w-4", c.icon)} />
        </div>
        {sparklineData && sparklineData.length > 1 && (
          <Sparkline data={sparklineData} color={c.sparkline} width={80} height={32} />
        )}
      </div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <div className="mt-auto pt-2 h-5">
        {trend && (
          <p className={cn("text-xs font-medium", trendUp ? "text-emerald-600" : "text-red-600")}>
            {trendUp ? "↗" : "↘"} {trend}
          </p>
        )}
      </div>
    </div>
  );
}