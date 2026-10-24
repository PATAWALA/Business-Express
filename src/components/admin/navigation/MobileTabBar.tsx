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
  Inbox,
  MoreHorizontal,
} from "lucide-react";
import { MobileMoreSheet } from "./MobileMoreSheet";
import { ProfileModal } from "@/components/admin/profile/ProfileModal";
import { cn } from "@/lib/utils";

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

  const isSecondaryActive =
    pathname.startsWith("/admin/taches") ||
    pathname.startsWith("/admin/parametres");

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-2px_12px_rgba(15,23,42,0.06)]">
        <div className="flex justify-around items-stretch h-16 px-1">
          {mainTabs.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href !== "/admin" && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative flex flex-col items-center justify-center gap-0.5 flex-1"
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-blue-600" />
                )}
                <tab.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-blue-600 stroke-[2.5]" : "text-slate-400"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] transition-colors",
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-slate-500 font-medium"
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setMoreOpen(true)}
            className="relative flex flex-col items-center justify-center gap-0.5 flex-1"
          >
            {isSecondaryActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-blue-600" />
            )}
            <MoreHorizontal
              className={cn(
                "h-5 w-5 transition-colors",
                isSecondaryActive
                  ? "text-blue-600 stroke-[2.5]"
                  : "text-slate-400"
              )}
            />
            <span
              className={cn(
                "text-[10px] transition-colors",
                isSecondaryActive
                  ? "text-blue-600 font-semibold"
                  : "text-slate-500 font-medium"
              )}
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