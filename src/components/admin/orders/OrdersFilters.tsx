// src/components/admin/orders/OrdersFilters.tsx
"use client";

import { Search, X } from "lucide-react";
import type { Order } from "@/lib/order-client";

type FilterKey = "all" | Order["status"];

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  filter: FilterKey;
  onFilterChange: (v: FilterKey) => void;
  counts: Record<string, number>;
}

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "new", label: "🟡 Nouveaux" },
  { key: "quoted", label: "🟣 Devis" },
  { key: "sourcing", label: "Sourcing" },
  { key: "purchased", label: "Acheté" },
  { key: "freight", label: "En fret" },
  { key: "delivered", label: "Livré" },
];

const filterColors: Record<string, string> = {
  all: "bg-slate-900 text-white",
  new: "bg-amber-500 text-white",
  quoted: "bg-purple-600 text-white",
  sourcing: "bg-blue-600 text-white",
  purchased: "bg-indigo-600 text-white",
  freight: "bg-fuchsia-600 text-white",
  delivered: "bg-emerald-600 text-white",
};

export function OrdersFilters({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  counts,
}: Props) {
  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher par réf, client ou article..."
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            aria-label="Effacer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => {
          const isActive = filter === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onFilterChange(opt.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? filterColors[opt.key] + " shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {opt.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/20" : "bg-slate-100 text-slate-500"
                }`}
              >
                {counts[opt.key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}