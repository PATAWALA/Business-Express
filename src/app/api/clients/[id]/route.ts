// src/app/api/clients/[id]/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "@/lib/supabase/database.types";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const admin = createAdminClient();

  const { data: client, error: clientError } = await admin
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (clientError || !client)
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });

  const { data: orders } = await admin
    .from("orders")
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ client, orders: orders ?? [] });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json();

  // ✅ On type explicitement le patch avec le type Update généré par Supabase
  const patch: TablesUpdate<"clients"> = {};

  if (typeof body.name === "string" && body.name.trim())
    patch.name = body.name.trim();
  if ("whatsapp" in body)
    patch.whatsapp = body.whatsapp ? String(body.whatsapp).trim() : null;
  if ("phone" in body)
    patch.phone = body.phone ? String(body.phone).trim() : null;
  if ("city" in body) patch.city = body.city ? String(body.city).trim() : null;
  if ("country" in body)
    patch.country = body.country ? String(body.country).trim() : null;
  if (body.type === "client" || body.type === "prospect")
    patch.type = body.type;
  if ("notes" in body)
    patch.notes = body.notes ? String(body.notes).trim() : null;

  if (Object.keys(patch).length === 0)
    return NextResponse.json({ error: "Rien à modifier" }, { status: 400 });

  patch.updated_at = new Date().toISOString();

  const admin = createAdminClient();
  const { error } = await admin.from("clients").update(patch).eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}