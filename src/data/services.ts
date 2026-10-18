import { ShoppingBag, Ship, Crown } from "lucide-react";

export const services = [
  {
    id: "sourcing",
    icon: ShoppingBag,
    title: "Achat & Sourcing de Marchandises",
    description:
      "Recherche de fournisseurs à Dubaï, négociation des prix, vérification qualité et consolidation de vos commandes avant expédition.",
    features: ["Fournisseurs vérifiés", "Négociation B2B", "Contrôle qualité"],
    accent: "express",
  },
  {
    id: "logistique",
    icon: Ship,
    title: "Logistique & Expédition Air / Mer",
    description:
      "Groupage, conteneurs complets, dédouanement et livraison sécurisée à Bukavu, Goma, Kinshasa et partout en Afrique.",
    features: ["Fret aérien express", "Conteneurs 20'/40'", "Dédouanement inclus"],
    accent: "gold",
  },
  {
    id: "vip",
    icon: Crown,
    title: "Business & Tourisme VIP à Dubaï",
    description:
      "Visa, hôtels premium, circuits d'affaires, visites des souks et marchés de gros. Un accompagnement sur-mesure à Dubaï.",
    features: ["Assistance visa", "Hôtels 5★", "Circuits privés"],
    accent: "energy",
  },
] as const;