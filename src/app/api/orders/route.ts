// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { generateNextOrderRef, generateTasksForOrder } from "@/lib/order-utils";

export async function POST(request: Request) {
  // Auth check
  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();
  const {
    client_id,
    items_description,
    quantity,
    supplier_name,
    supplier_city,
    purchase_price_aed,
    transport_cost_aed,
    sale_price_fcfa,
    exchange_rate_aed_to_fcfa,
    expected_delivery,
    source = "manual",
    source_detail,
    status = "sourcing",
  } = body;

  if (!client_id || !items_description || !sale_price_fcfa) {
    return NextResponse.json(
      { error: "Client, description et prix de vente requis" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Génère la réf
  const order_ref = await generateNextOrderRef(admin);

  // Calcul marge
  const rate = exchange_rate_aed_to_fcfa ?? 762;
  const costAed = (purchase_price_aed ?? 0) + (transport_cost_aed ?? 0);
  const margin_fcfa = Math.round(sale_price_fcfa - costAed * rate);

  // Insert
  const { data, error } = await admin
    .from("orders")
    .insert({
      order_ref,
      client_id,
      items_description,
      quantity: quantity ?? 1,
      supplier_name: supplier_name || null,
      supplier_city: supplier_city || null,
      purchase_price_aed: purchase_price_aed ?? 0,
      transport_cost_aed: transport_cost_aed ?? 0,
      sale_price_fcfa,
      margin_fcfa,
      exchange_rate_aed_to_fcfa: rate,
      expected_delivery: expected_delivery || null,
      status,
      source,
      source_detail: source_detail || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Génère tâches auto
  const { data: client } = await admin
    .from("clients")
    .select("name")
    .eq("id", client_id)
    .single();

  const autoTasks = generateTasksForOrder({
    order_ref,
    client_name: client?.name,
    items_description,
    purchase_price_aed: purchase_price_aed ?? null,
    status,
  });

  if (autoTasks.length > 0) {
    await admin.from("tasks").insert(autoTasks);
  }

  return NextResponse.json({ success: true, order: data });
}