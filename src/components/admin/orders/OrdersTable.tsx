// src/components/admin/orders/OrdersTable.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, ChevronLeft, ChevronRight, Package, RefreshCw } from "lucide-react";
import type { Order, Client } from "@/lib/order-client";
import { updateOrderStatus } from "@/lib/order-client";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Button } from "@/components/admin/ui/Button";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { OrderCard } from "./OrderCard";
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

const PAGE_SIZE = 12;

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
        subtitle="Suivez chaque commande et calculez vos devis."
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

      <OrdersFilters search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} filter={filter} onFilterChange={(v) => { setFilter(v); setPage(1); }} counts={counts as any} />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <EmptyState icon={Package} title="Aucune commande" description="Vous n'avez pas encore de commande correspondant à ce filtre." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              usdRate={usdRate}
              isLoading={loadingStatus === order.id}
              onAdvanceStatus={() => advanceStatus(order)}
              onOpenDetails={() => setDetailOrder(order)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 mt-6 border border-slate-200 rounded-xl bg-white">
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