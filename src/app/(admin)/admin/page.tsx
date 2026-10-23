// src/app/(admin)/admin/page.tsx
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { KpiCard } from "@/components/admin/ui/KpiCard";
import { UrgentTasks } from "@/components/admin/dashboard/UrgentTasks";
import { RecentOrders } from "@/components/admin/dashboard/RecentOrders";
import { mockOrders, mockTasks } from "@/lib/mockData";
import { formatFCFA } from "@/lib/admin-utils";
import { Wallet, TrendingUp, Package, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const totalRevenue = mockOrders.reduce((s, o) => s + o.sale_price_fcfa, 0);
  const totalMargin = mockOrders.reduce((s, o) => s + o.margin_fcfa, 0);
  const inTransit = mockOrders.filter((o) => o.status === "freight").length;
  const inSourcing = mockOrders.filter((o) => o.status === "sourcing").length;

  return (
    <div>
      <PageHeader
        title="Bonjour Prince 👋"
        subtitle="Voici votre activité du jour"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Chiffre d'affaires"
          value={formatFCFA(totalRevenue)}
          icon={Wallet}
          color="green"
          trend="+12% ce mois"
        />
        <KpiCard
          title="Marge nette"
          value={formatFCFA(totalMargin)}
          icon={TrendingUp}
          color="blue"
        />
        <KpiCard
          title="En transit"
          value={`${inTransit} colis`}
          icon={Package}
          color="purple"
        />
        <KpiCard
          title="En sourcing"
          value={`${inSourcing} commandes`}
          icon={AlertCircle}
          color="yellow"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <UrgentTasks tasks={mockTasks} />
        <RecentOrders orders={mockOrders} />
      </div>
    </div>
  );
}