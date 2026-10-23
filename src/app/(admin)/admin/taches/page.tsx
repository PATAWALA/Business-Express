// src/app/(admin)/admin/taches/page.tsx
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { UrgentTasks } from "@/components/admin/dashboard/UrgentTasks";
import { mockTasks } from "@/lib/mockData";

export default function TachesPage() {
  return (
    <div>
      <PageHeader
        title="Tâches"
        subtitle={`${mockTasks.filter((t) => !t.completed).length} tâches en attente`}
      />
      <UrgentTasks tasks={mockTasks} />
    </div>
  );
}