// src/app/(admin)/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/navigation/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { MobileTabBar } from "@/components/admin/navigation/MobileTabBar";
import { ToastProvider } from "@/components/admin/ui/ToastProvider";  // ← AJOUT
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

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
    <ToastProvider>
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
            collapsed ? "lg:ml-20" : "lg:ml-64"
          )}
        >
          <AdminHeader
            userEmail={userEmail}
            onToggleSidebarCollapse={() => setCollapsed(!collapsed)}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            {children}
          </main>
        </div>

        <MobileTabBar userEmail={userEmail} />
      </div>
    </ToastProvider>
  );
}