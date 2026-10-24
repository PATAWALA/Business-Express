// src/components/admin/orders/OrdersTable.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Package,
  RefreshCw,
  Calendar,
  Wallet,
  AlertCircle,
  ArrowRight,
  Truck,
  CheckCircle2,
  Zap,
  Loader2,
} from "lucide-react";

// ✅ CORRECTION ICI : On sépare les types des fonctions
import type { Order, Client } from "@/lib/order-client";
import { updateOrderStatus } from "@/lib/order-client";

import { formatFCFA, formatDate } from "@/lib/admin-utils";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PageHelp } from "@/components/admin/ui/PageHelp";
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
}

const PAGE_SIZE = 20;

export function OrdersTable({ initialOrders }: Props) {
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
    const urlFilter = (searchParams.get("status") as FilterKey) || "all";
    setFilter(urlFilter);
    setPage(1);
  }, [searchParams]);

  const counts = useMemo(
    () => ({
      all: orders.length,
      new: orders.filter((o) => o.status === "new").length,
      quoted: orders.filter((o) => o.status === "quoted").length,
      sourcing: orders.filter((o) => o.status === "sourcing").length,
      purchased: orders.filter((o) => o.status === "purchased").length,
      freight: orders.filter((o) => o.status === "freight").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
    }),
    [orders]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = orders;

    if (filter !== "all") list = list.filter((o) => o.status === filter);
    if (q) {
      list = list.filter(
        (o) =>
          o.order_ref.toLowerCase().includes(q) ||
          o.items_description.toLowerCase().includes(q) ||
          (o.clients?.name ?? "").toLowerCase().includes(q) ||
          (o.supplier_name ?? "").toLowerCase().includes(q)
      );
    }

    // On trie pour mettre les "new" (prospects) en haut, puis par date
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

  function refresh() {
    router.refresh();
  }

  // Fonction pour faire avancer le statut d'un seul clic
  async function advanceStatus(order: OrderWithClient) {
    let nextStatus: any = null;
    if (order.status === "new") nextStatus = "sourcing";
    else if (order.status === "quoted") nextStatus = "sourcing";
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
      toast.error("Erreur lors du changement");
    } finally {
      setLoadingStatus(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Commandes & Prospects"
        subtitle="Gérez vos demandes clients et vos livraisons"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <PageHelp
          title="💡 Comment gérer vos commandes ?"
          description="Chaque carte est une opportunité."
          steps={[
            { label: "1. Prospects", description: "Quand un client remplit le formulaire, sa carte apparaît en rouge. Cliquez sur 'Traiter' pour fixer le prix." },
            { label: "2. Recherche", description: "Une fois validé, cherchez la marchandise à Dubaï." },
            { label: "3. Transport", description: "Achetez la marchandise et expédiez-la." },
            { label: "4. Livraison", description: "Le client reçoit son colis. Encaissez l'argent." },
          ]}
          tips={["Cliquez n'importe où sur la carte pour voir les détails."]}
        />
        <ShareProjectLink />
      </div>

      <OrdersFilters
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        filter={filter}
        onFilterChange={(v) => { setFilter(v); setPage(1); }}
        counts={counts as any}
      />

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white">
            <EmptyState
              icon={Package}
              title="Aucune commande"
              description="Vous n'avez pas encore de commande correspondant à ce filtre."
            />
          </div>
        ) : (
          paginated.map((order) => {
            const isNew = order.status === "new";
            const hasPrice = !!order.sale_price_fcfa && order.sale_price_fcfa > 0;
            const isLoading = loadingStatus === order.id;

            // Configuration du bouton principal selon le statut
            let actionLabel = "Voir les détails";
            let actionIcon = ArrowRight;
            let actionColor = "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300";
            let showAction = true;

            if (isNew) {
              actionLabel = hasPrice ? "Valider et chercher" : "Traiter la demande";
              actionIcon = Zap;
              actionColor = "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/30";
            } else if (order.status === "quoted") {
              actionLabel = "Valider pour Sourcing";
              actionIcon = ArrowRight;
              actionColor = "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/30";
            } else if (order.status === "sourcing") {
              actionLabel = "Marquer comme Acheté";
              actionIcon = CheckCircle2;
              actionColor = "bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/30";
            } else if (order.status === "purchased") {
              actionLabel = "Marquer en Transport";
              actionIcon = Truck;
              actionColor = "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/30";
            } else if (order.status === "freight") {
              actionLabel = "Marquer comme Livré";
              actionIcon = CheckCircle2;
              actionColor = "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/30";
            } else if (order.status === "delivered") {
              showAction = false; // Plus d'action à faire
            }

            const ActionIcon = actionIcon;

            return (
              <div
                key={order.id}
                onClick={() => setDetailOrder(order)}
                className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col md:flex-row md:items-center gap-4 p-5 ${
                  isNew
                    ? "border-red-300 bg-red-50/40 hover:bg-red-50 shadow-[0_2px_15px_rgba(239,68,68,0.08)]"
                    : order.status === "delivered"
                    ? "border-emerald-200 bg-emerald-50/20"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                }`}
              >
                {/* Indicateur de statut à gauche (bordure épaisse) */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                  isNew ? "bg-red-500" :
                  order.status === "delivered" ? "bg-emerald-500" :
                  order.status === "freight" ? "bg-indigo-500" :
                  order.status === "purchased" ? "bg-orange-500" : "bg-blue-500"
                }`} />

                {/* Bloc Client & Ref */}
                <div className="flex items-center gap-3 md:w-1/4 shrink-0 pl-3">
                  <Avatar name={order.clients?.name ?? "?"} size="md" />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">
                      {order.clients?.name ?? "Client inconnu"}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <span className="font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                        {order.order_ref}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bloc Description */}
                <div className="flex-1 md:w-1/4">
                  <div className="text-sm font-semibold text-slate-800 line-clamp-2">
                    {order.items_description}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {isNew ? "Reçu via le site" : `Créé le ${formatDate(order.created_at)}`}
                  </div>
                </div>

                {/* Bloc Finances */}
                <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/4 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Prix de vente</div>
                    {hasPrice ? (
                      <div className="font-semibold text-slate-900">{formatFCFA(order.sale_price_fcfa)}</div>
                    ) : (
                      <div className="font-semibold text-amber-600 flex items-center gap-1 md:justify-end">
                        <AlertCircle className="h-3 w-3" /> À définir
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-emerald-600 flex items-center gap-1 md:justify-end">
                      <Wallet className="h-3 w-3" /> Bénéfice
                    </div>
                    <div className="font-bold text-emerald-600">
                      {hasPrice ? formatFCFA(order.margin_fcfa) : "—"}
                    </div>
                  </div>
                </div>

                {/* Bloc Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 md:w-auto" onClick={(e) => e.stopPropagation()}>
                  <StatusBadge status={order.status} />
                  
                  {showAction ? (
                    <Button
                      size="md"
                      disabled={isLoading}
                      onClick={() => {
                        if (isNew && !hasPrice) {
                          setDetailOrder(order); // Ouvre le modal pour mettre le prix
                        } else {
                          advanceStatus(order);
                        }
                      }}
                      className={`gap-2 px-4 ${actionColor}`}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ActionIcon className="h-4 w-4" />}
                      {actionLabel}
                    </Button>
                  ) : (
                    <Button variant="outline" size="md" onClick={() => setDetailOrder(order)} className="gap-2">
                      Voir les détails
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 mt-4 border border-slate-200 rounded-xl bg-white">
          <div className="text-xs text-slate-500">
            {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)} sur {filtered.length}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold text-slate-700 px-3">
              {safePage} / {totalPages}
            </span>
            <button
              onClick={() => setPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <NewOrderModal open={newOpen} onClose={() => setNewOpen(false)} onCreated={refresh} />
      <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} onSaved={refresh} />
    </div>
  );
}