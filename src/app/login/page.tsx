// src/app/login/page.tsx
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/auth/LoginForm";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/admin");

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 overflow-hidden p-4">
      {/* Décor de fond */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#1E50FF]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#FFC700]/20 blur-[120px]" />

      <div className="relative w-full flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}