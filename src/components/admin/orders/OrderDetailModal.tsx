// src/components/admin/orders/OrderDetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  X,
  Loader2,
  Save,
  MessageCircle,
  MapPin,
  Package,
  TrendingUp,
} from "lucide-react";
import { type Order, type Client, updateOrder } from "@/lib/order-client";
import { formatAED, formatFCFA, formatDate } from "@/lib/admin-utils";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { computeMarginFcfa } from "@/lib/order-utils";

interface Props {
  order: (Order & { clients: Client | null }) | null;
  onClose: () => void;
  onSaved: () => void;
}

export function OrderDetailModal({ order, onClose, onSaved }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [purchaseAed, setPurchaseAed] = useState("");
  const [transportAed, setTransportAed] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierCity, setSupplierCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (order) {
      setPurchaseAed(order.purchase_price_aed?.toString() ?? "");
      setTransportAed(order.transport_cost_aed?.toString() ?? "");
      setSupplierName(order.supplier_name ?? "");
      setSupplierCity(order.supplier_city ?? "");
      setEditMode(false);
      setError(null);
    }
  }, [order]);

  // ✅ CORRECTION : capture locale après le null check
  if (!order) return null;
  const currentOrder = order;

  const liveMargin = computeMarginFcfa(
    purchaseAed ? parseFloat(purchaseAed) : 0,
    transportAed ? parseFloat(transportAed) : 0,
    currentOrder.sale_price_fcfa ?? 0,
    currentOrder.exchange_rate_aed_to_fcfa
  );

  async function handleSave() {
    setLoading(true);
    setError(null);
    try {
      await updateOrder(currentOrder.id, {
        supplier_name: supplierName || null,
        supplier_city: supplierCity || null,
        purchase_price_aed: purchaseAed ? parseFloat(purchaseAed) : 0,
        transport_cost_aed: transportAed ? parseFloat(transportAed) : 0,
      });
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const whatsappLink = currentOrder.clients?.whatsapp
    ? `https://wa.me/${currentOrder.clients.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 font-mono">
                {currentOrder.order_ref}
              </h2>
              <StatusBadge status={currentOrder.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Créée le {formatDate(currentOrder.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Client */}
          {currentOrder.clients && (
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-xs uppercase font-semibold text-slate-500 mb-2">
                Client
              </div>
              <div className="font-bold text-slate-900">
                {currentOrder.clients.name}
              </div>
              <div className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {currentOrder.clients.city}
              </div>
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contacter sur WhatsApp
                </a>
              )}
            </div>
          )}

          {/* Marchandise */}
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-xs uppercase font-semibold text-slate-500 mb-2 flex items-center gap-1">
              <Package className="h-3.5 w-3.5" />
              Marchandise
            </div>
            <div className="font-semibold text-slate-900">
              {currentOrder.items_description}
            </div>
            <div className="text-sm text-slate-600">
              Quantité : {currentOrder.quantity}
            </div>
          </div>

          {/* Fournisseur + prix */}
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase font-semibold text-slate-500">
                Fournisseur & Coûts
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                {editMode ? "Annuler" : "Modifier"}
              </button>
            </div>

            {editMode ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Nom fournisseur"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
                <input
                  type="text"
                  value={supplierCity}
                  onChange={(e) => setSupplierCity(e.target.value)}
                  placeholder="Ville fournisseur"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">
                      Prix achat (AED)
                    </label>
                    <input
                      type="number"
                      value={purchaseAed}
                      onChange={(e) => setPurchaseAed(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">
                      Transport (AED)
                    </label>
                    <input
                      type="number"
                      value={transportAed}
                      onChange={(e) => setTransportAed(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-2 text-xs text-red-700">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Enregistrer
                </button>
              </div>
            ) : (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Fournisseur</span>
                  <span className="font-semibold">
                    {currentOrder.supplier_name || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ville</span>
                  <span className="font-semibold">
                    {currentOrder.supplier_city || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Prix achat</span>
                  <span className="font-semibold">
                    {formatAED(currentOrder.purchase_price_aed)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transport</span>
                  <span className="font-semibold">
                    {formatAED(currentOrder.transport_cost_aed)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Finance */}
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="text-xs uppercase font-semibold text-green-700 mb-2 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Finances
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-green-800">Prix de vente</span>
              <span className="font-bold text-green-900">
                {formatFCFA(currentOrder.sale_price_fcfa)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-800">Marge nette</span>
              <span className="font-bold text-green-900">
                {formatFCFA(editMode ? liveMargin : currentOrder.margin_fcfa)}
              </span>
            </div>
            <div className="text-[10px] text-green-600 mt-2">
              Taux : 1 AED = {currentOrder.exchange_rate_aed_to_fcfa} FCFA
            </div>
          </div>

          {/* Livraison */}
          {currentOrder.expected_delivery && (
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-xs uppercase font-semibold text-slate-500 mb-1">
                Livraison prévue
              </div>
              <div className="font-semibold text-slate-900">
                {formatDate(currentOrder.expected_delivery)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}