// src/components/admin/dashboard/RevenueChart.tsx
"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Order } from "@/lib/order-client";
import { formatFCFA } from "@/lib/admin-utils";

interface Props {
  orders: Order[];
}

function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return value.toString();
}

export function RevenueChart({ orders }: Props) {
  const monthlyData = (() => {
    const months: {
      label: string;
      key: string;
      revenue: number;
      margin: number;
    }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("fr-FR", { month: "short" });
      months.push({ key, label, revenue: 0, margin: 0 });
    }
    orders.forEach((o) => {
      if (!o.created_at) return;
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const m = months.find((x) => x.key === key);
      if (m) {
        m.revenue += o.sale_price_fcfa ?? 0;
        m.margin += o.margin_fcfa ?? 0;
      }
    });
    return months;
  })();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Performance sur 6 mois
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Revenus et marge par mois
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-slate-600 font-medium">Revenus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Marge</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={monthlyData}
            margin={{ top: 10, right: 0, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e50ff" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#1e50ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMargin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickFormatter={formatCompact}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                padding: "8px 12px",
              }}
              labelStyle={{ color: "#94a3b8", fontSize: "10px" }}
              itemStyle={{ color: "white" }}
              formatter={(value, name) => [
                formatFCFA(Number(value) || 0),
                name === "revenue" ? "Revenus" : "Marge",
              ]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#1e50ff"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="margin"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorMargin)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}