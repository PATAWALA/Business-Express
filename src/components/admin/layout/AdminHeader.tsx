// src/components/admin/layout/AdminHeader.tsx
"use client";

import { useState } from "react";
import { Menu, PanelLeft } from "lucide-react";
import { UserMenu } from "@/components/admin/profile/UserMenu";
import { ProfileModal } from "@/components/admin/profile/ProfileModal";

interface Props {
  userEmail: string;
  onToggleSidebarCollapse: () => void;
  onOpenMobileSidebar: () => void;
}

export function AdminHeader({
  userEmail,
  onToggleSidebarCollapse,
  onOpenMobileSidebar,
}: Props) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 backdrop-blur-md px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Bouton mobile */}
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Bouton collapse desktop */}
          <button
            onClick={onToggleSidebarCollapse}
            className="hidden lg:flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100"
            aria-label="Réduire/Étendre la sidebar"
            title="Réduire/Étendre la sidebar"
          >
            <PanelLeft className="h-5 w-5 text-slate-600" />
          </button>

          <div className="hidden sm:flex items-center gap-2 ml-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-slate-500">
              Système opérationnel
            </span>
          </div>
        </div>

        <UserMenu
          userEmail={userEmail}
          onOpenProfile={() => setProfileOpen(true)}
        />
      </header>

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        userEmail={userEmail}
      />
    </>
  );
}