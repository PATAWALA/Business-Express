// src/components/admin/layout/AdminHeader.tsx
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { UserMenu } from "@/components/admin/profile/UserMenu";
import { ProfileModal } from "@/components/admin/profile/ProfileModal";

export function AdminHeader({ userEmail }: { userEmail: string }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 backdrop-blur-md px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Menu className="h-5 w-5 text-slate-400 lg:hidden" />
          <div className="hidden sm:flex items-center gap-2">
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