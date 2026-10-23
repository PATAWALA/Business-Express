// src/app/api/clients/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("clients")
    .select("*")
    .order("name");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ clients: data ?? [] });
}

export async function POST(request: Request) {
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { name, whatsapp, city, country, type = "client" } = await request.json();
  if (!name) return NextResponse.json({ error: "Nom requis" }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("clients")
    .insert({
      name,
      whatsapp: whatsapp || null,
      phone: whatsapp || null,
      city: city || null,
      country: country || "RDC",
      type,
      total_spent_fcfa: 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ client: data });
}