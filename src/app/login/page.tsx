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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 bg-grid p-4">
      <LoginForm />
    </div>
  );
}