// src/components/admin/orders/OrderDetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  X, Loader2, Save, MessageCircle, MapPin, TrendingUp, Trash2, FileText, Send, CheckCircle2, DollarSign, Zap
} from "lucide-react";
import { type Order, type Client, updateOrder } from "@/lib/order-client";
import { formatAED, formatFCFA, formatDate } from "@/lib/admin-utils";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { useToast } from "@/components/admin/ui/ToastProvider";

interface Props {
  order: (Order & { clients: Client | null }) | null;
  onClose: () => void;
  onSaved: () => void;
  usdRate: number; // Le taux USD -> FCFA (ex: 2800)
}

export function OrderDetailModal({ order, onClose, onSaved, usdRate = 2800 }: Props) {
  const toast = useToast();
  const [editMode, setEditMode] = useState(false);
  
  // Champs financiers
  const [purchaseAed, setPurchaseAed] = useState("");
  const [transportAed, setTransportAed] = useState("");
  const [transferFeeUsd, setTransferFeeUsd] = useState("");
  const [serviceFeeFcfa, setServiceFeeFcfa] = useState("");
  const [status, setStatus] = useState<string>("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (order) {
      setPurchaseAed(order.purchase_price_aed?.toString() ?? "");
      setTransportAed(order.transport_cost_aed?.toString() ?? "");
      setTransferFeeUsd(order.transfer_fee_usd?.toString() ?? "0");
      setServiceFeeFcfa(order.margin_fcfa?.toString() ?? "");
      setStatus(order.status);
      setEditMode(false);
      setError(null);
    }
  }, [order]);

  if (!order) return null;
  const currentOrder = order;
  const isNewRequest = currentOrder.status === "new";

  // Calculs automatiques
  const rateAed = currentOrder.exchange_rate_aed_to_fcfa || 762;
  const costAed = (parseFloat(purchaseAed) || 0) + (parseFloat(transportAed) || 0);
  const costFcfa = costAed * rateAed;
  const transferUsd = parseFloat(transferFeeUsd) || 0;
  const transferFcfa = transferUsd * usdRate;
  const serviceFee = parseFloat(serviceFeeFcfa) || 0;
  
  // Total en FCFA et conversion en USD
  const totalSaleFcfa = costFcfa + transferFcfa + serviceFee;
  const totalSaleUsd = Math.round(totalSaleFcfa / usdRate);

  async function handleSave(newStatus?: string) {
    const targetStatus = newStatus || status;
    if (targetStatus !== "new" && totalSaleFcfa <= 0) {
      toast.error("Le prix de vente final doit être supérieur à 0.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await updateOrder(currentOrder.id, {
        purchase_price_aed: purchaseAed ? parseFloat(purchaseAed) : 0,
        transport_cost_aed: transportAed ? parseFloat(transportAed) : 0,
        transfer_fee_usd: transferUsd,
        sale_price_fcfa: totalSaleFcfa,
        margin_fcfa: serviceFee,
        status: targetStatus,
      });
      toast.success("Devis enregistré ✅");
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

  // Le message WhatsApp (en Dollars comme demandé)
  const generateWhatsAppMessage = () => {
    const clientName = currentOrder.clients?.name?.split(" ")[0] || "cher client";
    
    return encodeURIComponent(
      `Bonjour ${clientName},\n\nVoici votre devis pour : *${currentOrder.items_description}*\n\n💰 Montant total : *${totalSaleUsd.toLocaleString("fr-FR")} $* USD\n\nCe prix inclut :\n- L'achat de la marchandise à Dubaï\n- Le transport et la logistique\n- Les frais de transfert\n- Nos frais de service\n\n📦 Réf : ${currentOrder.order_ref}\n\nSouhaitez-vous valider cette commande ?`
    );
  };

  const whatsappLink = currentOrder.clients?.whatsapp
    ? `https://wa.me/${currentOrder.clients.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 font-mono">{currentOrder.order_ref}</h2>
              <StatusBadge status={currentOrder.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">Créée le {formatDate(currentOrder.created_at)}</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          
          {isNewRequest && !editMode && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-1 text-xs uppercase font-bold text-red-700 mb-2">
                <FileText className="h-4 w-4" /> Demande initiale
              </div>
              <p className="text-sm text-red-900 font-medium whitespace-pre-wrap">{currentOrder.items_description}</p>
            </div>
          )}

          {/* Finances & Devis */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
              <div className="text-sm font-bold text-slate-900">Calcul du Devis (en Dollars)</div>
              <button onClick={() => setEditMode(!editMode)} className="text-xs font-semibold text-blue-600 hover:underline">
                {editMode ? "Annuler" : "Modifier les prix"}
              </button>
            </div>

            {editMode ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Achat fournisseur (AED)</label>
                    <input type="number" value={purchaseAed} onChange={(e) => setPurchaseAed(e.target.value)} placeholder="Ex: 5000" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Transport (AED)</label>
                    <input type="number" value={transportAed} onChange={(e) => setTransportAed(e.target.value)} placeholder="Ex: 500" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Frais transfert ($)</label>
                    <input type="number" value={transferFeeUsd} onChange={(e) => setTransferFeeUsd(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-emerald-600 mb-1 block">Frais de service (Bénéfice en FCFA)</label>
                    <input type="number" value={serviceFeeFcfa} onChange={(e) => setServiceFeeFcfa(e.target.value)} placeholder="Ex: 2000000" className="w-full px-3 py-2 rounded-lg border border-emerald-300 text-sm font-bold text-emerald-700" />
                  </div>
                </div>
                {error && <div className="text-xs text-red-600">{error}</div>}
                <button onClick={() => handleSave("quoted")} disabled={loading} className="w-full flex justify-center items-center gap-2 px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Calculer et passer en "Devis envoyé"
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Coût Achat + Transport</span>
                  <span className="font-semibold">{formatFCFA(costFcfa)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Frais de transfert</span>
                  <span className="font-semibold">{transferUsd} $</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Vos frais de service (Marge)</span>
                  <span>{formatFCFA(serviceFee)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                  <span className="font-bold text-slate-900">Total Client Final</span>
                  <div className="text-right">
                    <div className="font-black text-blue-600 text-xl">{totalSaleUsd.toLocaleString("fr-FR")} $</div>
                    <div className="text-[10px] text-slate-400">≈ {formatFCFA(totalSaleFcfa)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action WhatsApp */}
          {!editMode && totalSaleUsd > 0 && whatsappLink && (
             <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
               <h4 className="text-sm font-bold text-emerald-900 mb-1">Devis prêt !</h4>
               <p className="text-xs text-emerald-700 mb-3">Envoyez le récapitulatif et le prix en Dollars au client sur WhatsApp.</p>
               <a href={`${whatsappLink}?text=${generateWhatsAppMessage()}`} target="_blank" rel="noopener noreferrer" className="w-full flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg text-sm transition-colors shadow-md shadow-emerald-500/20">
                 <Send className="h-4 w-4" /> Envoyer le devis (en $) sur WhatsApp
               </a>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}