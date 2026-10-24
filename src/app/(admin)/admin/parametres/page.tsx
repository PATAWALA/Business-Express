// src/app/(admin)/admin/parametres/page.tsx
import { SettingsClient } from "@/components/admin/settings/SettingsClient";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Settings } from "@/lib/order-client";

export const dynamic = "force-dynamic";

export default async function ParametresPage() {
  const supabase = createAdminClient();
  const supabaseAuth = await createClient();
  
  // Récupérer l'utilisateur connecté
  const { data: { user } } = await supabaseAuth.auth.getUser();

  // Récupérer les paramètres
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  const fallback: Settings = {
    id: 1,
    exchange_rate_aed_to_fcfa: 762,
    exchange_rate_usd_to_fcfa: 2800,
    updated_at: null,
    company_name: "Business Express",
    company_email: "contact@business-express.cd",
    company_phone: "+243 970 000 000",
    company_whatsapp: "+243 970 000 000",
    company_address_dubai: "Deira, Dubaï, EAU",
    company_address_bukavu: "Boulevard Kivu, Bukavu, RDC",
    notifications_enabled: true,
    auto_tasks_enabled: true,
  };

  return (
    <SettingsClient 
      settings={(settings as Settings | null) ?? fallback} 
      userEmail={user?.email ?? "businessexpress@gmail.com"} // ✅ Ajouté
    />
  );
}