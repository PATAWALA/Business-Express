// src/components/admin/navigation/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Wallet,
  CheckSquare,
  Settings,
  X,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/finances", label: "Finances", icon: Wallet },
  { href: "/admin/taches", label: "Tâches", icon: CheckSquare },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

interface Props {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 z-50",
          // Desktop
          "lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-64",
          // Mobile
          "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header sidebar */}
        <div
          className={cn(
            "flex items-center h-16 border-b border-slate-800",
            collapsed ? "justify-center px-2" : "justify-between px-4"
          )}
        >
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-sm shrink-0">
              BE
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-none">
                <div className="text-xs font-bold">BUSINESS</div>
                <div className="text-xs font-bold text-blue-400">EXPRESS</div>
              </div>
            )}
          </Link>

          {/* Bouton fermer sur mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-800"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Bouton collapse sur desktop */}
          {!collapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-800"
              aria-label="Réduire"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer - bouton expand si collapsed */}
        {collapsed && (
          <div className="p-3 border-t border-slate-800">
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center h-10 rounded-lg hover:bg-slate-800 text-slate-400"
              aria-label="Étendre"
            >
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}