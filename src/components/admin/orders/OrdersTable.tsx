// src/components/admin/orders/OrdersTable.tsx
"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { NewOrderModal } from "./NewOrderModal";
import { OrderDetailModal } from "./OrderDetailModal";
import {
  type Order,
  type Client,
  updateOrderStatus,
} from "@/lib/order-client";
import { formatAED, formatFCFA, formatDate } from "@/lib/admin-utils";

type OrderWithClient = Order & { clients: Client | null };

const statusFlow: Order["status"][] = [
  "sourcing",
  "purchased",
  "freight",
  "delivered",
];

interface Props {
  initialOrders: OrderWithClient[];
}

export function OrdersTable({ initialOrders }: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [openStatusFor, setOpenStatusFor] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<OrderWithClient | null>(null);

  function refresh() {
    // Recharge la page pour avoir les données fraîches
    window.location.reload();
  }

  async function handleStatusChange(orderId: string, newStatus: Order["status"]) {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (e) {
      console.error(e);
      alert("Erreur mise à jour statut");
    }
    setOpenStatusFor(null);
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setNewOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nouvelle commande
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">
            Aucune commande. Cliquez sur "Nouvelle commande" pour commencer.
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    <th className="px-4 py-3">Réf.</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Article</th>
                    <th className="px-4 py-3 text-right">Vente</th>
                    <th className="px-4 py-3 text-right">Marge</th>
                    <th className="px-4 py-3">Livraison</th>
                    <th className="px-4 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setDetailOrder(order)}
                      className="hover:bg-slate-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-bold text-slate-900">
                        {order.order_ref}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {order.clients?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">
                        {order.items_description}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700 font-semibold">
                        {formatFCFA(order.sale_price_fcfa)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">
                        {formatFCFA(order.margin_fcfa)}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {formatDate(order.expected_delivery)}
                      </td>
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                                  onClick={() => handleStatusChange(order.id, s)}
                                  className={`block w-full text-left px-3 py-2 text-xs hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg ${
                                    order.status === s
                                      ? "font-bold text-blue-600"
                                      : ""
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

            {/* Mobile */}
            <div className="md:hidden divide-y divide-slate-100">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setDetailOrder(order)}
                  className="p-4 space-y-2 cursor-pointer hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold text-slate-900">
                        {order.order_ref}
                      </div>
                      <div className="text-xs text-slate-500">
                        {order.clients?.name ?? "—"}
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="text-sm text-slate-700">
                    {order.items_description}
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">
                      Vente : {formatFCFA(order.sale_price_fcfa)}
                    </span>
                    <span className="font-semibold text-green-600">
                      Marge : {formatFCFA(order.margin_fcfa)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <NewOrderModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onCreated={refresh}
      />

      <OrderDetailModal
        order={detailOrder}
        onClose={() => setDetailOrder(null)}
        onSaved={refresh}
      />
    </>
  );
}