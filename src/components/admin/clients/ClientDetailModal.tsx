// src/components/admin/clients/ClientDetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  X,
  MapPin,
  MessageCircle,
  Phone,
  Edit3,
  Package,
  TrendingUp,
  Wallet,
  Clock,
  Plus,
} from "lucide-react";
import { type Client, type Order } from "@/lib/order-client";
import { formatFCFA, formatDate } from "@/lib/admin-utils";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { EditClientForm } from "./EditClientForm";
import { OrderDetailModal } from "@/components/admin/orders/OrderDetailModal";

interface Props {
  clientId: string | null;
  onClose: () => void;
  onRefresh: () => void;
}

export function ClientDetailModal({ clientId, onClose, onRefresh }: Props) {
  const [client, setClient] = useState<Client | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [detailOrder, setDetailOrder] = useState<
    (Order & { clients: Client | null }) | null
  >(null);

  async function load() {
    if (!clientId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Impossible de charger le client");
      const data = await res.json();
      setClient(data.client);
      setOrders(data.orders ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (clientId) {
      load();
      setEditMode(false);
    } else {
      setClient(null);
      setOrders([]);
    }
  }, [clientId]);

  if (!clientId) return null;

  // Calculs des KPIs
  const totalSpent = orders.reduce(
    (s, o) => s + (o.sale_price_fcfa ?? 0),
    0
  );
  const totalMargin = orders.reduce(
    (s, o) => s + (o.margin_fcfa ?? 0),
    0
  );
  const orderCount = orders.length;
  const lastOrderDate =
    orders.length > 0 && orders[0].created_at
      ? orders[0].created_at
      : null;

  const whatsappLink = client?.whatsapp
    ? `https://wa.me/${client.whatsapp.replace(/\D/g, "")}`
    : null;
  const phoneLink = client?.phone ? `tel:${client.phone}` : null;

  const initials = client?.name?.substring(0, 2).toUpperCase() ?? "??";

  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {loading || !client ? (
            <div className="p-10 text-center text-slate-500">Chargement...</div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {client.name}
                      </h2>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          client.type === "client"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {client.type === "client" ? "Client" : "Prospect"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {client.city ?? "—"}
                      {client.country ? `, ${client.country}` : ""}
                      {client.whatsapp && ` · ${client.whatsapp}`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 px-5 py-3 border-b border-slate-200 bg-slate-50">
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                )}
                {phoneLink && (
                  <a
                    href={phoneLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Appeler
                  </a>
                )}
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Modifier
                  </button>
                )}
              </div>

              {/* Body scrollable */}
              <div className="p-5 overflow-y-auto flex-1 space-y-5">
                {editMode ? (
                  <EditClientForm
                    client={client}
                    onSaved={() => {
                      setEditMode(false);
                      load();
                      onRefresh();
                    }}
                    onCancel={() => setEditMode(false)}
                  />
                ) : (
                  <>
                    {/* KPIs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-200 p-3">
                        <div className="flex items-center gap-1 text-[10px] uppercase font-semibold text-slate-500 mb-1">
                          <Wallet className="h-3 w-3" />
                          Total dépensé
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          {formatFCFA(totalSpent)}
                        </div>
                      </div>
                      <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                        <div className="flex items-center gap-1 text-[10px] uppercase font-semibold text-green-700 mb-1">
                          <TrendingUp className="h-3 w-3" />
                          Marge générée
                        </div>
                        <div className="text-lg font-bold text-green-700">
                          {formatFCFA(totalMargin)}
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 p-3">
                        <div className="flex items-center gap-1 text-[10px] uppercase font-semibold text-slate-500 mb-1">
                          <Package className="h-3 w-3" />
                          Commandes
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          {orderCount}
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 p-3">
                        <div className="flex items-center gap-1 text-[10px] uppercase font-semibold text-slate-500 mb-1">
                          <Clock className="h-3 w-3" />
                          Dernier achat
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {lastOrderDate ? formatDate(lastOrderDate) : "—"}
                        </div>
                      </div>
                    </div>

                    {/* Historique commandes */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          📦 Historique des commandes
                        </h3>
                      </div>
                      {orders.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                          Aucune commande pour ce client pour l'instant.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {orders.map((o) => (
                            <button
                              key={o.id}
                              onClick={() =>
                                setDetailOrder({ ...o, clients: client })
                              }
                              className="w-full text-left rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-xs font-bold text-slate-900">
                                  {o.order_ref}
                                </span>
                                <StatusBadge status={o.status} />
                              </div>
                              <div className="text-sm text-slate-700 truncate">
                                {o.items_description}
                              </div>
                              <div className="flex justify-between text-xs mt-1">
                                <span className="text-slate-500">
                                  {formatFCFA(o.sale_price_fcfa)}
                                </span>
                                <span className="font-semibold text-green-600">
                                  Marge : {formatFCFA(o.margin_fcfa)}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {client.notes && (
                      <div className="rounded-xl border border-slate-200 p-4 bg-yellow-50">
                        <div className="text-[10px] uppercase font-semibold text-yellow-700 mb-1">
                          📝 Notes internes
                        </div>
                        <div className="text-sm text-slate-700 whitespace-pre-wrap">
                          {client.notes}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal détail commande (réutilisé) */}
      <OrderDetailModal
        order={detailOrder}
        onClose={() => setDetailOrder(null)}
        onSaved={() => {
          setDetailOrder(null);
          load();
          onRefresh();
        }}
      />
    </>
  );
}