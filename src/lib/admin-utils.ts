// src/lib/admin-utils.ts

export function formatAED(amount: number | null | undefined): string {
  if (!amount) return "0 AED";
  return (
    new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount) + " AED"
  );
}

export function formatFCFA(amount: number | null | undefined): string {
  if (!amount) return "0 FCFA";
  return (
    new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount) + " FCFA"
  );
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    sourcing: "Sourcing",
    purchased: "Acheté",
    freight: "En Fret",
    delivered: "Livré",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    sourcing: "bg-yellow-100 text-yellow-800 border-yellow-200",
    purchased: "bg-blue-100 text-blue-800 border-blue-200",
    freight: "bg-purple-100 text-purple-800 border-purple-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
}

export function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    low: "Basse",
    normal: "Normale",
    high: "Haute",
    urgent: "Urgente",
  };
  return labels[priority] || priority;
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: "bg-gray-100 text-gray-700",
    normal: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };
  return colors[priority] || "bg-gray-100 text-gray-700";
}