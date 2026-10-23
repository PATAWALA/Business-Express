// src/components/admin/ui/StatusBadge.tsx
import { getStatusLabel, getStatusColor } from "@/lib/admin-utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}