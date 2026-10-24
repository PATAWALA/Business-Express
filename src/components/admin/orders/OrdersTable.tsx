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
  Search,
  X,
  AlertCircle,
  MessageCircle,
  Calendar,
  Wallet,
} from "lucide-react";
import type { Order, Client } from "@/lib/order-client";
import { formatFCFA, formatDate } from "@/lib/admin-utils";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PageHelp } from "@/components/admin/ui/PageHelp";
import { Button } from "@/components/admin/ui/Button";
import { Avatar } from "@/components/admin/ui/Avatar";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { ShareProjectLink } from "@/components/admin/shared/ShareProjectLink";
import { OrdersFilters } from "./OrdersFilters";
import { StatusDropdown } from "./StatusDropdown";
import { NewOrderModal } from "./NewOrderModal";
import { OrderDetailModal } from "./OrderDetailModal";

type OrderWithClient = Order & { clients: Client | null };
type FilterKey = "all" | Order["status"];

interface Props {
  initialOrders: OrderWithClient[];
}

const PAGE_SIZE = 20;

export function OrdersTable({ initialOrders }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState(initialOrders);
  const [newOpen, setNewOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<OrderWithClient | null>(null);

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
          title="💡 Comment lire cette page ?"
          description="Chaque ligne est une demande ou une commande."
          steps={[
            { label: "🟡 Nouveau (Prospect)", description: "Le client a rempli le formulaire. Contactez-le sur WhatsApp." },
            { label: "🔵 En Recherche", description: "Vous cherchez la marchandise à Dubaï." },
            { label: "🚚 En transport", description: "La marchandise est en route vers l'Afrique." },
            { label: "🟢 Livré", description: "Le client a reçu son colis. C'est terminé !" },
          ]}
          tips={["Cliquez sur une commande pour voir les détails et calculer le bénéfice."]}
        />
        <ShareProjectLink />
      </div>

      <OrdersFilters
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        filter={filter}
        onFilterChange={(v) => {
          setFilter(v);
          setPage(1);
        }}
        counts={counts as any}
      />

      <div className="space-y-3">
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

            return (
              <div
                key={order.id}
                onClick={() => setDetailOrder(order)}
                className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-5 ${
                  isNew
                    ? "border-red-200 bg-red-50/30 hover:bg-red-50 shadow-[0_2px_10px_rgba(239,68,68,0.05)]"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                }`}
              >
                {/* Indicateur de statut à gauche (bordure colorée) */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  isNew ? "bg-red-500" :
                  order.status === "delivered" ? "bg-emerald-500" :
                  order.status === "freight" ? "bg-indigo-500" : "bg-blue-500"
                }`} />

                {/* Client */}
                <div className="flex items-center gap-3 md:w-1/4 shrink-0 pl-2">
                  <Avatar name={order.clients?.name ?? "?"} size="md" />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">
                      {order.clients?.name ?? "Client inconnu"}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        {order.order_ref}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Détails commande */}
                <div className="flex-1 md:w-1/3">
                  <div className="text-sm font-semibold text-slate-800 line-clamp-1">
                    {order.items_description}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {isNew ? "Reçu récemment" : `Créé le ${formatDate(order.created_at)}`}
                  </div>
                </div>

                {/* Finances */}
                <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
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

                {/* Statut */}
                <div className="shrink-0 flex items-center justify-between md:justify-end w-full md:w-auto mt-2 md:mt-0" onClick={(e) => e.stopPropagation()}>
                   <div className="md:hidden text-xs font-semibold text-slate-500">Statut :</div>
                   <StatusDropdown
                      orderId={order.id}
                      currentStatus={order.status}
                      onChanged={() => router.refresh()}
                    />
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