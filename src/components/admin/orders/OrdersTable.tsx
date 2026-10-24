// src/components/admin/orders/OrdersTable.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus, ChevronLeft, ChevronRight, Package, RefreshCw, Calendar, Wallet,
  AlertCircle, ArrowRight, Truck, CheckCircle2, Zap, Loader2, User
} from "lucide-react";
import type { Order, Client } from "@/lib/order-client";
import { updateOrderStatus } from "@/lib/order-client";
import { formatFCFA, formatDate } from "@/lib/admin-utils";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Button } from "@/components/admin/ui/Button";
import { Avatar } from "@/components/admin/ui/Avatar";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { ShareProjectLink } from "@/components/admin/shared/ShareProjectLink";
import { OrdersFilters } from "./OrdersFilters";
import { NewOrderModal } from "./NewOrderModal";
import { OrderDetailModal } from "./OrderDetailModal";
import { useToast } from "@/components/admin/ui/ToastProvider";

type OrderWithClient = Order & { clients: Client | null };
type FilterKey = "all" | Order["status"];

interface Props {
  initialOrders: OrderWithClient[];
  usdRate: number;
}

const PAGE_SIZE = 20;

export function OrdersTable({ initialOrders, usdRate }: Props) {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState(initialOrders);
  const [newOpen, setNewOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<OrderWithClient | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

  const initialFilter = (searchParams.get("status") as FilterKey) || "all";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>(initialFilter);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setFilter((searchParams.get("status") as FilterKey) || "all");
    setPage(1);
  }, [searchParams]);

  const counts = useMemo(() => ({
    all: orders.length,
    new: orders.filter((o) => o.status === "new").length,
    quoted: orders.filter((o) => o.status === "quoted").length,
    sourcing: orders.filter((o) => o.status === "sourcing").length,
    purchased: orders.filter((o) => o.status === "purchased").length,
    freight: orders.filter((o) => o.status === "freight").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }), [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = orders;
    if (filter !== "all") list = list.filter((o) => o.status === filter);
    if (q) {
      list = list.filter((o) => o.order_ref.toLowerCase().includes(q) || o.items_description.toLowerCase().includes(q) || (o.clients?.name ?? "").toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (a.status === "new" && b.status !== "new") return -1;
      if (b.status === "new" && a.status !== "new") return 1;
      return (b.created_at ?? "").localeCompare(a.created_at ?? "");
    });
  }, [orders, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  function refresh() { router.refresh(); }

  async function advanceStatus(order: OrderWithClient) {
    let nextStatus: any = null;
    if (order.status === "new" || order.status === "quoted") nextStatus = "sourcing";
    else if (order.status === "sourcing") nextStatus = "purchased";
    else if (order.status === "purchased") nextStatus = "freight";
    else if (order.status === "freight") nextStatus = "delivered";

    if (!nextStatus) return;

    setLoadingStatus(order.id);
    try {
      await updateOrderStatus(order.id, nextStatus);
      toast.success("Statut mis à jour !");
      router.refresh();
    } catch {
      toast.error("Erreur");
    } finally {
      setLoadingStatus(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Commandes & Devis"
        subtitle="Cliquez sur 'Calculer le devis' pour traiter un nouveau prospect."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="md" onClick={refresh} className="gap-2 bg-white">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Actualiser</span>
            </Button>
            <Button variant="primary" size="md" onClick={() => setNewOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle commande
            </Button>
          </div>
        }
      />

      <div className="mb-6">
        <ShareProjectLink />
      </div>

      <OrdersFilters search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} filter={filter} onFilterChange={(v) => { setFilter(v); setPage(1); }} counts={counts as any} />

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white">
            <EmptyState icon={Package} title="Aucune commande" description="Vous n'avez pas encore de commande correspondant à ce filtre." />
          </div>
        ) : (
          paginated.map((order) => {
            const isNew = order.status === "new";
            const hasPrice = !!order.sale_price_fcfa && order.sale_price_fcfa > 0;
            const isLoading = loadingStatus === order.id;

            let actionLabel = "Gérer";
            let actionIcon = ArrowRight;
            let actionColor = "bg-blue-600 text-white hover:bg-blue-700";
            let showAction = true;

            if (isNew) {
              actionLabel = "Calculer le devis";
              actionIcon = Zap;
              actionColor = "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/30";
            } else if (order.status === "quoted") {
              actionLabel = "Valider (Client OK)";
              actionIcon = CheckCircle2;
              actionColor = "bg-blue-600 text-white hover:bg-blue-700";
            } else if (order.status === "sourcing") {
              actionLabel = "Marquer comme Acheté";
              actionIcon = CheckCircle2;
              actionColor = "bg-orange-500 text-white hover:bg-orange-600";
            } else if (order.status === "purchased") {
              actionLabel = "Marquer en Transport";
              actionIcon = Truck;
              actionColor = "bg-indigo-600 text-white hover:bg-indigo-700";
            } else if (order.status === "freight") {
              actionLabel = "Marquer comme Livré";
              actionIcon = CheckCircle2;
              actionColor = "bg-emerald-600 text-white hover:bg-emerald-700";
            } else if (order.status === "delivered") {
              showAction = false;
            }

            const ActionIcon = actionIcon;

            return (
              <div key={order.id} className={`relative rounded-2xl border transition-all flex flex-col md:flex-row md:items-center gap-4 p-5 ${isNew ? "border-red-300 bg-red-50/40 shadow-sm" : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"}`}>
                
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${
                  isNew ? "bg-red-500" : order.status === "delivered" ? "bg-emerald-500" : order.status === "freight" ? "bg-indigo-500" : "bg-blue-500"
                }`} />

                <div className="flex items-center gap-3 md:w-1/4 shrink-0 pl-2">
                  <Avatar name={order.clients?.name ?? "?"} size="md" />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{order.clients?.name ?? "Client inconnu"}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{order.order_ref}</div>
                  </div>
                </div>

                <div className="flex-1 md:w-1/4">
                  <div className="text-sm font-semibold text-slate-800 line-clamp-2">{order.items_description}</div>
                  <div className="text-xs text-slate-500 mt-1">{formatDate(order.created_at)}</div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/4 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Prix Client</div>
                    {hasPrice ? (
                      <div className="font-bold text-blue-600">{formatFCFA(order.sale_price_fcfa)}</div>
                    ) : (
                      <div className="font-semibold text-amber-600 flex items-center gap-1 md:justify-end"><AlertCircle className="h-3 w-3" /> À calculer</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-emerald-600">Votre Marge</div>
                    <div className="font-bold text-emerald-600">{hasPrice ? formatFCFA(order.margin_fcfa) : "—"}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 mt-2 md:mt-0" onClick={(e) => e.stopPropagation()}>
                  <StatusBadge status={order.status} />
                  
                  {showAction && (
                    <Button
                      size="md"
                      disabled={isLoading}
                      onClick={() => isNew ? setDetailOrder(order) : advanceStatus(order)}
                      className={`gap-2 px-4 ${actionColor}`}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ActionIcon className="h-4 w-4" />}
                      {actionLabel}
                    </Button>
                  )}

                  <Button variant="outline" size="md" onClick={() => setDetailOrder(order)} className="px-3" title="Voir les détails">
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 mt-4 border border-slate-200 rounded-xl bg-white">
          <div className="text-xs text-slate-500">{pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)} sur {filtered.length}</div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(safePage - 1)} disabled={safePage === 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
            <span className="text-xs font-semibold text-slate-700 px-3">{safePage} / {totalPages}</span>
            <button onClick={() => setPage(safePage + 1)} disabled={safePage === totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      <NewOrderModal open={newOpen} onClose={() => setNewOpen(false)} onCreated={refresh} />
      <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} onSaved={refresh} usdRate={usdRate} />
    </div>
  );
}