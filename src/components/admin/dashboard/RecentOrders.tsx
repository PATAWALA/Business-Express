// src/components/admin/dashboard/RecentOrders.tsx
import { Order } from "@/lib/mockData";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { formatFCFA } from "@/lib/admin-utils";

export function RecentOrders({ orders }: { orders: Order[] }) {
  const recent = [...orders]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4">
        📦 Dernières commandes
      </h2>
      <div className="space-y-3">
        {recent.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50"
          >
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900">
                {order.order_ref}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {order.items_description}
              </div>
            </div>
            <div className="text-right shrink-0 ml-3">
              <StatusBadge status={order.status} />
              <div className="text-xs font-semibold text-green-600 mt-1">
                {formatFCFA(order.margin_fcfa)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}