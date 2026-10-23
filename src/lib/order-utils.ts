// src/lib/order-utils.ts

export const DEFAULT_EXCHANGE_RATE = 762; // 1 AED = 762 FCFA

/**
 * Calcule la marge en FCFA à partir du prix d'achat AED + transport AED
 * et du taux de change.
 */
export function computeMarginFcfa(
  purchaseAed: number | null | undefined,
  transportAed: number | null | undefined,
  saleFcfa: number | null | undefined,
  exchangeRate: number = DEFAULT_EXCHANGE_RATE
): number {
  if (!saleFcfa) return 0;
  const costAed = (purchaseAed ?? 0) + (transportAed ?? 0);
  const costFcfa = costAed * exchangeRate;
  return Math.round(saleFcfa - costFcfa);
}

/**
 * Génère la prochaine référence de commande (BE-YYYY-XXX)
 */
export async function generateNextOrderRef(
  supabase: any
): Promise<string> {
  const year = new Date().getFullYear();
  const { data, error } = await supabase
    .from("orders")
    .select("order_ref")
    .like("order_ref", `BE-${year}-%`)
    .order("order_ref", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return `BE-${year}-001`;
  }

  const last = data[0].order_ref as string;
  const num = parseInt(last.split("-")[2] ?? "0", 10) + 1;
  return `BE-${year}-${String(num).padStart(3, "0")}`;
}

/**
 * Génère les tâches automatiques à partir d'une commande
 */
export type AutoTask = {
  title: string;
  description: string;
  priority: "low" | "normal" | "high" | "urgent";
  due_date: string; // YYYY-MM-DD
};

export function generateTasksForOrder(order: {
  order_ref: string;
  client_name?: string;
  items_description: string;
  purchase_price_aed: number | null;
  status: string;
}): AutoTask[] {
  const tasks: AutoTask[] = [];
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const tomorrow = new Date(today.getTime() + 86400000)
    .toISOString()
    .split("T")[0];
  const in3days = new Date(today.getTime() + 3 * 86400000)
    .toISOString()
    .split("T")[0];
  const in5days = new Date(today.getTime() + 5 * 86400000)
    .toISOString()
    .split("T")[0];

  // Règle 1 : toujours appeler le client pour confirmer
  if (order.client_name) {
    tasks.push({
      title: `Appeler ${order.client_name} pour confirmer`,
      description: `Commande ${order.order_ref} — ${order.items_description}`,
      priority: "high",
      due_date: todayStr,
    });
  }

  // Règle 2 : si prix d'achat inconnu, contacter fournisseur
  if (!order.purchase_price_aed || order.purchase_price_aed === 0) {
    tasks.push({
      title: `Contacter fournisseur — ${order.items_description}`,
      description: `Prix d'achat manquant pour ${order.order_ref}`,
      priority: "urgent",
      due_date: tomorrow,
    });
  }

  // Règle 3 : si commande en sourcing, prévoir achat
  if (order.status === "sourcing") {
    tasks.push({
      title: `Finaliser l'achat ${order.order_ref}`,
      description: `Passer la commande auprès du fournisseur`,
      priority: "normal",
      due_date: in3days,
    });
  }

  return tasks;
}