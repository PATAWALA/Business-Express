// src/components/admin/navigation/MobileTabBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Wallet,
  CheckSquare,
} from "lucide-react";

const tabs = [
  { href: "/admin", label: "Accueil", icon: LayoutDashboard },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/finances", label: "Finances", icon: Wallet },
  { href: "/admin/taches", label: "Tâches", icon: CheckSquare },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex justify-around items-center h-16">
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href ||
          (tab.href !== "/admin" && pathname.startsWith(tab.href));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full ${
              isActive ? "text-blue-600" : "text-slate-500"
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}