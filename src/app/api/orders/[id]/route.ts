// src/app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select("*, clients(*)")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ order: data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json();
  const admin = createAdminClient();

  // Recalcul marge si les prix changent
  if (
    "purchase_price_aed" in body ||
    "transport_cost_aed" in body ||
    "sale_price_fcfa" in body ||
    "exchange_rate_aed_to_fcfa" in body
  ) {
    const { data: current } = await admin
      .from("orders")
      .select("purchase_price_aed, transport_cost_aed, sale_price_fcfa, exchange_rate_aed_to_fcfa")
      .eq("id", id)
      .single();

    if (current) {
      const purchase = body.purchase_price_aed ?? current.purchase_price_aed ?? 0;
      const transport = body.transport_cost_aed ?? current.transport_cost_aed ?? 0;
      const sale = body.sale_price_fcfa ?? current.sale_price_fcfa ?? 0;
      const rate = body.exchange_rate_aed_to_fcfa ?? current.exchange_rate_aed_to_fcfa ?? 762;
      body.margin_fcfa = Math.round(sale - (purchase + transport) * rate);
    }
  }

  body.updated_at = new Date().toISOString();

  const { error } = await admin.from("orders").update(body).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}