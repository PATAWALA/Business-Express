// src/components/admin/ui/KpiCard.tsx
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  trend?: string;
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  yellow: "bg-yellow-50 text-yellow-600",
  red: "bg-red-50 text-red-600",
  purple: "bg-purple-50 text-purple-600",
};

export function KpiCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  trend,
}: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 font-medium mt-1">↑ {trend}</p>
          )}
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorMap[color]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}