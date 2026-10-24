// src/components/admin/orders/OrderDetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  X, Loader2, Save, MessageCircle, MapPin, Trash2, Calculator, CheckCircle2,
} from "lucide-react";
import { type Order, type Client, updateOrder } from "@/lib/order-client";
import { formatFCFA, formatDate } from "@/lib/admin-utils";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { useToast } from "@/components/admin/ui/ToastProvider";
import { Button } from "@/components/admin/ui/Button";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal"; // ✅ Import
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
  
  const [purchaseAed, setPurchaseAed] = useState("");
  const [transportAed, setTransportAed] = useState("");
  const [transferFeeUsd, setTransferFeeUsd] = useState("");
  const [serviceFeeFcfa, setServiceFeeFcfa] = useState("");
  
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentTotalUsd, setCurrentTotalUsd] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ État pour le modal de confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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

  const rateAed = currentOrder.exchange_rate_aed_to_fcfa || 762;
  const costAed = (parseFloat(purchaseAed) || 0) + (parseFloat(transportAed) || 0);
  const costFcfa = costAed * rateAed;
  const transferUsd = parseFloat(transferFeeUsd) || 0;
  const transferFcfa = transferUsd * usdRate;
  const serviceFee = parseFloat(serviceFeeFcfa) || 0;
  
  const liveTotalFcfa = costFcfa + transferFcfa + serviceFee;
  const liveTotalUsd = Math.round(liveTotalFcfa / usdRate);

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
        status: currentStatus === "new" ? "quoted" : currentStatus,
      });
      
      setCurrentStatus(currentStatus === "new" ? "quoted" : currentStatus);
      setCurrentTotalUsd(liveTotalUsd);
      
      toast.success("Devis enregistré ! Vous pouvez maintenant l'envoyer.");
      router.refresh();
      onSaved();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/orders/${currentOrder.id}/delete`, { method: "DELETE" });
      toast.success("Commande supprimée");
      setDeleteModalOpen(false);
      onSaved();
      onClose();
    } catch {
      toast.error("Erreur lors de la suppression");
      setDeleting(false);
    }
  }

  const generateWhatsAppMessage = () => {
    const clientName = currentOrder.clients?.name?.split(" ")[0] || "cher client";
    return encodeURIComponent(
      `Bonjour ${clientName},\n\nVoici votre devis pour : *${currentOrder.items_description}*\n\n💰 Montant total : *${currentTotalUsd.toLocaleString("fr-FR")} $* USD\n\nCe prix inclut :\n- L'achat de la marchandise à Dubaï\n- Le transport et la logistique\n- Les frais de transfert\n- Nos frais de service\n\n📦 Réf : ${currentOrder.order_ref}\n\nSouhaitez-vous valider cette commande ?`
    );
  };

  const whatsappLink = currentOrder.clients?.whatsapp
    ? `https://wa.me/${currentOrder.clients.whatsapp.replace(/\D/g, "")}?text=${generateWhatsAppMessage()}`
    : null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          
          <div className="flex items-start justify-between p-5 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dossier client</span>
                <StatusBadge status={currentStatus} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{currentOrder.clients?.name}</h2>
              <p className="text-xs text-slate-500 mt-1">Réf : {currentOrder.order_ref} · Créée le {formatDate(currentOrder.created_at)}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setDeleteModalOpen(true)} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-200"><X className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="p-5 overflow-y-auto flex-1 space-y-6">
            {/* ÉTAPE 1 */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs">1</span>
                Voici ce que le client a demandé :
              </h3>
              <div className="rounded-xl border-l-4 border-blue-500 bg-slate-50 p-4">
                <p className="text-sm text-slate-800 whitespace-pre-wrap italic">"{currentOrder.items_description}"</p>
              </div>
            </div>

            {/* ÉTAPE 2 */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs">2</span>
                Calculez le devis à envoyer
              </h3>
              
              <div className="rounded-xl border border-slate-200 p-4 space-y-4 bg-white">
                <p className="text-xs text-slate-500">Renseignez vos coûts. Le total se calcule automatiquement.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Prix d'achat (AED)</label>
                    <input type="number" value={purchaseAed} onChange={(e) => setPurchaseAed(e.target.value)} placeholder="Ex: 5000" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Transport (AED)</label>
                    <input type="number" value={transportAed} onChange={(e) => setTransportAed(e.target.value)} placeholder="Ex: 500" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Frais transfert (USD)</label>
                    <input type="number" value={transferFeeUsd} onChange={(e) => setTransferFeeUsd(e.target.value)} placeholder="Ex: 50" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-600 mb-1">Frais de service (FCFA)</label>
                    <input type="number" value={serviceFeeFcfa} onChange={(e) => setServiceFeeFcfa(e.target.value)} placeholder="Ex: 200000" className="w-full px-3 py-2 rounded-lg border-2 border-emerald-200 bg-emerald-50 text-sm font-bold text-emerald-700" />
                  </div>
                </div>

                <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between mt-2">
                  <div>
                    <div className="text-xs text-slate-300 uppercase font-bold">Le client devra payer</div>
                    <div className="text-[10px] text-slate-400">≈ {formatFCFA(liveTotalFcfa)}</div>
                  </div>
                  <div className="text-3xl font-black text-white">{liveTotalUsd.toLocaleString("fr-FR")} $</div>
                </div>

                {currentStatus === "new" && (
                  <Button onClick={handleSave} disabled={loading} className="w-full gap-2 bg-blue-600 text-white mt-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Enregistrer le devis
                  </Button>
                )}
              </div>
            </div>

            {/* ÉTAPE 3 */}
            {currentTotalUsd > 0 && whatsappLink && currentStatus !== "new" && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">3</span>
                  Envoyez le devis au client
                </h3>
                
                <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-5 text-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-emerald-900 mb-1">Devis prêt !</h4>
                  <p className="text-xs text-emerald-700 mb-4">Le message contient déjà le total et les détails.</p>
                  
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/30">
                    <MessageCircle className="h-5 w-5" /> Envoyer sur WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ MODAL DE CONFIRMATION CUSTOMISÉ */}
      <ConfirmModal
        open={deleteModalOpen}
        title="Supprimer cette commande ?"
        description={`La commande ${currentOrder.order_ref} pour ${currentOrder.clients?.name} sera définitivement supprimée. Cette action est irréversible.`}
        confirmLabel="Oui, supprimer"
        cancelLabel="Annuler"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </>
  );
}