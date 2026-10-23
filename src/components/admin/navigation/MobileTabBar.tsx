// src/components/admin/navigation/MobileTabBar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Wallet,
  MoreHorizontal,
} from "lucide-react";
import { MobileMoreSheet } from "./MobileMoreSheet";
import { ProfileModal } from "@/components/admin/profile/ProfileModal";

const mainTabs = [
  { href: "/admin", label: "Accueil", icon: LayoutDashboard },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/finances", label: "Finances", icon: Wallet },
];

interface Props {
  userEmail?: string;
}

export function MobileTabBar({ userEmail = "" }: Props) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Pages secondaires (Tâches, Paramètres) → "Plus" devient actif
  const isSecondaryActive =
    pathname.startsWith("/admin/taches") ||
    pathname.startsWith("/admin/parametres");

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-stretch h-16">
          {/* 4 onglets principaux */}
          {mainTabs.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href !== "/admin" && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors ${
                  isActive ? "text-blue-600" : "text-slate-500"
                }`}
              >
                <tab.icon
                  className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`}
                />
                <span
                  className={`text-[10px] ${
                    isActive ? "font-semibold" : "font-medium"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}

          {/* Bouton Plus */}
          <button
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors ${
              isSecondaryActive ? "text-blue-600" : "text-slate-500"
            }`}
            aria-label="Plus d'options"
          >
            <MoreHorizontal
              className={`h-5 w-5 ${isSecondaryActive ? "stroke-[2.5]" : ""}`}
            />
            <span
              className={`text-[10px] ${
                isSecondaryActive ? "font-semibold" : "font-medium"
              }`}
            >
              Plus
            </span>
          </button>
        </div>
      </nav>

      <MobileMoreSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        onOpenProfile={() => setProfileOpen(true)}
      />

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        userEmail={userEmail}
      />
    </>
  );
}