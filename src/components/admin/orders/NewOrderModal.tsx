// src/components/admin/orders/NewOrderModal.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X, ArrowRight, ArrowLeft, Search, UserPlus, CheckCircle2, Loader2,
} from "lucide-react";
import { type Client, createOrder, fetchClients, fetchSettings } from "@/lib/order-client";
import { computeMarginFcfa, DEFAULT_EXCHANGE_RATE } from "@/lib/order-utils";
import { formatFCFA, formatAED } from "@/lib/admin-utils";
import { NewClientInlineModal } from "./NewClientInlineModal";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function NewOrderModal({ open, onClose, onCreated }: Props) {
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [settings, setSettings] = useState<{ exchange_rate_aed_to_fcfa: number }>({
    exchange_rate_aed_to_fcfa: DEFAULT_EXCHANGE_RATE,
  });
  const [clientSearch, setClientSearch] = useState("");
  const [clientId, setClientId] = useState<string | null>(null);
  const [newClientOpen, setNewClientOpen] = useState(false);

  const [itemsDescription, setItemsDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [supplierName, setSupplierName] = useState("");
  const [supplierCity, setSupplierCity] = useState("");
  const [purchaseAed, setPurchaseAed] = useState<string>("");
  const [transportAed, setTransportAed] = useState<string>("");
  const [saleFcfa, setSaleFcfa] = useState<string>("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  
  // Statut initial pour la création manuelle
  const [initialStatus, setInitialStatus] = useState<"new" | "quoted" | "sourcing">("sourcing");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    fetchClients().then(setClients).catch(console.error);
    fetchSettings().then(setSettings).catch(console.error);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setClientSearch("");
      setClientId(null);
      setItemsDescription("");
      setQuantity(1);
      setSupplierName("");
      setSupplierCity("");
      setPurchaseAed("");
      setTransportAed("");
      setSaleFcfa("");
      setExpectedDelivery("");
      setInitialStatus("sourcing");
      setError(null);
    }
  }, [open]);

  const filteredClients = useMemo(() => {
    const q = clientSearch.toLowerCase();
    if (!q) return clients.slice(0, 5);
    return clients.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 5);
  }, [clientSearch, clients]);

  const selectedClient = clients.find((c) => c.id === clientId);

  const marginLive = useMemo(() => {
    return computeMarginFcfa(
      purchaseAed ? parseFloat(purchaseAed) : 0,
      transportAed ? parseFloat(transportAed) : 0,
      saleFcfa ? parseInt(saleFcfa, 10) : 0,
      settings.exchange_rate_aed_to_fcfa
    );
  }, [purchaseAed, transportAed, saleFcfa, settings]);

  if (!open) return null;

  function canGoNext(): boolean {
    if (step === 1) return !!clientId && itemsDescription.trim().length > 2;
    if (step === 2) return true;
    if (step === 3) return !!saleFcfa && parseInt(saleFcfa, 10) > 0;
    return false;
  }

  async function handleSubmit() {
    if (!clientId || !saleFcfa) return;
    setLoading(true);
    setError(null);

    try {
      await createOrder({
        client_id: clientId,
        items_description: itemsDescription,
        quantity,
        supplier_name: supplierName || undefined,
        supplier_city: supplierCity || undefined,
        purchase_price_aed: purchaseAed ? parseFloat(purchaseAed) : 0,
        transport_cost_aed: transportAed ? parseFloat(transportAed) : 0,
        sale_price_fcfa: parseInt(saleFcfa, 10),
        exchange_rate_aed_to_fcfa: settings.exchange_rate_aed_to_fcfa,
        expected_delivery: expectedDelivery || undefined,
        source: "whatsapp",
        status: initialStatus,
      });
      onCreated();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-5 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Nouvelle commande (Client direct)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Étape {step} sur 3</p>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-1 px-5 pt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${step >= s ? "bg-blue-600" : "bg-slate-200"}`} />
            ))}
          </div>

          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">👤 Client *</label>
                  {!selectedClient ? (
                    <>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="text" value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} placeholder="Rechercher un client..." className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                        {filteredClients.map((c) => (
                          <button key={c.id} onClick={() => setClientId(c.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm flex items-center justify-between">
                            <span className="font-medium text-slate-900">{c.name}</span>
                            <span className="text-xs text-slate-500">{c.city}</span>
                          </button>
                        ))}
                      </div>
                      <button onClick={() => setNewClientOpen(true)} className="mt-2 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                        <UserPlus className="h-4 w-4" /> Créer un nouveau client
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-blue-50">
                      <div>
                        <div className="font-semibold text-slate-900">{selectedClient.name}</div>
                        <div className="text-xs text-slate-600">{selectedClient.city}</div>
                      </div>
                      <button onClick={() => setClientId(null)} className="text-xs font-semibold text-blue-600 hover:underline">Changer</button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">📦 Marchandise *</label>
                  <input type="text" value={itemsDescription} onChange={(e) => setItemsDescription(e.target.value)} placeholder="Ex: 2x iPhone 15 Pro 256GB" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Quantité</label>
                  <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-32 px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-xs text-slate-500 italic">Facultatif. Vous pourrez compléter plus tard.</p>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">🏪 Fournisseur</label>
                  <input type="text" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} placeholder="Ex: Al-Maktoum Electronics" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">📍 Ville fournisseur</label>
                  <input type="text" value={supplierCity} onChange={(e) => setSupplierCity(e.target.value)} placeholder="Ex: Deira, Dubaï" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">💰 Prix achat (AED)</label>
                    <input type="number" min={0} step="0.01" value={purchaseAed} onChange={(e) => setPurchaseAed(e.target.value)} placeholder="5400" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">✈️ Transport (AED)</label>
                    <input type="number" min={0} step="0.01" value={transportAed} onChange={(e) => setTransportAed(e.target.value)} placeholder="450" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm" />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">💵 Prix de vente (FCFA) *</label>
                  <input type="number" min={0} value={saleFcfa} onChange={(e) => setSaleFcfa(e.target.value)} placeholder="18500000" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-lg font-bold text-blue-600" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Statut de départ</label>
                  <div className="flex gap-2">
                    <button onClick={() => setInitialStatus("sourcing")} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${initialStatus === "sourcing" ? "bg-blue-100 text-blue-800 border-2 border-blue-400" : "bg-slate-50 text-slate-600"}`}>
                      En Sourcing (Validé)
                    </button>
                    <button onClick={() => setInitialStatus("quoted")} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${initialStatus === "quoted" ? "bg-purple-100 text-purple-800 border-2 border-purple-400" : "bg-slate-50 text-slate-600"}`}>
                      Devis envoyé
                    </button>
                  </div>
                </div>
                {saleFcfa && (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                    <div className="text-xs text-green-700 uppercase font-semibold mb-2">Marge nette estimée</div>
                    <div className="text-2xl font-bold text-green-700">{formatFCFA(marginLive)}</div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center justify-between p-5 border-t border-slate-200">
            <button onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1 || loading} className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg disabled:text-slate-300">
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>
            {step < 3 ? (
              <button onClick={() => setStep((s) => s + 1)} disabled={!canGoNext()} className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-lg">
                Suivant <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!canGoNext() || loading} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300 rounded-lg">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Création...</> : <><CheckCircle2 className="h-4 w-4" /> Créer la commande</>}
              </button>
            )}
          </div>
        </div>
      </div>
      <NewClientInlineModal open={newClientOpen} onClose={() => setNewClientOpen(false)} onCreated={(c) => { setClients((p) => [...p, c]); setClientId(c.id); setClientSearch(""); }} />
    </>
  );
}

