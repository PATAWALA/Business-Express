// src/app/(admin)/admin/finances/page.tsx
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { FinanceSummary } from "@/components/admin/finance/FinanceSummary";
import { mockOrders } from "@/lib/mockData";

export default function FinancesPage() {
  return (
    <div>
      <PageHeader
        title="Trésorerie & Marges"
        subtitle="Vue financière de toutes vos commandes"
      />
      <FinanceSummary orders={mockOrders} />
    </div>
  );
}