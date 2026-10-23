// src/components/admin/finance/StatusPieChart.tsx
"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { Order } from "@/lib/order-client";

interface Props {
  orders: Order[];
}

const COLORS: Record<string, string> = {
  sourcing: "#f59e0b",
  purchased: "#3b82f6",
  freight: "#a855f7",
  delivered: "#10b981",
};

const LABELS: Record<string, string> = {
  sourcing: "Sourcing",
  purchased: "Acheté",
  freight: "En fret",
  delivered: "Livré",
};

export function StatusPieChart({ orders }: Props) {
  const data = ["sourcing", "purchased", "freight", "delivered"]
    .map((status) => ({
      name: LABELS[status],
      value: orders.filter((o) => o.status === status).length,
      color: COLORS[status],
    }))
    .filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex items-center justify-center h-[300px]">
        <p className="text-sm text-slate-500">Aucune commande</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h2 className="text-base font-bold text-slate-900 mb-1">
        Répartition par statut
      </h2>
      <p className="text-xs text-slate-500 mb-3">Sur toutes les commandes</p>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                color: "white",
              }}
              itemStyle={{ color: "white" }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}