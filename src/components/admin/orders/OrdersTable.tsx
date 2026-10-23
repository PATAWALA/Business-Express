// src/components/admin/orders/OrdersTable.tsx
"use client";

import { useState } from "react";
import { Order, Client, mockClients } from "@/lib/mockData";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { formatAED, formatFCFA, formatDate } from "@/lib/admin-utils";
import { ChevronDown } from "lucide-react";

const statusFlow: Order["status"][] = [
  "sourcing",
  "purchased",
  "freight",
  "delivered",
];

function getClientName(clientId: string | null): string {
  if (!clientId) return "—";
  const client = mockClients.find((c) => c.id === clientId);
  return client ? client.name : "—";
}

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [openStatusFor, setOpenStatusFor] = useState<string | null>(null);

  function updateStatus(orderId: string, newStatus: Order["status"]) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    setOpenStatusFor(null);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Version desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
              <th className="px-4 py-3">Réf.</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Fournisseur</th>
              <th className="px-4 py-3">Article</th>
              <th className="px-4 py-3 text-right">Achat</th>
              <th className="px-4 py-3 text-right">Marge</th>
              <th className="px-4 py-3">Livraison</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-900">
                  {order.order_ref}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {getClientName(order.client_id)}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {order.supplier_name}
                </td>
                <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">
                  {order.items_description}
                </td>
                <td className="px-4 py-3 text-right text-slate-700">
                  {formatAED(order.purchase_price_aed)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-600">
                  {formatFCFA(order.margin_fcfa)}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {formatDate(order.expected_delivery)}
                </td>
                <td className="px-4 py-3">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenStatusFor(
                          openStatusFor === order.id ? null : order.id
                        )
                      }
                      className="flex items-center gap-1"
                    >
                      <StatusBadge status={order.status} />
                      <ChevronDown className="h-3 w-3 text-slate-400" />
                    </button>
                    {openStatusFor === order.id && (
                      <div className="absolute z-10 top-full mt-1 left-0 bg-white rounded-lg shadow-lg border border-slate-200 min-w-[140px]">
                        {statusFlow.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(order.id, s)}
                            className={`block w-full text-left px-3 py-2 text-xs hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg ${
                              order.status === s ? "font-bold text-blue-600" : ""
                            }`}
                          >
                            {s === "sourcing" && "🟡 Sourcing"}
                            {s === "purchased" && "🔵 Acheté"}
                            {s === "freight" && "🟣 En Fret"}
                            {s === "delivered" && "🟢 Livré"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Version mobile (cards) */}
      <div className="md:hidden divide-y divide-slate-100">
        {orders.map((order) => (
          <div key={order.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-slate-900">
                  {order.order_ref}
                </div>
                <div className="text-xs text-slate-500">
                  {getClientName(order.client_id)}
                </div>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="text-sm text-slate-700">{order.items_description}</div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">
                Achat : {formatAED(order.purchase_price_aed)}
              </span>
              <span className="font-semibold text-green-600">
                Marge : {formatFCFA(order.margin_fcfa)}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 pt-2">
              {statusFlow.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(order.id, s)}
                  className={`text-[10px] px-2 py-1 rounded ${
                    order.status === s
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}