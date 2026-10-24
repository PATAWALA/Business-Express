// src/components/admin/layout/AdminHeader.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { PanelLeft, Share2 } from "lucide-react";
import { UserMenu } from "@/components/admin/profile/UserMenu";
import { ProfileModal } from "@/components/admin/profile/ProfileModal";
import { ShareProjectModal } from "@/components/admin/shared/ShareProjectModal";
import { Button } from "@/components/admin/ui/Button";

interface Props {
  userEmail: string;
  onToggleSidebarCollapse: () => void;
}

export function AdminHeader({ userEmail, onToggleSidebarCollapse }: Props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt="Business Express"
            width={40}
            height={40}
            className="lg:hidden h-9 w-auto object-contain"
            priority
          />

          <button
            onClick={onToggleSidebarCollapse}
            className="hidden lg:flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Réduire/Étendre la sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>

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

        <div className="flex items-center gap-2">
          {/* ✅ NOUVEAU BOUTON */}
          <Button
            onClick={() => setShareOpen(true)}
            variant="outline"
            size="sm"
            className="gap-2 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Partager mon lien</span>
          </Button>

          <UserMenu
            userEmail={userEmail}
            onOpenProfile={() => setProfileOpen(true)}
          />
        </div>
      </header>

      <ShareProjectModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        userEmail={userEmail}
      />
    </>
  );
}