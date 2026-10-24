// src/components/admin/orders/OrderDetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  X,
  Loader2,
  Save,
  MessageCircle,
  MapPin,
  TrendingUp,
  Trash2,
  FileText,
  Send,
} from "lucide-react";
import { type Order, type Client, updateOrder } from "@/lib/order-client";
import { formatAED, formatFCFA, formatDate } from "@/lib/admin-utils";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { computeMarginFcfa } from "@/lib/order-utils";
import { useToast } from "@/components/admin/ui/ToastProvider";

interface Props {
  order: (Order & { clients: Client | null }) | null;
  onClose: () => void;
  onSaved: () => void;
}

export function OrderDetailModal({ order, onClose, onSaved }: Props) {
  const toast = useToast();
  const [editMode, setEditMode] = useState(false);
  const [purchaseAed, setPurchaseAed] = useState("");
  const [transportAed, setTransportAed] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierCity, setSupplierCity] = useState("");
  const [saleFcfa, setSaleFcfa] = useState("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (order) {
      setPurchaseAed(order.purchase_price_aed?.toString() ?? "");
      setTransportAed(order.transport_cost_aed?.toString() ?? "");
      setSupplierName(order.supplier_name ?? "");
      setSupplierCity(order.supplier_city ?? "");
      setSaleFcfa(order.sale_price_fcfa?.toString() ?? "");
      setStatus(order.status);
      setEditMode(false);
      setError(null);
    }
  }, [order]);

  if (!order) return null;
  const currentOrder = order;
  const isNewRequest = currentOrder.status === "new";

  const liveMargin = computeMarginFcfa(
    purchaseAed ? parseFloat(purchaseAed) : 0,
    transportAed ? parseFloat(transportAed) : 0,
    saleFcfa ? parseInt(saleFcfa) : 0,
    currentOrder.exchange_rate_aed_to_fcfa
  );

  async function handleSave(newStatus?: string) {
    const targetStatus = newStatus || status;
    if (targetStatus !== "new" && !saleFcfa) {
      toast.error("Veuillez saisir un prix de vente avant de valider.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await updateOrder(currentOrder.id, {
        supplier_name: supplierName || null,
        supplier_city: supplierCity || null,
        purchase_price_aed: purchaseAed ? parseFloat(purchaseAed) : 0,
        transport_cost_aed: transportAed ? parseFloat(transportAed) : 0,
        sale_price_fcfa: saleFcfa ? parseInt(saleFcfa) : null,
        status: targetStatus,
      });
      toast.success("Commande mise à jour ✅");
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (currentOrder.status === "delivered") {
      alert("Impossible de supprimer une commande livrée.");
      return;
    }
    if (!confirm(`Supprimer définitivement ${currentOrder.order_ref} ?`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/orders/${currentOrder.id}/delete`, { method: "DELETE" });
      toast.success("Commande supprimée");
      onSaved();
      onClose();
    } catch {
      toast.error("Erreur");
    } finally {
      setDeleting(false);
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
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {isNewRequest && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-1 text-xs uppercase font-semibold text-blue-700 mb-1">
                <FileText className="h-3.5 w-3.5" /> Demande du client via le
                site
              </div>
              <p className="text-sm text-blue-900 whitespace-pre-wrap">
                {currentOrder.items_description}
              </p>
              {currentOrder.project_type && (
                <p className="text-xs text-blue-700 mt-2 font-medium">
                  Catégorie : {currentOrder.project_type}
                </p>
              )}
              {currentOrder.source_detail && (
                <p className="text-xs text-blue-700 mt-1">
                  {currentOrder.source_detail}
                </p>
              )}
            </div>
          )}

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
                  className="mt-3 inline-flex items-center gap-2 bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600"
                >
                  <MessageCircle className="h-4 w-4" /> Contacter sur WhatsApp
                </a>
              )}
            </div>
          )}

          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase font-semibold text-slate-500">
                Détails Financiers
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
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Prix de vente (FCFA) *
                  </label>
                  <input
                    type="number"
                    value={saleFcfa}
                    onChange={(e) => setSaleFcfa(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-blue-600"
                    placeholder="Ex: 18500000"
                  />
                </div>
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
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Fournisseur"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                  <input
                    type="text"
                    value={supplierCity}
                    onChange={(e) => setSupplierCity(e.target.value)}
                    placeholder="Ville fournisseur"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                {error && <div className="text-xs text-red-600">{error}</div>}
                <button
                  onClick={() => handleSave()}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
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
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Prix de vente</span>
                  <span className="font-bold text-slate-900">
                    {currentOrder.sale_price_fcfa
                      ? formatFCFA(currentOrder.sale_price_fcfa)
                      : "À définir"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Prix d'achat</span>
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
                <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
                  <span className="text-emerald-700 font-semibold">
                    Marge nette
                  </span>
                  <span className="font-bold text-emerald-600">
                    {formatFCFA(currentOrder.margin_fcfa)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {isNewRequest && !editMode && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h4 className="text-sm font-bold text-amber-900 mb-1">
                Action requise
              </h4>
              <p className="text-xs text-amber-700 mb-3">
                Contactez le client, négociez le prix, puis indiquez le montant
                pour avancer.
              </p>
              <button
                onClick={() => setEditMode(true)}
                className="w-full bg-amber-500 text-white font-semibold py-2 rounded-lg text-sm flex justify-center items-center gap-2"
              >
                <Send className="h-4 w-4" /> Définir le prix et envoyer le devis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}