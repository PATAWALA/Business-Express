// src/app/(admin)/admin/commandes/page.tsx
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";
import { mockOrders } from "@/lib/mockData";

export default function CommandesPage() {
  return (
    <div>
      <PageHeader
        title="Commandes"
        subtitle={`${mockOrders.length} commandes au total`}
      />
      <OrdersTable initialOrders={mockOrders} />
    </div>
  );
}