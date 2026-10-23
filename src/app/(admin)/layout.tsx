// src/app/(admin)/layout.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/navigation/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { MobileTabBar } from "@/components/admin/navigation/MobileTabBar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Auth guard côté client + récupération email
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
      } else {
        setUserEmail(data.user.email ?? "");
      }
      setLoading(false);
    });
  }, [router]);

  // Fermer la sidebar mobile à chaque changement de page
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 text-sm">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          "lg:ml-64",
          collapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        <AdminHeader
          userEmail={userEmail}
          onToggleSidebarCollapse={() => setCollapsed(!collapsed)}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      <MobileTabBar />
    </div>
  );
}