// src/components/admin/layout/AdminHeader.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { PanelLeft } from "lucide-react";
import { UserMenu } from "@/components/admin/profile/UserMenu";
import { ProfileModal } from "@/components/admin/profile/ProfileModal";

interface Props {
  userEmail: string;
  onToggleSidebarCollapse: () => void;
}

export function AdminHeader({
  userEmail,
  onToggleSidebarCollapse,
}: Props) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          
          {/* Logo : visible UNIQUEMENT sur mobile (car sidebar cachée) */}
          <Image
            src="/logo.jpeg"
            alt="Business Express"
            width={40}
            height={40}
            className="lg:hidden h-9 w-auto object-contain"
            priority
          />

          {/* Bouton collapse : visible UNIQUEMENT sur desktop */}
          <button
            onClick={onToggleSidebarCollapse}
            className="hidden lg:flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Réduire/Étendre la sidebar"
            title="Réduire/Étendre la sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>

          {/* Statut système */}
          <div className="hidden sm:flex items-center gap-2 ml-2">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
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