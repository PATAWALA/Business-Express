// src/components/admin/navigation/AdminSidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Wallet,
  CheckSquare,
  Settings,
  Inbox,
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
  userEmail?: string;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  collapsed,
  mobileOpen,
  userEmail = "",
  onToggleCollapse,
  onCloseMobile,
}: Props) {
  const pathname = usePathname();

  const initials = userEmail ? userEmail.substring(0, 2).toUpperCase() : "BE";

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 z-50",
          "bg-white border-r border-slate-200",
          "lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-64",
          "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo header */}
        <div
          className={cn(
            "flex items-center h-16 border-b border-slate-100",
            collapsed ? "justify-center px-2" : "justify-between px-4"
          )}
        >
          <Link href="/admin" className="flex items-center gap-2.5">
            {/* Logo réel */}
            <Image
              src="/logo.jpeg"
              alt="Business Express"
              width={36}
              height={36}
              className="h-9 w-auto object-contain shrink-0"
              priority
            />
            {!collapsed && (
              <div className="flex flex-col leading-none">
                <div className="text-xs font-bold text-slate-900 tracking-wide">
                  BUSINESS
                </div>
                <div className="text-xs font-bold text-blue-600 tracking-wide">
                  EXPRESS
                </div>
              </div>
            )}
          </Link>

          {/* Fermeture mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Collapse desktop */}
          {!collapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              aria-label="Réduire"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {!collapsed && (
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
              Menu
            </div>
          )}
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 shadow-sm shadow-blue-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-blue-600" />
                )}
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Profil footer */}
        <div className="border-t border-slate-100 p-3">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-bold shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-900 truncate">
                  Prince Bockson
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {userEmail || "Administrateur"}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-bold">
                {initials}
              </div>
            </div>
          )}

          {collapsed && (
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center h-8 mt-3 rounded-lg hover:bg-slate-100 text-slate-400"
              aria-label="Étendre"
            >
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}