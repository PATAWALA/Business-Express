// src/app/api/settings/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin.from("settings").select("*").eq("id", 1).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function PATCH(request: Request) {
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { exchange_rate_aed_to_fcfa } = await request.json();
  if (!exchange_rate_aed_to_fcfa || exchange_rate_aed_to_fcfa <= 0) {
    return NextResponse.json({ error: "Taux invalide" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("settings")
    .update({
      exchange_rate_aed_to_fcfa,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}