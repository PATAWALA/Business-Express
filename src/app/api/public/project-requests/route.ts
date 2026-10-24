// src/app/api/public/project-requests/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateNextOrderRef } from "@/lib/order-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, whatsapp, city, project_type, budget, description } = body;

    if (!full_name?.trim() || !whatsapp?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const cleanWhatsapp = whatsapp.replace(/\D/g, "");

    const { data: existingClients } = await admin
      .from("clients")
      .select("id")
      .or(`whatsapp.eq.${whatsapp},whatsapp.eq.+${cleanWhatsapp}`)
      .limit(1);

    let clientId: string;
    if (existingClients && existingClients.length > 0) {
      clientId = existingClients[0].id;
    } else {
      const { data: newClient, error: clientError } = await admin
        .from("clients")
        .insert({
          name: full_name.trim(),
          whatsapp: whatsapp.trim(),
          phone: whatsapp.trim(),
          city: city.trim(),
          country: "RDC",
          type: "prospect",
        })
        .select("id")
        .single();

      if (clientError || !newClient) throw new Error("Erreur création client");
      clientId = newClient.id;
    }

    const order_ref = await generateNextOrderRef(admin);
    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        order_ref,
        client_id: clientId,
        items_description: description.trim(),
        project_type: project_type || null,
        quantity: 1,
        status: "new",
        source: "public",
        source_detail: `Budget : ${budget || "Non spécifié"}`,
      })
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);

    const { data: settings } = await admin
      .from("settings")
      .select("company_whatsapp")
      .eq("id", 1)
      .single();

    const agentWhatsapp = (settings?.company_whatsapp || "+243970000000").replace(/\D/g, "");

    return NextResponse.json({
      success: true,
      order_ref: order.order_ref,
      agent_whatsapp: agentWhatsapp,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}