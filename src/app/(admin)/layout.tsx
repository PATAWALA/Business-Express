// src/app/(admin)/layout.tsx
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/navigation/AdminSidebar";
import { MobileTabBar } from "@/components/admin/navigation/MobileTabBar";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar userEmail={user.email ?? ""} />
      <div className="lg:pl-64">
        <main className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">{children}</main>
      </div>
      <MobileTabBar />
    </div>
  );
}