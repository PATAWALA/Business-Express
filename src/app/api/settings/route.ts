// src/app/api/settings/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "@/lib/supabase/database.types";

export async function GET() {
  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function PATCH(request: Request) {
  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json();

  const patch: TablesUpdate<"settings"> = {};

  if (typeof body.exchange_rate_aed_to_fcfa === "number" && body.exchange_rate_aed_to_fcfa > 0)
    patch.exchange_rate_aed_to_fcfa = body.exchange_rate_aed_to_fcfa;

  if (typeof body.company_name === "string")
    patch.company_name = body.company_name.trim() || null;
  if (typeof body.company_email === "string")
    patch.company_email = body.company_email.trim() || null;
  if (typeof body.company_phone === "string")
    patch.company_phone = body.company_phone.trim() || null;
  if (typeof body.company_whatsapp === "string")
    patch.company_whatsapp = body.company_whatsapp.trim() || null;
  if (typeof body.company_address_dubai === "string")
    patch.company_address_dubai = body.company_address_dubai.trim() || null;
  if (typeof body.company_address_bukavu === "string")
    patch.company_address_bukavu = body.company_address_bukavu.trim() || null;

  if (typeof body.notifications_enabled === "boolean")
    patch.notifications_enabled = body.notifications_enabled;
  if (typeof body.auto_tasks_enabled === "boolean")
    patch.auto_tasks_enabled = body.auto_tasks_enabled;

  if (Object.keys(patch).length === 0)
    return NextResponse.json({ error: "Rien à modifier" }, { status: 400 });

  patch.updated_at = new Date().toISOString();

  const admin = createAdminClient();
  const { error } = await admin.from("settings").update(patch).eq("id", 1);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}