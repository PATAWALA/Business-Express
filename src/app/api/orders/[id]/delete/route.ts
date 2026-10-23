// src/app/api/orders/[id]/delete/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
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

  // Vérifier que la commande n'est pas livrée
  const { data: order } = await admin
    .from("orders")
    .select("status")
    .eq("id", id)
    .single();

  if (!order)
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

  if (order.status === "delivered")
    return NextResponse.json(
      { error: "Impossible de supprimer une commande livrée" },
      { status: 400 }
    );

  const { error } = await admin.from("orders").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}