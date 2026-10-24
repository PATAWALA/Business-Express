// src/lib/order-client.ts
import type { Tables } from "@/lib/supabase/database.types";

export type Client = Tables<"clients">;
export type Settings = Tables<"settings">;
export type Task = Tables<"tasks">;

export type Order = Omit<Tables<"orders">, "status"> & {
  status: "new" | "quoted" | "sourcing" | "purchased" | "freight" | "delivered";
  project_type?: string | null;
};

export async function fetchClients(): Promise<Client[]> {
  const res = await fetch("/api/clients", { cache: "no-store" });
  if (!res.ok) throw new Error("Impossible de charger les clients");
  const { clients } = await res.json();
  return clients;
}

export async function createClient(payload: {
  name: string;
  whatsapp: string;
  city: string;
  type: "client" | "prospect";
}): Promise<Client> {
  const res = await fetch("/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur création client");
  return data.client;
}

export async function fetchSettings(): Promise<Settings> {
  const res = await fetch("/api/settings", { cache: "no-store" });
  if (!res.ok) throw new Error("Impossible de charger les paramètres");
  const { settings } = await res.json();
  return settings;
}

export async function createOrder(payload: {
  client_id: string;
  items_description: string;
  quantity: number;
  supplier_name?: string;
  supplier_city?: string;
  purchase_price_aed?: number;
  transport_cost_aed?: number;
  transfer_fee_usd?: number; // Ajouté ici
  sale_price_fcfa: number;
  exchange_rate_aed_to_fcfa: number;
  expected_delivery?: string;
  source?: "public" | "whatsapp" | "manual";
  source_detail?: string;
  status?: string;
  project_type?: string | null;
}): Promise<Order> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur création commande");
  return data.order;
}

export async function updateOrderStatus(
  orderId: string,
  status: "new" | "quoted" | "sourcing" | "purchased" | "freight" | "delivered"
): Promise<void> {
  const res = await fetch(`/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Erreur mise à jour statut");
}

export async function updateOrder(
  orderId: string,
  payload: Record<string, unknown>
): Promise<void> {
  const res = await fetch(`/api/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erreur mise à jour commande");
}