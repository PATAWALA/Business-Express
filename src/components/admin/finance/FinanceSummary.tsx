// src/components/admin/finance/FinanceSummary.tsx
import { Order } from "@/lib/mockData";
import { formatAED, formatFCFA } from "@/lib/admin-utils";
import { TrendingUp, Wallet, ArrowDownRight } from "lucide-react";

export function FinanceSummary({ orders }: { orders: Order[] }) {
  const totalRevenue = orders.reduce((s, o) => s + o.sale_price_fcfa, 0);
  const totalMargin = orders.reduce((s, o) => s + o.margin_fcfa, 0);

  const totalPurchaseAED = orders.reduce(
    (s, o) => s + o.purchase_price_aed,
    0
  );
  const totalTransportAED = orders.reduce(
    (s, o) => s + o.transport_cost_aed,
    0
  );
  const totalCostAED = totalPurchaseAED + totalTransportAED;

  return (
    <div className="space-y-6">
      {/* Cartes principales */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase mb-2">
            <Wallet className="h-3.5 w-3.5" />
            Chiffre d&apos;affaires
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatFCFA(totalRevenue)}
          </div>
        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-green-700 text-xs font-semibold uppercase mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            Marge nette
          </div>
          <div className="text-2xl font-bold text-green-700">
            {formatFCFA(totalMargin)}
          </div>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-orange-700 text-xs font-semibold uppercase mb-2">
            <ArrowDownRight className="h-3.5 w-3.5" />
            Argent engagé
          </div>
          <div className="text-2xl font-bold text-orange-700">
            {formatAED(totalCostAED)}
          </div>
        </div>
      </div>

      {/* Détail par commande */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-900">Détail par commande</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-600 uppercase font-semibold">
              <tr className="text-left">
                <th className="px-4 py-3">Réf.</th>
                <th className="px-4 py-3 text-right">Achat AED</th>
                <th className="px-4 py-3 text-right">Transport AED</th>
                <th className="px-4 py-3 text-right">Vente FCFA</th>
                <th className="px-4 py-3 text-right">Marge FCFA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs font-bold">
                    {o.order_ref}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatAED(o.purchase_price_aed)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatAED(o.transport_cost_aed)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatFCFA(o.sale_price_fcfa)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">
                    {formatFCFA(o.margin_fcfa)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}