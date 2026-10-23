// src/app/(admin)/admin/parametres/page.tsx
import { SettingsClient } from "@/components/admin/settings/SettingsClient";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ParametresPage() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  const fallback = {
    id: 1,
    exchange_rate_aed_to_fcfa: 762,
    updated_at: null,
  };

  return <SettingsClient initialSettings={settings ?? fallback} />;
}