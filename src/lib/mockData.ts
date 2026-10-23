// src/lib/mockData.ts

export type Client = {
  id: string;
  name: string;
  phone: string | null;
  whatsapp: string | null;
  city: string | null;
  country: string | null;
  type: "prospect" | "client";
  total_spent_fcfa: number;
  notes: string | null;
};

export type Order = {
  id: string;
  order_ref: string;
  client_id: string | null;
  supplier_name: string | null;
  supplier_city: string | null;
  items_description: string;
  quantity: number;
  purchase_price_aed: number;
  transport_cost_aed: number;
  sale_price_fcfa: number;
  margin_fcfa: number;
  status: "sourcing" | "purchased" | "freight" | "delivered";
  expected_delivery: string | null;
  created_at: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: "low" | "normal" | "high" | "urgent";
  due_date: string | null;
  completed: boolean;
};

export const mockClients: Client[] = [
  {
    id: "c1",
    name: "Marie Kabongo",
    phone: "+243970111222",
    whatsapp: "+243970111222",
    city: "Bukavu",
    country: "RDC",
    type: "client",
    total_spent_fcfa: 18500000,
    notes: "Cliente fidèle depuis 2023",
  },
  {
    id: "c2",
    name: "David Mwamba",
    phone: "+243970333444",
    whatsapp: "+243970333444",
    city: "Goma",
    country: "RDC",
    type: "client",
    total_spent_fcfa: 12200000,
    notes: "Préfère les iPhones",
  },
  {
    id: "c3",
    name: "Sarah Bahati",
    phone: "+243970555666",
    whatsapp: "+243970555666",
    city: "Bukavu",
    country: "RDC",
    type: "client",
    total_spent_fcfa: 9800000,
    notes: "Commandes cosmétiques régulières",
  },
  {
    id: "c4",
    name: "Patrick Nzuzi",
    phone: "+243970777888",
    whatsapp: "+243970777888",
    city: "Kinshasa",
    country: "RDC",
    type: "prospect",
    total_spent_fcfa: 0,
    notes: "Intéressé par conteneur textile",
  },
  {
    id: "c5",
    name: "Jean-Pierre Mukendi",
    phone: "+243970999000",
    whatsapp: "+243970999000",
    city: "Bukavu",
    country: "RDC",
    type: "client",
    total_spent_fcfa: 7500000,
    notes: "Pièces auto régulièrement",
  },
];

export const mockOrders: Order[] = [
  {
    id: "o1",
    order_ref: "BE-2024-042",
    client_id: "c1",
    supplier_name: "Al-Maktoum Electronics",
    supplier_city: "Deira, Dubaï",
    items_description: "2x iPhone 15 Pro 256GB",
    quantity: 2,
    purchase_price_aed: 5400,
    transport_cost_aed: 450,
    sale_price_fcfa: 18500000,
    margin_fcfa: 4200000,
    status: "freight",
    expected_delivery: "2024-12-15",
    created_at: "2024-11-28",
  },
  {
    id: "o2",
    order_ref: "BE-2024-041",
    client_id: "c2",
    supplier_name: "Bur Dubai Textiles",
    supplier_city: "Bur Dubai, Dubaï",
    items_description: "Lot de 50 robes",
    quantity: 50,
    purchase_price_aed: 1200,
    transport_cost_aed: 180,
    sale_price_fcfa: 12200000,
    margin_fcfa: 2800000,
    status: "purchased",
    expected_delivery: "2024-12-20",
    created_at: "2024-11-26",
  },
  {
    id: "o3",
    order_ref: "BE-2024-040",
    client_id: "c3",
    supplier_name: "Al Seef Cosmetics",
    supplier_city: "Al Seef, Dubaï",
    items_description: "Cosmétiques variés",
    quantity: 120,
    purchase_price_aed: 850,
    transport_cost_aed: 95,
    sale_price_fcfa: 9800000,
    margin_fcfa: 6100000,
    status: "delivered",
    expected_delivery: "2024-11-28",
    created_at: "2024-11-15",
  },
  {
    id: "o4",
    order_ref: "BE-2024-039",
    client_id: "c4",
    supplier_name: "Dragon Mart Wholesale",
    supplier_city: "Dragon Mart, Dubaï",
    items_description: "Conteneur 20 pieds textile",
    quantity: 1,
    purchase_price_aed: 8500,
    transport_cost_aed: 2200,
    sale_price_fcfa: 65000000,
    margin_fcfa: 12500000,
    status: "sourcing",
    expected_delivery: "2025-01-10",
    created_at: "2024-11-20",
  },
  {
    id: "o5",
    order_ref: "BE-2024-038",
    client_id: "c5",
    supplier_name: "Ras Al Khor Auto Parts",
    supplier_city: "Ras Al Khor, Dubaï",
    items_description: "Pièces auto (filtres + plaquettes)",
    quantity: 200,
    purchase_price_aed: 2100,
    transport_cost_aed: 320,
    sale_price_fcfa: 7500000,
    margin_fcfa: 1850000,
    status: "delivered",
    expected_delivery: "2024-11-20",
    created_at: "2024-11-08",
  },
];

export const mockTasks: Task[] = [
  {
    id: "t1",
    title: "Payer fournisseur iPhone Deira",
    description: "Virement de 5,400 AED à Al-Maktoum Electronics",
    priority: "urgent",
    due_date: new Date().toISOString().split("T")[0],
    completed: false,
  },
  {
    id: "t2",
    title: "Appeler client Bukavu — validation conteneur",
    description: "Patrick Nzuzi doit valider le contenu textile",
    priority: "high",
    due_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    completed: false,
  },
  {
    id: "t3",
    title: "Récupérer facture transport Air Bukavu",
    description: "Facture du fret aérien BE-2024-042",
    priority: "normal",
    due_date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    completed: false,
  },
  {
    id: "t4",
    title: "Relancer Sarah Bahati",
    description: "Nouveau devis cosmétiques",
    priority: "normal",
    due_date: new Date(Date.now() + 259200000).toISOString().split("T")[0],
    completed: false,
  },
];