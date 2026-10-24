// src/components/admin/orders/OrderDetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  X, Loader2, Save, MessageCircle, MapPin, Trash2, FileText, Send, Calculator, Zap
} from "lucide-react";
import { type Order, type Client, updateOrder } from "@/lib/order-client";
import { formatFCFA, formatDate } from "@/lib/admin-utils";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { useToast } from "@/components/admin/ui/ToastProvider";
import { useRouter } from "next/navigation";

interface Props {
  order: (Order & { clients: Client | null }) | null;
  onClose: () => void;
  onSaved: () => void;
  usdRate: number;
}

export function OrderDetailModal({ order, onClose, onSaved, usdRate = 2800 }: Props) {
  const toast = useToast();
  const router = useRouter();
  
  // États locaux
  const [purchaseAed, setPurchaseAed] = useState("");
  const [transportAed, setTransportAed] = useState("");
  const [transferFeeUsd, setTransferFeeUsd] = useState("");
  const [serviceFeeFcfa, setServiceFeeFcfa] = useState("");
  
  // État pour gérer l'affichage du bouton WhatsApp SANS fermer la fiche
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentTotalUsd, setCurrentTotalUsd] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (order) {
      setPurchaseAed(order.purchase_price_aed?.toString() ?? "");
      setTransportAed(order.transport_cost_aed?.toString() ?? "");
      setTransferFeeUsd(order.transfer_fee_usd?.toString() ?? "");
      setServiceFeeFcfa(order.margin_fcfa?.toString() ?? "");
      setCurrentStatus(order.status);
      setCurrentTotalUsd(Math.round((order.sale_price_fcfa ?? 0) / usdRate));
      setError(null);
    }
  }, [order, usdRate]);

  if (!order) return null;
  const currentOrder = order;
  const isNewRequest = currentOrder.status === "new";

  // --- CALCULS EN DIRECT ---
  const rateAed = currentOrder.exchange_rate_aed_to_fcfa || 762;
  const costAed = (parseFloat(purchaseAed) || 0) + (parseFloat(transportAed) || 0);
  const costFcfa = costAed * rateAed;
  
  const transferUsd = parseFloat(transferFeeUsd) || 0;
  const transferFcfa = transferUsd * usdRate;
  
  const serviceFee = parseFloat(serviceFeeFcfa) || 0;
  
  const liveTotalFcfa = costFcfa + transferFcfa + serviceFee;
  const liveTotalUsd = Math.round(liveTotalFcfa / usdRate);

  // --- ENREGISTREMENT DU DEVIS ---
  async function handleSave() {
    setLoading(true);
    setError(null);
    try {
      await updateOrder(currentOrder.id, {
        purchase_price_aed: parseFloat(purchaseAed) || 0,
        transport_cost_aed: parseFloat(transportAed) || 0,
        transfer_fee_usd: transferUsd,
        sale_price_fcfa: liveTotalFcfa,
        margin_fcfa: serviceFee,
        status: currentStatus === "new" ? "quoted" : currentStatus, // Passe en "Devis envoyé" si c'était nouveau
      });
      
      // Mise à jour de l'interface locale SANS fermer
      setCurrentStatus(currentStatus === "new" ? "quoted" : currentStatus);
      setCurrentTotalUsd(liveTotalUsd);
      
      toast.success("Devis calculé et enregistré ✅");
      router.refresh(); // Rafraîchit les données derrière
      onSaved(); // Préviens la page parente
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

  // --- MESSAGE WHATSAPP ---
  const generateWhatsAppMessage = () => {
    const clientName = currentOrder.clients?.name?.split(" ")[0] || "cher client";
    return encodeURIComponent(
      `Bonjour ${clientName},\n\nVoici votre devis pour : *${currentOrder.items_description}*\n\n💰 Montant total : *${currentTotalUsd.toLocaleString("fr-FR")} $* USD\n\nCe prix inclut :\n- L'achat de la marchandise à Dubaï\n- Le transport et la logistique\n- Les frais de transfert\n- Nos frais de service\n\n📦 Réf : ${currentOrder.order_ref}\n\nSouhaitez-vous valider cette commande ?`
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
              <StatusBadge status={currentStatus} />
            </div>
            <p className="text-xs text-slate-500 mt-1">Créée le {formatDate(currentOrder.created_at)}</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleDelete} disabled={deleting} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </button>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"><X className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          
          {/* Demande client */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-slate-500" />
              <span className="text-xs uppercase font-bold text-slate-500">Demande du client</span>
            </div>
            <p className="text-sm text-slate-900 font-medium whitespace-pre-wrap">{currentOrder.items_description}</p>
            {currentOrder.clients && (
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{currentOrder.clients.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> {currentOrder.clients.city}</div>
                </div>
              </div>
            )}
          </div>

          {/* Calculateur de Devis */}
          <div className="rounded-xl border-2 border-blue-100 p-4 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Calcul du Devis</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Prix d'achat (AED)</label>
                <input type="number" value={purchaseAed} onChange={(e) => setPurchaseAed(e.target.value)} placeholder="Ex: 5000" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Transport (AED)</label>
                <input type="number" value={transportAed} onChange={(e) => setTransportAed(e.target.value)} placeholder="Ex: 500" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Frais Transfert (USD)</label>
                <input type="number" value={transferFeeUsd} onChange={(e) => setTransferFeeUsd(e.target.value)} placeholder="Ex: 50" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-600 mb-1 block">Frais de Service (FCFA)</label>
                <input type="number" value={serviceFeeFcfa} onChange={(e) => setServiceFeeFcfa(e.target.value)} placeholder="Ex: 200000" className="w-full px-3 py-2 rounded-lg border-2 border-emerald-200 bg-emerald-50 text-sm font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            {/* Total Box */}
            <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-300 uppercase font-bold tracking-wider">Total à envoyer au client</div>
                <div className="text-[10px] text-slate-400">≈ {formatFCFA(liveTotalFcfa)}</div>
              </div>
              <div className="text-3xl font-black text-white">{liveTotalUsd.toLocaleString("fr-FR")} $</div>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={handleSave} disabled={loading} className="w-full flex justify-center items-center gap-2 px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-colors">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} 
                Enregistrer le devis
              </button>
            </div>
          </div>

          {/* ✅ BOUTON WHATSAPP (apparaît si le total est > 0) */}
          {currentTotalUsd > 0 && whatsappLink && (
             <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-4 animate-in slide-in-from-bottom-2 fade-in">
               <h4 className="text-sm font-bold text-emerald-900 mb-1 flex items-center gap-1"><Zap className="h-4 w-4" /> Devis prêt !</h4>
               <p className="text-xs text-emerald-700 mb-3">Envoyez le récapitulatif et le prix en Dollars au client pour qu'il valide.</p>
               <a href={`${whatsappLink}?text=${generateWhatsAppMessage()}`} target="_blank" rel="noopener noreferrer" className="w-full flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg text-sm transition-colors shadow-lg shadow-emerald-500/30">
                 <Send className="h-4 w-4" /> Envoyer le devis (en $) sur WhatsApp
               </a>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}