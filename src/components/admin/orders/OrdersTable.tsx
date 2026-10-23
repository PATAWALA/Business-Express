// src/components/admin/orders/OrdersTable.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Package,
  RefreshCw,
} from "lucide-react";
import type { Order, Client } from "@/lib/order-client";
import { formatFCFA, formatDate } from "@/lib/admin-utils";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PageHelp } from "@/components/admin/ui/PageHelp";
import { Button } from "@/components/admin/ui/Button";
import { Avatar } from "@/components/admin/ui/Avatar";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { OrdersFilters } from "./OrdersFilters";
import { StatusDropdown } from "./StatusDropdown";
import { NewOrderModal } from "./NewOrderModal";
import { OrderDetailModal } from "./OrderDetailModal";

type OrderWithClient = Order & { clients: Client | null };
type SortKey = "created_at" | "margin_fcfa" | "order_ref";
type SortDir = "asc" | "desc";
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

  // Lecture du filtre depuis l'URL (?status=freight)
  const initialFilter = (searchParams.get("status") as FilterKey) || "all";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>(initialFilter);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  // Sync si l'URL change
  useEffect(() => {
    const urlFilter = (searchParams.get("status") as FilterKey) || "all";
    setFilter(urlFilter);
    setPage(1);
  }, [searchParams]);

  const counts = useMemo(
    () => ({
      all: orders.length,
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

    if (filter !== "all") {
      list = list.filter((o) => o.status === filter);
    }

    if (q) {
      list = list.filter(
        (o) =>
          o.order_ref.toLowerCase().includes(q) ||
          o.items_description.toLowerCase().includes(q) ||
          (o.clients?.name ?? "").toLowerCase().includes(q) ||
          (o.supplier_name ?? "").toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "created_at") {
        cmp = (a.created_at ?? "").localeCompare(b.created_at ?? "");
      } else if (sortKey === "margin_fcfa") {
        cmp = (a.margin_fcfa ?? 0) - (b.margin_fcfa ?? 0);
      } else if (sortKey === "order_ref") {
        cmp = a.order_ref.localeCompare(b.order_ref);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [orders, filter, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col)
      return <ArrowUpDown className="h-3 w-3 text-slate-400" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 text-blue-600" />
    ) : (
      <ArrowDown className="h-3 w-3 text-blue-600" />
    );
  }

  function refresh() {
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="Commandes"
        subtitle={`${orders.length} commande${orders.length > 1 ? "s" : ""} au total`}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={refresh}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Actualiser</span>
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setNewOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouvelle commande
            </Button>
          </div>
        }
      />

      {/* Encart pédagogique */}
      <div className="mb-4">
        <PageHelp
          title="💡 Comment gérer vos commandes"
          description="Suivez chaque commande du sourcing à la livraison"
          steps={[
            {
              label: "Créez une commande",
              description:
                "Cliquez sur '+ Nouvelle commande'. Vous pouvez aussi recevoir des commandes automatiques via le lien /commander.",
            },
            {
              label: "Remplissez les 3 étapes",
              description:
                "Étape 1 : Client + Article. Étape 2 : Fournisseur + Prix d'achat (facultatif). Étape 3 : Prix de vente + Livraison.",
            },
            {
              label: "Suivez le statut",
              description:
                "🟡 Sourcing → 🔵 Acheté → 🟣 En fret → 🟢 Livré. Cliquez sur le badge pour changer d'étape.",
            },
            {
              label: "Complétez les prix plus tard",
              description:
                "Si vous ne connaissez pas encore le prix d'achat, laissez vide. Ouvrez la commande plus tard pour le remplir. La marge se calcule automatiquement.",
            },
          ]}
          tips={[
            "Utilisez la barre de recherche pour retrouver une commande (par réf, client ou article).",
            "Les filtres par statut vous permettent de voir uniquement les colis en transit.",
            "Cliquez sur une ligne pour ouvrir le détail et modifier.",
          ]}
        />
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
        counts={counts}
      />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title={search || filter !== "all" ? "Aucun résultat" : "Aucune commande"}
            description={
              search || filter !== "all"
                ? "Essayez d'ajuster votre recherche ou vos filtres."
                : "Créez votre première commande pour commencer."
            }
            action={
              !search && filter === "all" ? (
                <Button onClick={() => setNewOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Nouvelle commande
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    <th className="px-4 py-3">
                      <button
                        onClick={() => toggleSort("order_ref")}
                        className="flex items-center gap-1 hover:text-slate-900"
                      >
                        Réf.
                        <SortIcon col="order_ref" />
                      </button>
                    </th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Article</th>
                    <th className="px-4 py-3 text-right">Vente</th>
                    <th className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleSort("margin_fcfa")}
                        className="flex items-center gap-1 hover:text-slate-900 ml-auto"
                      >
                        Marge
                        <SortIcon col="margin_fcfa" />
                      </button>
                    </th>
                    <th className="px-4 py-3">Livraison</th>
                    <th className="px-4 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setDetailOrder(order)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-bold text-slate-900">
                        {order.order_ref}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={order.clients?.name ?? "?"} size="sm" />
                          <span className="text-slate-700 text-sm">
                            {order.clients?.name ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-[220px] truncate">
                        {order.items_description}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {formatFCFA(order.sale_price_fcfa)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                        {formatFCFA(order.margin_fcfa)}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {formatDate(order.expected_delivery)}
                      </td>
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <StatusDropdown
                          orderId={order.id}
                          currentStatus={order.status}
                          onChanged={() => router.refresh()}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-slate-100">
              {paginated.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setDetailOrder(order)}
                  className="p-4 hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar name={order.clients?.name ?? "?"} size="sm" />
                      <div>
                        <div className="text-xs font-mono font-bold text-slate-900">
                          {order.order_ref}
                        </div>
                        <div className="text-xs text-slate-500">
                          {order.clients?.name ?? "—"}
                        </div>
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <StatusDropdown
                        orderId={order.id}
                        currentStatus={order.status}
                        onChanged={() => router.refresh()}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-slate-700 mb-2">
                    {order.items_description}
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">
                      Vente : {formatFCFA(order.sale_price_fcfa)}
                    </span>
                    <span className="font-semibold text-emerald-600">
                      Marge : {formatFCFA(order.margin_fcfa)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
                <div className="text-xs text-slate-500">
                  {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)} sur {filtered.length}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(safePage - 1)}
                    disabled={safePage === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-semibold text-slate-700 px-2">
                    {safePage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(safePage + 1)}
                    disabled={safePage === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <NewOrderModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onCreated={refresh}
      />
      <OrderDetailModal
        order={detailOrder}
        onClose={() => setDetailOrder(null)}
        onSaved={refresh}
      />
    </div>
  );
}