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

// 🟢 NOUVEAUX LIBELLÉS ULTRA-CLAIRS
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: "🟡 Nouveau (à traiter)",
    quoted: "🟣 Devis envoyé",
    sourcing: "🔵 Recherche fournisseur",
    purchased: "🟠 Acheté",
    freight: "🚚 En transport",
    delivered: "🟢 Livré",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: "bg-amber-100 text-amber-800 border-amber-300",
    quoted: "bg-purple-100 text-purple-800 border-purple-300",
    sourcing: "bg-blue-100 text-blue-800 border-blue-300",
    purchased: "bg-orange-100 text-orange-800 border-orange-300",
    freight: "bg-indigo-100 text-indigo-800 border-indigo-300",
    delivered: "bg-emerald-100 text-emerald-800 border-emerald-300",
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