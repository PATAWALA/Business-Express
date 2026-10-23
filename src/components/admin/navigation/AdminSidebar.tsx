// src/components/admin/navigation/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Wallet,
  CheckSquare,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/finances", label: "Finances", icon: Wallet },
  { href: "/admin/taches", label: "Tâches", icon: CheckSquare },
];

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 p-5">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
          BE
        </div>
        <div>
          <div className="text-sm font-bold">BUSINESS</div>
          <div className="text-sm font-bold text-blue-400">EXPRESS</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-5 border-t border-slate-700 space-y-2">
        <div className="px-3 py-2">
          <div className="text-xs text-slate-400">Connecté en tant que</div>
          <div className="text-sm font-semibold truncate">{userEmail}</div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}